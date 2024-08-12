import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-snackbar-with-icon',
	templateUrl: './snackbar-with-icon.component.html',
	styleUrls: ['./snackbar-with-icon.component.scss'],
	standalone: true,
	imports: [MatIcon],
})
export class SnackbarWithIconComponent {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarConfig) {}
}

export interface SnackbarConfig {
	text: string;
	prefixIcon?: string;
	suffixIcon?: string;
}
