import { Component, OnDestroy } from '@angular/core';
import { TrashCategories } from '../enums/trash-categories';
import { take } from 'rxjs/operators';

import { ArduinoDataService, ClassificationResult } from '../services/arduino-data.service';
import { Subscription } from 'rxjs';


interface CategoryCount {
  [category: string]: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnDestroy{
  private dataSubscription: Subscription | undefined;
  private categoryCounts: CategoryCount = {};
  private results: ClassificationResult[] = [];

  classificationResults: ClassificationResult = {};
  predictions: string[] = [];
  classifiedTrashCategory: string = '';
  classifiedCategory: string = '';
  buttonPressed: boolean = false;
  isLoading: boolean = false;

  constructor(private arduinoDataService: ArduinoDataService) {}

  ngOnInit() {
    this.classifiedTrashCategory = '';
    this.classifiedCategory = '';
  }

  private readData() {
    console.log('Reading data');
    this.results = [];
    this.dataSubscription = this.arduinoDataService.getDataStream()
      .pipe(take(3))
      .subscribe(
        (data: ClassificationResult) => {
          console.log('Received data');
          this.results.push(data);

          if (this.results.length === 3) {
            this.determineMostFrequentCategory();
          }
        },
        error => {
          console.error('Error receiving data:', error);
        }
      );
  }

  private determineMostFrequentCategory() {
    this.categoryCounts = {};

    for (const result of this.results) {
      let highestValue = 0;
      let highestKey = '';

      for (const [key, value] of Object.entries(result)) {
        console.log(`${key}: ${value}`);
        if (value > highestValue) {
          highestValue = value;
          highestKey = key;
        }
      }

      if (highestKey) {
        if (!this.categoryCounts[highestKey]) {
          this.categoryCounts[highestKey] = 1;
        } else {
          this.categoryCounts[highestKey]++;
        }
        console.log(`Highest key: ${highestKey}`);
      }
      console.log(`Category counts: ${JSON.stringify(this.categoryCounts)}`);
    }

    let finalCategory = '';
    let maxCount = 0;

    for (const [key, count] of Object.entries(this.categoryCounts)) {
      if (count > maxCount) {
        finalCategory = key;
        maxCount = count;
      }
    }

    console.log(`Most frequent category: ${finalCategory}`);
    // Setzen Sie hier Ihre endgültige Kategorie
    this.classifiedCategory = finalCategory;  

    for (const [key, value] of Object.entries(TrashCategories)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subKey === finalCategory) {
          this.classifiedCategory = subValue;
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
      this.isLoading = false;
    }

    // setze einen timer von 7 sekunden, danach kann der button wieder gedrückt werden
    setTimeout(() => {
      this.buttonPressed = false;
    }, 7000);
  }

  ngOnDestroy() {
    this.dataSubscription?.unsubscribe();
  }

  onButtonPressed() {
    this.buttonPressed = true;
    this.predictions = [];
    this.classifiedTrashCategory = '';
    this.classifiedCategory = '';
    this.classificationResults = {};
    this.isLoading = true;
    this.readData();
  }

  getTrashColor(category: string): string {
    if (category === 'Wertstoffmüll') {
      return 'yellow';
    } else if (category === 'Papiermüll') {
      return 'blue';
    } else {
      return 'black';
    }
  }
}
