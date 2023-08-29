import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { animate, style, transition, trigger } from '@angular/animations';
import { byCompletionDateThenById } from 'src/app/utilities/sorters.utils';
import { AchievementsCompletedDialog } from '../achievements-completed-dialog/achievements-completed-dialog.component';

@Component({
	selector: 'app-achievements',
	templateUrl: './achievements.component.html',
	styleUrls: ['./achievements.component.scss'],
	animations: [
		trigger('slideInOutRight', [
			transition(':enter', [
				style({ opacity: 0, transform: 'translateX(100%)' }),
				animate('250ms ease-in-out', style({ opacity: 1, transform: 'translateX(0)' })),
			]),
			transition(':leave', [
				style({ opacity: 1, transform: 'translateX(0)' }),
				animate('250ms ease-in-out', style({ opacity: 0, transform: 'translateX(100%)' })),
			]),
		]),
	],
})
export class AchievementsComponent implements OnInit {
	/** List of all achievements */
	achievements: DisplayedAchievement[] = [];

	/** Recently completed achievements */
	recentlyCompletedAchievements: { achievement: DisplayedAchievement; kill: () => void; undo: () => void }[] = [];

	/** Whether to animate achievements being (un)completed */
	disableAnimations = true;

	/** Total number of completed achievements */
	numAchievementsCompleted = 0;

	/** Number of achievements displayed after search/filter */
	numAchievementsDisplayed = 0;

	/** Number of completed achievements displayed after search/filter */
	numCompletedDisplayed = 0;

	/** Filter criteria */
	displayedCompletions: 'all' | 'completed' | 'uncompleted' = 'all';

	/** Achievement search input */
	searchInput: string = '';

	private destroy: Subject<void> = new Subject();

	constructor(
		private headerControlsService: HeaderControlsService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private clipboard: Clipboard,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		// Display welcome dialog to new users
		const hasSeenAchievementsWelcomeDialog = localStorage.getItem(AchievementKeys.hasSeenAchievementsWelcomeDialog);
		if (hasSeenAchievementsWelcomeDialog !== 'true') {
			this.openWelcomeDialog();
		}

		// Load and merge achievements and completion statuses
		const progress: AchievementProgress[] = JSON.parse(localStorage.getItem(AchievementKeys.progress) ?? '[]');
		this.achievements = achievementsList.map((a) => ({
			...a,
			...progress.find((p) => p.id === a.id),
			display: true,
		}));
		this.sortAchievements();

		// Subscribe to events from header control button presses
		this.headerControlsService.infoButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.openWelcomeDialog());
		this.headerControlsService.shareButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.copyShareText());
		this.headerControlsService.settingsButtonPressed$.pipe(takeUntil(this.destroy));
		// .subscribe(() => (this.settingsMenuCollapsed = !this.settingsMenuCollapsed)); // TODO: Settings

		// Prevent animations from being applied to the initial list of achievements
		setTimeout(() => (this.disableAnimations = false), 0);

		// Register development functions
		(window as any).unlockAll = (s: string) => {
			if (s !== 'please') return;
			this.achievements.filter((a) => !a.completedAt).forEach((a) => this.toggleComplete(a, true));
			this.changeDetectorRef.detectChanges();
		};

		(window as any).lockAll = (s: string) => {
			if (s !== 'please') return;
			this.achievements.filter((a) => a.completedAt).forEach((a) => this.toggleComplete(a));
			this.changeDetectorRef.detectChanges();
		};
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
	toggleComplete(achievement: DisplayedAchievement, skipRecentlyCompleted = false) {
		if (achievement.completedAt) {
			// Mark uncompleted
			achievement.completedAt = undefined;
			achievement.subTasksCompleted = achievement.subTasks ? [] : undefined;
			if (achievement.countNeeded) {
				achievement.count = 0;
			}
			this.achievements[this.achievements.findIndex((a) => a.id === achievement.id)] = { ...achievement }; // Force animation to play

			// Remove from recentlyCompletedAchievements
			const rcaIndex = this.recentlyCompletedAchievements.findIndex((r) => r.achievement.id === achievement.id);
			if (rcaIndex !== -1) {
				this.recentlyCompletedAchievements.splice(rcaIndex, 1);
			}
		} else {
			// Mark completed
			achievement.completedAt = new Date().toISOString();
			if (!this.allSubTasksCompleted(achievement)) {
				achievement.subTasksCompleted = achievement.subTasks?.map((t) => t.id);
			}
			achievement.count = achievement.countNeeded;
			this.achievements[this.achievements.findIndex((a) => a.id === achievement.id)] = { ...achievement }; // Force animation to play

			// Add to list of recently completed achievements
			if (!skipRecentlyCompleted) {
				const killFn = () => {
					const rcaIndex = this.recentlyCompletedAchievements.findIndex(
						(r) => r.achievement.id === achievement.id
					);
					if (rcaIndex !== -1) {
						this.recentlyCompletedAchievements.splice(rcaIndex, 1);
					}
				};
				this.recentlyCompletedAchievements.push({
					achievement,
					kill: killFn,
					undo: () => this.toggleComplete(achievement),
				});
			}
		}
		this.sortAchievements();
		this.saveProgress();
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
		this.saveProgress();
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
		this.saveProgress();
	}

	/**
	 * Updates the list of currently displayed achievements based on the search input and filter criteria
	 */
	updateDisplayedAchievements() {
		// Apply search/filter
		const allowedCompletions =
			this.displayedCompletions === 'completed'
				? [true]
				: this.displayedCompletions === 'uncompleted'
				? [false]
				: [true, false];
		const lowerSearch = this.searchInput.toLowerCase();
		this.achievements.forEach(
			(a) =>
				(a.display = !!(
					allowedCompletions.includes(!!a.completedAt) &&
					(a.name.toLowerCase().includes(lowerSearch) ||
						a.description.toLowerCase().includes(lowerSearch) ||
						a.subTasks?.some((t) => t.name.toLowerCase().includes(lowerSearch)))
				))
		);
		this.updateStateVars();
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
	 * Save achievement progress to localStorage
	 */
	private saveProgress() {
		const progress: AchievementProgress[] = this.achievements
			.filter((a) => a.completedAt || a.count || a.subTasksCompleted)
			.map((a) => ({
				id: a.id,
				completedAt: a.completedAt,
				count: a.count,
				subTasksCompleted: a.subTasksCompleted,
			}));
		const progressString = JSON.stringify(progress);
		localStorage.setItem(AchievementKeys.progress, progressString);

		// If all achievements are completed for the first time, display a congratulations
		if (
			this.numAchievementsCompleted === this.achievements.length &&
			!(localStorage.getItem(AchievementKeys.completedAll) === 'true')
		) {
			// Don't show again
			localStorage.setItem(AchievementKeys.completedAll, 'true');

			// Play "Congratulations, you've proved yourself an exceptional miner!" audio from management
			const audio = new Audio(`assets/audio/congratulations.ogg`);
			audio.load();
			audio.play();

			// Open congratulatory dialog
			this.dialog.open(AchievementsCompletedDialog);
		}
	}

	/**
	 * Sort achievements by completion date
	 */
	private sortAchievements() {
		this.updateDisplayedAchievements();
		this.achievements.sort(byCompletionDateThenById);
	}

	/**
	 * Update state variables following change to achievement progress
	 */
	private updateStateVars() {
		this.numAchievementsCompleted = this.achievements.filter((a) => a.completedAt).length;
		this.numAchievementsDisplayed = this.achievements.filter((a) => a.display).length;
		this.numCompletedDisplayed = this.achievements.filter((a) => a.display && a.completedAt).length;
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
