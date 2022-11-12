import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SnackbarWithIconComponent } from './snackbar-with-icon.component';

describe('SnackbarWithIconComponent', () => {
	let component: SnackbarWithIconComponent;
	let fixture: ComponentFixture<SnackbarWithIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SnackbarWithIconComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SnackbarWithIconComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
