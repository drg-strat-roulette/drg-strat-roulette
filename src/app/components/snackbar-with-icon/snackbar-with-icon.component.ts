import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
	selector: 'app-snackbar-with-icon',
	templateUrl: './snackbar-with-icon.component.html',
	styleUrls: ['./snackbar-with-icon.component.scss'],
})
export class SnackbarWithIconComponent {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarConfig) {}
}

export interface SnackbarConfig {
	text: string;
	prefixIcon?: string;
	suffixIcon?: string;
}
