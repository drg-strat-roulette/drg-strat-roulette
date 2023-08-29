import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';
import { MockComponent } from 'ng-mocks';
import { AchievementsComponent } from './achievements.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

describe('AchievementsComponent', () => {
	let component: AchievementsComponent;
	let fixture: ComponentFixture<AchievementsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				FormsModule,
				MatDialogModule,
				MatInputModule,
				MatFormFieldModule,
				MatProgressBarModule,
				MatSelectModule,
				MatSnackBarModule,
			],
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
