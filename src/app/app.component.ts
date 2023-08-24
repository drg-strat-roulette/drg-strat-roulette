import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { backgroundImages } from './data/backgrounds.const';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { filter } from 'rxjs';
import { HeaderControlsService } from './services/header-controls.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	// Current background image
	background: string = backgroundImages[0];

	// Tabs
	tabs = [
		{ id: 'strats', displayName: 'Strat Roulette' },
		{ id: 'achievements', displayName: 'Achievements' },
	];
	activeTabIndex = 0;

	constructor(
		private router: Router,
		private dialog: MatDialog,
		public headerControlsService: HeaderControlsService
	) {}

	ngOnInit(): void {
		// Update background image
		this.updateBackgroundImage();

		// Change active tab to match current route
		this.router.events
			.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
			.subscribe((e) => {
				const route = e.urlAfterRedirects.split('/')[1].split('?')[0];
				this.activeTabIndex = this.tabs.findIndex((t) => t.id === route);
			});
	}

	/**
	 * Changes the route following active tab change
	 */
	tabIndexChanged() {
		this.router.navigate([this.tabs[this.activeTabIndex].id]);
	}

	/**
	 * Sets the background image to a random image from the gallery
	 * The current background image is cycled on a daily basis
	 */
	updateBackgroundImage(): void {
		const backgroundImageIndex = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24)) % backgroundImages.length;
		this.background = backgroundImages[backgroundImageIndex];
	}

	/**
	 * Opens the feedback dialog
	 */
	openFeedbackDialog(): void {
		this.dialog.open(FeedbackDialogComponent);
	}
}
