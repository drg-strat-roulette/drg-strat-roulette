import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';
import { MockComponent } from 'ng-mocks';

import { AchievementsComponent } from './achievements.component';

describe('AchievementsComponent', () => {
	let component: AchievementsComponent;
	let fixture: ComponentFixture<AchievementsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [BrowserAnimationsModule, MatDialogModule, MatSnackBarModule],
			declarations: [AchievementsComponent, MockComponent(AchievementCardComponent)],
		}).compileComponents();

		fixture = TestBed.createComponent(AchievementsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
