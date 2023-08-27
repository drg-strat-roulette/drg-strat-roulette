import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DisplayedAchievement } from 'src/app/models/achievement.model';

@Component({
	selector: 'app-achievement-card',
	templateUrl: './achievement-card.component.html',
	styleUrls: ['./achievement-card.component.scss'],
	animations: [
		trigger('slideInOut', [
			transition(':enter', [
				style({ marginTop: '-100%' }),
				animate('800ms ease-in-out', style({ marginTop: '0px' })),
			]),
		]),
	],
})
export class AchievementCardComponent implements OnInit {
	@Input() achievement: DisplayedAchievement | undefined;

	@Output() toggleComplete: EventEmitter<void> = new EventEmitter();
	@Output() changeCounter: EventEmitter<number> = new EventEmitter();
	@Output() subTaskCompleted: EventEmitter<SubTaskCompletedEvent> = new EventEmitter();

	constructor() {}

	ngOnInit(): void {}
}

export interface SubTaskCompletedEvent {
	subTaskId: number;
	completed: boolean;
}
