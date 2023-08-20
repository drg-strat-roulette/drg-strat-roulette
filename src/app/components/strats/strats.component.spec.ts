import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { StratsComponent } from './strats.component';

describe('StratsComponent', () => {
	let component: StratsComponent;
	let fixture: ComponentFixture<StratsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				BrowserAnimationsModule,
				CollapseModule,
				FormsModule,
				MatCheckboxModule,
				MatDialogModule,
				MatIconModule,
				MatInputModule,
				MatMenuModule,
				MatSelectModule,
				MatSidenavModule,
				MatSnackBarModule,
				MatTooltipModule,
				RouterTestingModule,
			],
			declarations: [StratsComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(StratsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
