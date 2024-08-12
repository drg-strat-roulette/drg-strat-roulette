import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, debounceTime, filter, takeUntil } from 'rxjs';
import { AchievementKeys, CrossTabSyncType } from 'src/app/models/local-storage.interface';
import { HeaderControlsService } from 'src/app/services/header-controls/header-controls.service';
import { SnackbarConfig, SnackbarWithIconComponent } from '../../snackbar-with-icon/snackbar-with-icon.component';
import { Clipboard } from '@angular/cdk/clipboard';
import {
	AchievementProgress,
	DisplayedAchievement,
	RecentlyCompletedAchievement,
} from 'src/app/models/achievement.interface';
import { achievementsList } from 'src/app/data/achievements.const';
import { clamp, flatten } from 'lodash-es';
import { animate, style, transition, trigger } from '@angular/animations';
import { byCompletionDateThenByOrder } from 'src/app/utilities/sorters.utils';
import { ManagementDialogService } from 'src/app/services/management-dialog/management-dialog.service';
import { ManagementDialogConfigs } from 'src/app/services/management-dialog/management-dialog.const';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CrossTabSyncService } from 'src/app/services/cross-tab-sync/cross-tab-sync.service';
import { tokenizeString } from 'src/app/utilities/general-functions.utils';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { RecentlyCompletedAchievementComponent } from '../recently-completed-achievement/recently-completed-achievement.component';
import { DecimalPipe } from '@angular/common';

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
	standalone: true,
	imports: [
		RecentlyCompletedAchievementComponent,
		MatFormField,
		MatLabel,
		MatInput,
		FormsModule,
		MatIconButton,
		MatSuffix,
		MatIcon,
		MatSelect,
		MatOption,
		MatTooltip,
		MatProgressBar,
		AchievementCardComponent,
		MatButton,
		MatDialogModule,
		DecimalPipe,
	],
})
export class AchievementsComponent implements OnInit {
	@ViewChild('achievementsSettings') achievementSettingsDialog: TemplateRef<any> | undefined;

	/** List of all achievements */
	achievements: DisplayedAchievement[] = [];

	/** Recently completed achievements */
	recentlyCompletedAchievements: RecentlyCompletedAchievement[] = [];

	/** Whether to animate achievements being (un)completed */
	disableAnimations = true;

	/** Total number of completed achievements */
	numAchievementsCompleted = 0;

	/** Number of achievements displayed after search/filter */
	numAchievementsDisplayed = 0;

	/** Number of completed achievements displayed after search/filter */
	numCompletedDisplayed = 0;

	/** Filter criteria */
	displayedCompletions: 'all' | 'completed' | 'incomplete' = 'all';

	/** Achievement search input */
	searchInput: string = '';

	/** Enables confirming user wants to reset achievement progress */
	resetConfirmed = false;

	/** Emits when search input is changed */
	searchInputChanged: Subject<void> = new Subject();

	private destroy: Subject<void> = new Subject();

	constructor(
		private headerControlsService: HeaderControlsService,
		private managementDialogService: ManagementDialogService,
		private snackbar: MatSnackBar,
		private clipboard: Clipboard,
		private changeDetectorRef: ChangeDetectorRef,
		private dialog: MatDialog,
		private crossTabSyncService: CrossTabSyncService,
	) {}

	ngOnInit(): void {
		// Display welcome dialog to new users
		const hasSeenAchievementsWelcomeDialog = localStorage.getItem(AchievementKeys.hasSeenAchievementsWelcomeDialog);
		if (hasSeenAchievementsWelcomeDialog !== 'true') {
			this.openWelcomeDialog();
		}

		// Load achievement progress from localStorage
		this.loadProgress(localStorage.getItem(AchievementKeys.progress), 'load');

		// Subscribe to events from header control button presses
		this.headerControlsService.infoButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.openWelcomeDialog());
		this.headerControlsService.shareButtonPressed$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.copyShareText());

		// Subscribe to search input changes with a debounceTime to prevent lag
		this.searchInputChanged
			.pipe(debounceTime(100), takeUntil(this.destroy))
			.subscribe(() => this.updateDisplayedAchievements());

		// Subscribe to achievement progress updates from other tabs
		this.crossTabSyncService.tabSync$
			.pipe(
				takeUntil(this.destroy),
				filter((u) => u === CrossTabSyncType.achievementProgressUpdated),
			)
			.subscribe(() => {
				// Load latest achievement progress (which was saved by a different browser tab)
				this.loadProgressByDiff(localStorage.getItem(AchievementKeys.progress));
			});

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
	 * Loads achievement progress from JSON string and merges progress with static achievements list
	 * @param p - Achievement progress, as a JSON string
	 * @param reason - Reason for initiating this progress load
	 */
	loadProgress(p: string | undefined | null, reason: 'load' | 'import') {
		try {
			// Parse and load progress
			const progress: AchievementProgress[] = JSON.parse(p ?? '[]');
			this.achievements = achievementsList.map((a, i) => ({
				...a,
				...progress.find((p) => p.id === a.id),
				display: true,
				order: i,
			}));
			this.sortAchievements();

			// Display alert indicating successful import
			if (reason === 'import') {
				this.snackbar.openFromComponent(SnackbarWithIconComponent, {
					duration: 5000,
					data: {
						text: 'Successfully imported progress.',
						prefixIcon: 'check_circle',
					} as SnackbarConfig,
				});
				this.crossTabSyncService.postUpdate(CrossTabSyncType.forceReload);
			}
		} catch {
			// Display alert indicating unsuccessful load/import
			this.snackbar.openFromComponent(SnackbarWithIconComponent, {
				duration: 10_000,
				data: {
					text: `Failed to ${reason} progress. ${reason === 'load' ? 'Resetting data to fix issue.' : ''}`,
					prefixIcon: 'error',
				} as SnackbarConfig,
			});

			// If we failed on a load, the stored data is corrupted and we must remove it
			if (reason === 'load') {
				this.loadProgress(null, 'load');
				localStorage.setItem(AchievementKeys.progress, '[]');
			}
		}
	}

	/**
	 * Loads achievement progress from JSON string and applies diffs to the currently displayed achievements
	 * @param p - Achievement progress, as a JSON string
	 */
	loadProgressByDiff(p: string | undefined | null) {
		// Parse and apply progress diff
		let updatedCompletedAt = false;
		const progress: AchievementProgress[] = JSON.parse(p ?? '[]');
		for (const achievement of this.achievements) {
			const achievementProgress: AchievementProgress = progress.find((a) => a.id === achievement.id) ?? {
				id: achievement.id,
			};
			// Update existing achievement if changed
			if (serializeProgress(achievement) !== serializeProgress(achievementProgress)) {
				if (achievement.completedAt !== achievementProgress.completedAt) {
					// If achievement completion state changed, recreate the object to force animation
					this.achievements[this.achievements.findIndex((a) => a.id === achievement.id)] = {
						...achievement,
						completedAt: achievementProgress.completedAt,
						subTasksCompleted: achievementProgress.subTasksCompleted,
						count: achievementProgress.count,
					};
					// Remove from recentlyCompletedAchievements
					if (!achievementProgress.completedAt) {
						const rcaIndex = this.recentlyCompletedAchievements.findIndex(
							(r) => r.achievement.id === achievement.id,
						);
						if (rcaIndex !== -1) {
							this.recentlyCompletedAchievements.splice(rcaIndex, 1);
						}
					}
					updatedCompletedAt = true;
				} else {
					// Otherwise, just update the remaining completion properties
					achievement.subTasksCompleted = achievementProgress.subTasksCompleted;
					achievement.count = achievementProgress.count;
				}
			}
		}
		// We need to re-sort if the completion state of an achievement changed
		if (updatedCompletedAt) {
			this.sortAchievements();
		}
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
						(r) => r.achievement.id === achievement.id,
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
	subTaskCompleted(achievement: DisplayedAchievement, subTaskId: string, checked: boolean) {
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
	updateDisplayedAchievements(): void {
		// Establish (in)complete filter
		const allowedCompletions: boolean[] = [];
		if (this.displayedCompletions === 'completed' || this.displayedCompletions === 'all')
			allowedCompletions.push(true);
		if (this.displayedCompletions === 'incomplete' || this.displayedCompletions === 'all')
			allowedCompletions.push(false);

		// Generate terms from search input
		const searchTerms = [...new Set(tokenizeString(this.searchInput))];
		this.achievements.forEach((a) => {
			// Generate terms from achievement name, description, and sub-tasks
			const achievementTokens = [
				...new Set(
					flatten([
						...tokenizeString(a.name),
						...tokenizeString(a.description),
						...(a.subTasks?.map((t) => tokenizeString(t.name)) ?? []),
					]),
				),
			];
			a.display =
				// Completion state must be selected for achievement to be displayed
				allowedCompletions.includes(!!a.completedAt) &&
				// All searched terms must be included for achievement to be displayed
				searchTerms.every((term) => achievementTokens.some((token) => token.includes(term)));
		});
		this.updateStateVars();
	}

	/**
	 * Open the achievement settings dialog
	 */
	openSettingsDialog() {
		if (this.achievementSettingsDialog) {
			this.dialog.open(this.achievementSettingsDialog);
		}
	}

	/**
	 * Opens the welcome dialog which explains how to use the app
	 */
	openWelcomeDialog(): void {
		const welcomeDialog = this.managementDialogService.open(ManagementDialogConfigs.welcomeAchievements);
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
	 * Clears all cached data associated with achievements and reloads the page.
	 * If user has not confirmed reset (by clicking twice), display alert prompting to click again
	 */
	resetProgress(): void {
		if (this.resetConfirmed) {
			for (let key of Object.values(AchievementKeys)) {
				localStorage.removeItem(key);
			}
			this.crossTabSyncService.postUpdate(CrossTabSyncType.forceReload);
			location.reload();
		} else {
			this.snackbar.openFromComponent(SnackbarWithIconComponent, {
				duration: 10_000,
				data: {
					text: 'Click again to confirm progress reset.',
					prefixIcon: 'information',
				} as SnackbarConfig,
			});
			this.resetConfirmed = true;
			setTimeout(() => (this.resetConfirmed = false), 10_000);
		}
	}

	/**
	 * Import achievement progress from an uploaded file
	 */
	importProgress(e: any) {
		const file: File = e.target.files[0];
		let fileReader = new FileReader();
		fileReader.onload = () => {
			const fileContents = fileReader.result?.toString();
			this.loadProgress(fileContents, 'import');
		};
		fileReader.readAsText(file);
	}

	/**
	 * Export achievement progress to a downloaded file
	 */
	exportProgress(): void {
		const progress = localStorage.getItem(AchievementKeys.progress) ?? '[]';
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(progress));
		element.setAttribute('download', `${new Date().toISOString()}.drg-sr-achievements`);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	/**
	 * Save achievement progress to localStorage
	 */
	private saveProgress(): void {
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
		this.crossTabSyncService.postUpdate(CrossTabSyncType.achievementProgressUpdated);

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

			// Open achievements completed dialog
			this.managementDialogService.open(ManagementDialogConfigs.achievementsCompleted);
		}
	}

	/**
	 * Sort achievements by completion date
	 */
	private sortAchievements(): void {
		this.updateDisplayedAchievements();
		this.achievements.sort(byCompletionDateThenByOrder);
	}

	/**
	 * Update state variables following change to achievement progress
	 */
	private updateStateVars(): void {
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

/**
 * Generates a unique string representing an achievement's progress
 * @param a - Achievement progress
 */
function serializeProgress(a: AchievementProgress): string {
	return [a.id, a.completedAt, a.count, a.subTasksCompleted ?? []].map((p) => (p ?? 'null').toString()).join('::');
}
