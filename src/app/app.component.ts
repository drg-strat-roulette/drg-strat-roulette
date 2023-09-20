import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { backgroundImages } from './data/backgrounds.const';
import { filter } from 'rxjs';
import { HeaderControlsService } from './services/header-controls/header-controls.service';
import { ManagementDialogService } from './services/management-dialog/management-dialog.service';
import { ManagementDialogConfigs } from './services/management-dialog/management-dialog.const';

const BETA_CODE = 'achievements';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.collapseButtons = event.target.innerWidth < 500;
	}

	// Listener for BETA_CODE entered
	betaMode = false;
	private keySequence: string = '';
	@HostListener('window:keypress', ['$event'])
	onKeypress(event: KeyboardEvent) {
		this.keySequence += event.key;
		if (this.keySequence.length > BETA_CODE.length) {
			this.keySequence = this.keySequence.slice(1);
		}
		if (this.keySequence === BETA_CODE) {
			this.betaMode = true;
		}
	}

	// Current background image
	background: string = backgroundImages[0];

	// Tabs
	tabs = [
		{ id: 'strats', displayName: 'Strat Roulette' },
		{ id: 'achievements', displayName: 'Achievements' },
	];
	activeTabIndex = 0;
	collapseButtons = window.innerWidth < 500;

	constructor(
		private router: Router,
		private managementDialogService: ManagementDialogService,
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
	tabIndexChanged(): void {
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
		this.managementDialogService.open(ManagementDialogConfigs.feedback);
	}
}
