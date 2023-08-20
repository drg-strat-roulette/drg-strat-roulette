import { TestBed } from '@angular/core/testing';

import { HeaderControlsService } from './header-controls.service';

describe('HeaderControlsService', () => {
  let service: HeaderControlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderControlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
