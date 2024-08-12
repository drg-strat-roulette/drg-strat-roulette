import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AchievementCardComponent } from './achievement-card.component';
import { MOCK_DISPLAYED_ACHIEVEMENT } from 'src/app/mocks/achievements.mock';

describe('AchievementCardComponent', () => {
	let component: AchievementCardComponent;
	let fixture: ComponentFixture<AchievementCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatCheckboxModule, MatIconModule, MatTooltipModule, AchievementCardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AchievementCardComponent);
		component = fixture.componentInstance;
		component.achievement = MOCK_DISPLAYED_ACHIEVEMENT;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
