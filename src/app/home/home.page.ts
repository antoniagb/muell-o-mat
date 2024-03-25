import { Component, inject } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { TrashCategories } from '../enums/trash-categories';

import { ArduinoDataService, ClassificationResult } from '../services/arduino-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  classificationResults: ClassificationResult = {};
  predictions: string[] = [];
  classifiedTrashCategory: string = '';
  classifiedCategory: string = '';

  constructor(private arduinoDataService: ArduinoDataService) {}

  ngOnInit() {
    this.arduinoDataService.getDataStream().subscribe(
      (data: ClassificationResult) => {
        this.predictions = [];
        this.classificationResults = data;
        for (const [key, value] of Object.entries(this.classificationResults)) {
          console.log(`${key}: ${value}`);
          this.predictions.push(`${key}: ${value}`);
        }
        // search for the highest value in the predictions
        let highestValue = 0;
        let highestKey = '';
        for (const [key, value] of Object.entries(this.classificationResults)) {
          if (value > highestValue) {
            highestValue = value;
            highestKey = key;
            this.classifiedCategory = key;
          }
        }

        // search for the corresponding trash category
        for (const [key, value] of Object.entries(TrashCategories)) {
          for (const [subKey, subValue] of Object.entries(value)) {
            if (subKey === highestKey) {
              if (key === 'trash') {
                this.classifiedTrashCategory = 'Restmüll';
              } else if (key === 'plastic') {
                this.classifiedTrashCategory = 'Wertstoffmüll';
              } else {
                this.classifiedTrashCategory = 'Papiermüll';
              }
              console.log(`Classified trash category: ${this.classifiedTrashCategory}`);
            }
          }
        }

      },
      error => {
        console.error('Error receiving data:', error);
      }
    );
  }
}
