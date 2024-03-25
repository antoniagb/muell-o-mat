// arduino.service.ts - Angular Service
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ClassificationResult {
  biological?: number;
  paper?: number;
  paperCup?: number;
  plastic?: number;
  receipt?: number;
  tetraPak?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArduinoDataService {
  private dataSubject = new Subject<ClassificationResult>();

  constructor() {
    this.connectToWebSocket();
  }

  private connectToWebSocket() {
    const ws = new WebSocket('ws://localhost:5678');

    ws.onmessage = (event) => {
      try {
        const data: ClassificationResult = JSON.parse(event.data);
        this.dataSubject.next(data);
      } catch (e) {
        console.error('Error parsing JSON', e);
        // Handle any errors that occur during parsing here
      }
    };
  }

  public getDataStream(): Observable<ClassificationResult> {
    return this.dataSubject.asObservable();
  }
}
