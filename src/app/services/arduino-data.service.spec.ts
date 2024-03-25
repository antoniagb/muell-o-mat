import { TestBed } from '@angular/core/testing';

import { ArduinoDataService } from './arduino-data.service';

describe('ArduinoDataService', () => {
  let service: ArduinoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArduinoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
