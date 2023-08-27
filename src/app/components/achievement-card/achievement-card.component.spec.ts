import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AchievementCardComponent } from './achievement-card.component';

describe('AchievementCardComponent', () => {
	let component: AchievementCardComponent;
	let fixture: ComponentFixture<AchievementCardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatCheckboxModule, MatIconModule, MatTooltipModule],
			declarations: [AchievementCardComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AchievementCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
