import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AchievementKeys } from 'src/app/models/local-storage.interface';
import { HeaderControlsService } from 'src/app/services/header-controls.service';
import { AchievementsWelcomeDialogComponent } from '../achievements-welcome-dialog/achievements-welcome-dialog.component';
import { SnackbarConfig, SnackbarWithIconComponent } from '../snackbar-with-icon/snackbar-with-icon.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { AchievementProgress, DisplayedAchievement } from 'src/app/models/achievement.model';
import { achievementsList } from 'src/app/data/achievements.const';
import { clamp } from 'lodash-es';

@Component({
	selector: 'app-achievements',
	templateUrl: './achievements.component.html',
	styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
	hazardLevel = 5;
	achievements: DisplayedAchievement[] = [];

	private destroy: Subject<void> = new Subject();

	constructor(
		private headerControlsService: HeaderControlsService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private clipboard: Clipboard
	) {}

	@HostListener('document:keypress', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		if (event.key === 'Enter') this.saveProgress();
	}

	ngOnInit(): void {
		// Display welcome dialog to new users
		const hasSeenAchievementsWelcomeDialog = localStorage.getItem(AchievementKeys.hasSeenAchievementsWelcomeDialog);
		if (hasSeenAchievementsWelcomeDialog !== 'true') {
			this.openWelcomeDialog();
		}

		// Subscribe to events from header control button presses
		this.headerControlsService.infoButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.openWelcomeDialog());
		this.headerControlsService.shareButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.copyShareText());
		this.headerControlsService.settingsButtonPressed$.pipe(takeUntil(this.destroy));
		// .subscribe(() => (this.settingsMenuCollapsed = !this.settingsMenuCollapsed));

		// Load and merge achievements and completion statuses
		const progress: AchievementProgress[] = [{ id: 4, subTasksCompleted: [1] }];
		this.achievements = achievementsList.map((a) => ({
			...a,
			...progress.find((p) => p.id === a.id),
		}));
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.complete();
	}

	/**
	 * Marks an achievement as having been (un)completed
	 * Also updates the state of all subTasks and counters
	 * @param achievement - Achievement to be updated
	 */
	toggleComplete(achievement: DisplayedAchievement) {
		if (achievement.completedAt) {
			// Mark uncompleted
			achievement.completedAt = undefined;
			achievement.subTasksCompleted = achievement.subTasks ? [] : undefined;
			if (achievement.countNeeded) {
				achievement.count = 0;
			}
		} else {
			// Mark completed
			achievement.completedAt = new Date();
			if (!this.allSubTasksCompleted(achievement)) {
				achievement.subTasksCompleted = achievement.subTasks?.map((t) => t.id);
			}
			achievement.count = achievement.countNeeded;
		}
	}

	/**
	 * Marks a subTask of an achievement as having been (un)completed
	 * Updates the completion state
	 * @param achievement - Achievement to be updated
	 * @param subTaskId - ID of subTask which has been changed
	 * @param checked - New completion state of the subTask
	 */
	subTaskCompleted(achievement: DisplayedAchievement, subTaskId: number, checked: boolean) {
		if (!achievement?.subTasksCompleted) {
			// Init list if undefined
			achievement.subTasksCompleted = [];
		}
		if (checked) {
			// Mark subTask completed
			achievement?.subTasksCompleted?.push(subTaskId);
			// If all subTasks are completed, the achievement is also completed
			if (this.allSubTasksCompleted(achievement)) {
				this.toggleComplete(achievement);
			}
		} else {
			// Mark subTask uncompleted
			achievement?.subTasksCompleted?.splice(achievement?.subTasksCompleted?.indexOf(subTaskId), 1);
		}
	}

	/**
	 * Increments/decrements an achievement counter while keeping the counter within [0, countNeeded]
	 * Marks the achievement as completed if countNeeded has been reached
	 * @param achievement - Achievement to update counter on
	 * @param delta - Number to increase/decrease counter by
	 */
	changeCounter(achievement: DisplayedAchievement, delta: number) {
		achievement.count = clamp((achievement.count ?? 0) + delta, 0, achievement.countNeeded!);
		if (!achievement.completedAt && achievement.count === achievement.countNeeded) {
			// Mark achievement completed
			this.toggleComplete(achievement);
		}
	}

	saveProgress() {
		const progress: AchievementProgress[] = this.achievements
			.filter((a) => a.completedAt || a.count || a.subTasksCompleted)
			.map((a) => ({
				id: a.id,
				completedAt: a.completedAt,
				count: a.count,
				subTasksCompleted: a.subTasksCompleted,
			}));
		console.log(JSON.stringify(progress));
	}

	/**
	 * Opens the welcome dialog which explains how to use the app
	 */
	openWelcomeDialog(): void {
		const welcomeDialog = this.dialog.open(AchievementsWelcomeDialogComponent);
		welcomeDialog
			.afterClosed()
			.subscribe(() => localStorage.setItem(AchievementKeys.hasSeenAchievementsWelcomeDialog, 'true'));
	}

	/**
	 * Copy text and current URL to clipboard
	 * to enable quickly sharing site
	 */
	copyShareText(): void {
		let stringToCopy = 'Check out these 351 unofficial achievements for Deep Rock Galactic!\n';
		stringToCopy += window.location.href;
		this.clipboard.copy(stringToCopy);
		this.snackbar.openFromComponent(SnackbarWithIconComponent, {
			duration: 5000,
			data: {
				text: 'Link copied to clipboard.',
				prefixIcon: 'assignment',
			} as SnackbarConfig,
		});
	}

	/**
	 * Checks whether all subTasks in an achievement have been completed
	 * @param achievement - Achievement to check
	 * @returns true is all subTasks in an achievement have been completed, false otherwise
	 */
	private allSubTasksCompleted(achievement: DisplayedAchievement) {
		return achievement?.subTasks?.every((t) => achievement?.subTasksCompleted?.includes(t.id));
	}
}
