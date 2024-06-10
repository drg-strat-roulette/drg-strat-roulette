import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayedAchievement } from 'src/app/models/achievement.interface';

@Component({
	selector: 'app-achievement-card',
	templateUrl: './achievement-card.component.html',
	styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent {
	/** Achievement to be displayed in this card */
	@Input() achievement: DisplayedAchievement | undefined;

	/** Emits when complete button is pressed (with throttle) */
	@Output() toggleComplete: EventEmitter<void> = new EventEmitter();

	/** Emits when counter is incremented/decremented */
	@Output() changeCounter: EventEmitter<number> = new EventEmitter();

	/** Emits when a sub-task is (un)completed */
	@Output() subTaskCompleted: EventEmitter<SubTaskCompletedEvent> = new EventEmitter();

	constructor() {}
}

export interface SubTaskCompletedEvent {
	subTaskId: string;
	completed: boolean;
}
