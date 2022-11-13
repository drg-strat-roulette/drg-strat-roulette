// Defaults
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// @Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular CDK
import { ClipboardModule } from '@angular/cdk/clipboard';

// 3rd party
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Custom components
import { AppComponent } from './app.component';
import { SnackbarWithIconComponent } from './components/snackbar-with-icon/snackbar-with-icon.component';

@NgModule({
	declarations: [AppComponent, SnackbarWithIconComponent],
	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		ClipboardModule,
		CollapseModule.forRoot(),
		CommonModule,
		FormsModule,
		MatButtonModule,
		MatCheckboxModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatSelectModule,
		MatSnackBarModule,
		MatTooltipModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
