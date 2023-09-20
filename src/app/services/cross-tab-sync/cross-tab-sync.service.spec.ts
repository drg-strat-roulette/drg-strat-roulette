import { TestBed } from '@angular/core/testing';
import { CrossTabSyncService } from './cross-tab-sync.service';

describe('HeaderControlsService', () => {
	let service: CrossTabSyncService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CrossTabSyncService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
