import { Routes } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { ResumeBuilderComponent } from './resume-builder/resume-builder.component';
import { ResumeProcessComponent } from './resume-process/resume-process.component';
import { TemplateSelectionComponent } from './template-selection/template-selection.component';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: 'about', loadComponent: () => import('./about/about.component').then(m => m.AboutComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'resume', loadComponent: () => import('./resume/resume.component').then(m => m.ResumeComponent) },
  { path: 'auth/login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
  { path: 'auth/register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
  { path: 'auth/forgot-password', loadComponent: () => import('./auth/forgot-password/forgot-password').then(m => m.ForgotPassword) },
  { path: 'auth/reset-password', loadComponent: () => import('./auth/reset-password/reset-password').then(m => m.ResetPassword) },
  { path: 'debug-users', loadComponent: () => import('./debug-users/debug-users.component').then(m => m.DebugUsersComponent) },
  { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'help', loadComponent: () => import('./help/help.component').then(m => m.HelpComponent) },
  { path: 'resume-generator', loadComponent: () => import('./resume-generator/resume-generator.component').then(m => m.ResumeGeneratorComponent) },
  
  // Admin routes
  { path: 'admin/login', loadComponent: () => import('./admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'user-management', loadComponent: () => import('./admin/user-management/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'password-management', loadComponent: () => import('./admin/password-management/password-management.component').then(m => m.PasswordManagementComponent) },
      { path: 'template-management', loadComponent: () => import('./admin/template-management/template-management.component').then(m => m.TemplateManagementComponent) },
      { path: 'analytics', loadComponent: () => import('./admin/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: 'feedback', loadComponent: () => import('./admin/feedback-management/feedback-management.component').then(m => m.FeedbackManagementComponent) }
    ]
  },
  
  { path: 'loading', component: LoadingComponent },
  { path: 'resume-process', component: ResumeProcessComponent },
  { path: 'template-selection', component: TemplateSelectionComponent },
  { path: 'resume-builder', component: ResumeBuilderComponent },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'templates', loadComponent: () => import('./template-manager/template-manager.component').then(m => m.TemplateManagerComponent) },
  { path: 'my-templates', loadComponent: () => import('./my-templates/my-templates.component').then(m => m.MyTemplatesComponent) },
  { path: '**', redirectTo: '/home' }
];