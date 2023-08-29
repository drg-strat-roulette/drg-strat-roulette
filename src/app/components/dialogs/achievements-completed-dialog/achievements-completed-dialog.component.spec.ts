import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementsCompletedDialog } from './achievements-completed-dialog.component';

describe('AchievementsCompletedDialog', () => {
	let component: AchievementsCompletedDialog;
	let fixture: ComponentFixture<AchievementsCompletedDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AchievementsCompletedDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(AchievementsCompletedDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
