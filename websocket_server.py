import asyncio
import json
import re
import serial
import websockets

# Regex-Pattern um die relevanten Daten zu extrahieren
classification_pattern = re.compile(r'(ballpen|receipt|yoghurt):\s+(\d+\.\d+)')

def parse_classification_results(data):
    # Findet alle Übereinstimmungen des Patterns im Text
    matches = classification_pattern.findall(data)
    # Wandelt die gefundenen Übereinstimmungen in ein Wörterbuch um
    results = {match[0]: float(match[1]) for match in matches}
    return results

async def read_serial_data(port):
    # Buffer für die Eingangsdaten
    data_buffer = ""
    
    while True:
        if port.in_waiting > 0:
            data_buffer += port.readline().decode('utf-8').rstrip()
            # Überprüfen, ob wir alle Daten einer Vorhersage erhalten haben
            if "yoghurt" in data_buffer:
                # Parse die gesammelten Daten
                classification_results = parse_classification_results(data_buffer)
                # Bereiten Sie die Daten als JSON vor
                json_data = json.dumps(classification_results)
                print(f"Empfangene Klassifikationsergebnisse: {json_data}")
                data_buffer = ""  # Buffer zurücksetzen
                await asyncio.sleep(0)  # Kontrolle zurückgeben
                yield json_data

async def send_serial_data(websocket, path):
    ser = serial.Serial('COM5', 115200, timeout=1)  # COM-Port anpassen
    ser.write(b'AT+RUNIMPULSE\r\n')  # Befehl senden
    await asyncio.sleep(2)  # Warte auf die Antwort

    try:
        async for json_data in read_serial_data(ser):
            await websocket.send(json_data)
    finally:
        ser.close()

start_server = websockets.serve(send_serial_data, 'localhost', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
