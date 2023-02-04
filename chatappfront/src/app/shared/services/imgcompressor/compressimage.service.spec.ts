import { TestBed } from '@angular/core/testing';

import { CompressimageService } from './compressimage.service';

describe('CompressimageService', () => {
  let service: CompressimageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompressimageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
