import { TestBed } from '@angular/core/testing';
import { ManagementDialogService } from './management-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';

describe('ManagementDialogService', () => {
	let service: ManagementDialogService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [BrowserModule, MatDialogModule],
		});
		service = TestBed.inject(ManagementDialogService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
