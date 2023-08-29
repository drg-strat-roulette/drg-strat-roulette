import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagementDialogConfig } from 'src/app/services/management-dialog/management-dialog.const';

@Component({
	selector: 'app-management-dialog',
	templateUrl: './management-dialog.component.html',
	styleUrls: ['./management-dialog.component.scss'],
})
export class ManagementDialog implements OnInit {
	constructor(@Inject(MAT_DIALOG_DATA) public data: ManagementDialogConfig) {}

	ngOnInit(): void {}
}
