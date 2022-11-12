import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
	selector: 'app-snackbar-with-icon',
	templateUrl: './snackbar-with-icon.component.html',
	styleUrls: ['./snackbar-with-icon.component.scss'],
})
export class SnackbarWithIconComponent implements OnInit {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarConfig) {}

	ngOnInit(): void {}
}

export interface SnackbarConfig {
	text: string;
	prefixIcon?: string;
	suffixIcon?: string;
}
