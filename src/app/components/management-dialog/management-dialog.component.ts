import { Component, Inject } from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogTitle,
	MatDialogContent,
	MatDialogActions,
	MatDialogClose,
} from '@angular/material/dialog';
import { ManagementDialogConfig } from 'src/app/services/management-dialog/management-dialog.const';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'app-management-dialog',
	templateUrl: './management-dialog.component.html',
	styleUrls: ['./management-dialog.component.scss'],
	standalone: true,
	imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton, MatDialogClose],
})
export class ManagementDialog {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ManagementDialogConfig) {}
}
