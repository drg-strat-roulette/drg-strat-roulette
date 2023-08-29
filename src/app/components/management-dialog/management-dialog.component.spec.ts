import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagementDialog } from './management-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ManagementDialog', () => {
	let component: ManagementDialog;
	let fixture: ComponentFixture<ManagementDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ManagementDialog],
			providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }],
		}).compileComponents();

		fixture = TestBed.createComponent(ManagementDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
