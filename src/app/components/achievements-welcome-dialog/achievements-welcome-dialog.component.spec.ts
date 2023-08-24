import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsWelcomeDialogComponent } from './achievements-welcome-dialog.component';

describe('AchievementsWelcomeDialogComponent', () => {
  let component: AchievementsWelcomeDialogComponent;
  let fixture: ComponentFixture<AchievementsWelcomeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchievementsWelcomeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementsWelcomeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
