import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';
import { DisplayedAchievement } from 'src/app/models/achievement.model';

const MAX_LIFETIME = 10_000;

@Component({
	selector: 'app-recently-completed-achievement',
	templateUrl: './recently-completed-achievement.component.html',
	styleUrls: ['./recently-completed-achievement.component.scss'],
})
export class RecentlyCompletedAchievementComponent implements OnInit, OnDestroy {
	/** Achievement to be represented by this notification */
	@Input() achievement: DisplayedAchievement | undefined;

	/** Function to call when this component has exceeded its lifespan */
	@Output() kill: EventEmitter<void> = new EventEmitter();

	/** Function to call if undo button is pressed */
	@Output() undo: EventEmitter<void> = new EventEmitter();

	/** Counts 0-100 throughout the defined lifetime */
	timeAlive = 0;

	private destroy: Subject<void> = new Subject();
	constructor() {}

	ngOnInit(): void {
		// Tick timeAlive every 1/100th of MAX_LIFETIME
		interval(MAX_LIFETIME / 100)
			.pipe(takeUntil(this.destroy))
			.subscribe(() => {
				this.timeAlive += 1;
				// Kill component once MAX_LIFETIME is reached
				if (this.timeAlive >= 100) {
					this.kill.emit();
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.complete();
	}
}
