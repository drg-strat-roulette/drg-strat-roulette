import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RecentlyCompletedAchievementComponent } from './recently-completed-achievement.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('RecentlyCompletedAchievementComponent', () => {
	let component: RecentlyCompletedAchievementComponent;
	let fixture: ComponentFixture<RecentlyCompletedAchievementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
			declarations: [RecentlyCompletedAchievementComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(RecentlyCompletedAchievementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
