import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { LoggedOutComponent } from './logged-out/logged-out.component';
import { ResumeComponent } from './resume/resume.component';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';
import { ContactComponent } from './contact/contact.component';
import { LoadingComponent } from './loading/loading.component';
import { ResumeExamplesComponent } from './resume-examples/resume-examples.component';
import { TemplatesTableComponent } from './templates-table/templates-table.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { MyTemplatesComponent } from './my-templates/my-templates.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { TemplateManagementComponent } from './admin/template-management/template-management.component';
import { FeedbackManagementComponent } from './admin/feedback-management/feedback-management.component';
import { SubscriptionManagementComponent } from './admin/subscription-management/subscription-management.component';
import { AnalyticsComponent } from './admin/analytics/analytics.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './admin/dashboard-overview/dashboard-overview.component';
import { HelpComponent } from './help/help.component';
import { TemplateEditorComponent } from './admin/template-editor/template-editor.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordManagementComponent } from './admin/password-management/password-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // Primary outlet login route (fallback)
  { path: 'login', component: LoginComponent },
  // Auxiliary route for modal outlet
  { path: 'login', outlet: 'modal', component: LoginComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'logged-out', component: LoggedOutComponent },
  { path: 'resume', component: ResumeComponent, canActivate: [authGuard] },
  { path: 'examples', component: ResumeExamplesComponent },
  { path: 'templates', component: TemplatesTableComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'my-templates', component: MyTemplatesComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'help', component: HelpComponent },
  // Admin routes
  { path: 'admin/login', component: AdminLoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardOverviewComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'user-management', component: UserManagementComponent },

      { path: 'password-management', component: PasswordManagementComponent },
      { path: 'templates', component: TemplateManagementComponent },
      { path: 'template-management', component: TemplateManagementComponent },
      { path: 'template-editor/:id', component: TemplateEditorComponent },
      { path: 'subscriptions', component: SubscriptionManagementComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'feedback', component: FeedbackManagementComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'home' }
];
