import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayedAchievement } from 'src/app/models/achievement.interface';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton, MatButton } from '@angular/material/button';

@Component({
	selector: 'app-achievement-card',
	templateUrl: './achievement-card.component.html',
	styleUrls: ['./achievement-card.component.scss'],
	standalone: true,
	imports: [MatIconButton, MatTooltip, MatIcon, NgIf, MatButton, NgFor, MatCheckbox, DatePipe],
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
