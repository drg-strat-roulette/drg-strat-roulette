import { Injectable } from '@angular/core';
import { ManagementDialog } from 'src/app/components/management-dialog/management-dialog.component';
import { ManagementDialogConfigs, managementDialogConfigs } from './management-dialog.const';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
	providedIn: 'root',
})
export class ManagementDialogService {
	constructor(private dialog: MatDialog) {}

	public open(configType: ManagementDialogConfigs) {
		return this.dialog.open(ManagementDialog, { data: managementDialogConfigs.get(configType) });
	}
}
