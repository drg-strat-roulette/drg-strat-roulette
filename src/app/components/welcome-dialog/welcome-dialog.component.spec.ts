import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { WelcomeDialogComponent } from './welcome-dialog.component';

describe('WelcomeDialogComponent', () => {
	let component: WelcomeDialogComponent;
	let fixture: ComponentFixture<WelcomeDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [WelcomeDialogComponent],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(WelcomeDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
