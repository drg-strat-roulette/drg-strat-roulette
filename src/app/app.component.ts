import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { backgroundImages } from './data/backgrounds.const';
import { filter } from 'rxjs';
import { HeaderControlsService } from './services/header-controls/header-controls.service';
import { ManagementDialogService } from './services/management-dialog/management-dialog.service';
import { ManagementDialogConfigs } from './services/management-dialog/management-dialog.const';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { NgTemplateOutlet, NgStyle } from '@angular/common';
import { MatTabGroup, MatTab } from '@angular/material/tabs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: true,
	imports: [
		MatTabGroup,
		MatTab,
		MatIconButton,
		MatTooltip,
		MatMenuTrigger,
		MatIcon,
		MatMenu,
		NgTemplateOutlet,
		NgStyle,
		RouterOutlet,
	],
})
export class AppComponent implements OnInit {
	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.collapseButtons = event.target.innerWidth < 500;
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
		public headerControlsService: HeaderControlsService,
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
		const ONE_DAY_MS = 1000 * 60 * 60 * 24;
		const backgroundImageIndex = Math.floor(new Date().getTime() / ONE_DAY_MS) % backgroundImages.length;
		this.background = backgroundImages[backgroundImageIndex];
	}

	/**
	 * Opens the feedback dialog
	 */
	openFeedbackDialog(): void {
		this.managementDialogService.open(ManagementDialogConfigs.feedback);
	}
}
