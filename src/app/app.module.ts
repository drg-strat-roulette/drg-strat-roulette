// Defaults
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular CDK
import { ClipboardModule } from '@angular/cdk/clipboard';

// 3rd party
import { CollapseModule } from 'ngx-bootstrap/collapse';

// Custom components
import { AppComponent } from './app.component';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { SnackbarWithIconComponent } from './components/snackbar-with-icon/snackbar-with-icon.component';
import { WelcomeDialogComponent } from './components/welcome-dialog/welcome-dialog.component';
import { StratsComponent } from './components/strats/strats.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { AchievementsWelcomeDialogComponent } from './components/achievements-welcome-dialog/achievements-welcome-dialog.component';
import { AchievementCardComponent } from './components/achievement-card/achievement-card.component';
import { RecentlyCompletedAchievementComponent } from './components/recently-completed-achievement/recently-completed-achievement.component';

@NgModule({
	declarations: [
		AppComponent,
		FeedbackDialogComponent,
		SnackbarWithIconComponent,
		WelcomeDialogComponent,
		StratsComponent,
		AchievementsComponent,
		AchievementsWelcomeDialogComponent,
		AchievementCardComponent,
		RecentlyCompletedAchievementComponent,
	],
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
		MatTooltipModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
