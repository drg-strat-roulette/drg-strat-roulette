import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(
			AppRoutingModule,
			BrowserModule,
			ClipboardModule,
			CollapseModule.forRoot(),
			CommonModule,
			FormsModule,
			MatButtonModule,
			MatCheckboxModule,
			MatDialogModule,
			MatIconModule,
			MatInputModule,
			MatMenuModule,
			MatProgressBarModule,
			MatProgressSpinnerModule,
			MatSelectModule,
			MatSidenavModule,
			MatSnackBarModule,
			MatTabsModule,
			MatTooltipModule
		),
		provideAnimations(),
	],
}).catch((err) => console.error(err));
