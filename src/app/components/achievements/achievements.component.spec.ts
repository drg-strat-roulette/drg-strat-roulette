import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AchievementsComponent } from './achievements.component';

describe('AchievementsComponent', () => {
	let component: AchievementsComponent;
	let fixture: ComponentFixture<AchievementsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				MatCardModule,
				MatCheckboxModule,
				MatDialogModule,
				MatIconModule,
				MatSnackBarModule,
			],
			declarations: [AchievementsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AchievementsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
