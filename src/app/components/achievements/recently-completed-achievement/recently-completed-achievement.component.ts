import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, interval, takeUntil } from 'rxjs';
import { DisplayedAchievement } from 'src/app/models/achievement.model';

// Time before this alert auto-disappears
const ALERT_LIFETIME_MS = 7_000;

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

	private start = Date.now();
	private destroy: Subject<void> = new Subject();

	constructor() {}

	ngOnInit(): void {
		// Update progress every ~50ms (Less often due to processing delays)
		interval(50)
			.pipe(takeUntil(this.destroy))
			.subscribe(() => {
				// Recompute percentage of way to ALERT_LIFETIME_MS
				this.timeAlive = ((Date.now() - this.start) * 100) / ALERT_LIFETIME_MS;
				// Kill component once ALERT_LIFETIME_MS is reached
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
