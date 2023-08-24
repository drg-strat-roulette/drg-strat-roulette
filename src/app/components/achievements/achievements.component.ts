import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { StoredKeys } from 'src/app/models/local-storage.interface';
import { HeaderControlsService } from 'src/app/services/header-controls.service';
import { AchievementsWelcomeDialogComponent } from '../achievements-welcome-dialog/achievements-welcome-dialog.component';
import { SnackbarConfig, SnackbarWithIconComponent } from '../snackbar-with-icon/snackbar-with-icon.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { Achievement } from 'src/app/models/achievement.model';
import { achievementsList } from 'src/app/data/achievements.const';

@Component({
	selector: 'app-achievements',
	templateUrl: './achievements.component.html',
	styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
	achievements: Achievement[] = achievementsList;

	private destroy: Subject<void> = new Subject();

	constructor(
		private headerControlsService: HeaderControlsService,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private clipboard: Clipboard
	) {}

	ngOnInit(): void {
		// Display welcome dialog to new users
		const hasSeenAchievementsWelcomeDialog = localStorage.getItem(StoredKeys.hasSeenAchievementsWelcomeDialog);
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
	}

	ngOnDestroy(): void {
		this.destroy.next();
		this.destroy.complete();
	}

	/**
	 * Opens the welcome dialog which explains how to use the app
	 */
	openWelcomeDialog(): void {
		const welcomeDialog = this.dialog.open(AchievementsWelcomeDialogComponent);
		welcomeDialog
			.afterClosed()
			.subscribe(() => localStorage.setItem(StoredKeys.hasSeenAchievementsWelcomeDialog, 'true'));
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
}
