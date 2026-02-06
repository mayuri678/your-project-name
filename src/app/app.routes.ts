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
import { WordEditorComponent } from './word-editor/word-editor.component';

import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmPasswordChangeComponent } from './confirm-password-change/confirm-password-change.component';
import { PasswordManagementComponent } from './admin/password-management/password-management.component';

import { MsWordEditorComponent } from './ms-word-editor/ms-word-editor.component';
import { ResumeGeneratorComponent } from './resume-generator/resume-generator.component';
import { JwtLoginComponent } from './components/jwt-login.component';
import { JwtProfileComponent } from './components/jwt-profile.component';
import { SupabaseLoginComponent } from './components/supabase-login.component';
import { SupabaseProfileComponent } from './components/supabase-profile.component';
import { AuthDemoComponent } from './components/auth-demo.component';
import { ForgotPasswordComponent as SupabaseForgotPasswordComponentOld } from './components/forgot-password.component';
import { ResetPasswordComponent as SupabaseResetPasswordComponentOld } from './components/reset-password.component';
import { PasswordResetDemoComponent } from './components/password-reset-demo.component';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { ForgotPasswordOtpComponent } from './components/forgot-password-otp.component';
import { VerifyOtpComponent } from './components/verify-otp.component';
import { SupabaseForgotPasswordComponent } from './components/supabase-forgot-password.component';
import { SupabaseOtpVerificationComponent } from './components/supabase-otp-verification.component';
import { SupabaseResetPasswordComponent } from './components/supabase-reset-password.component';
import { ResetPasswordGuard } from './guards/reset-password.guard';
import { PasswordResetFlowDemoComponent } from './components/password-reset-flow-demo.component';
import { ForgotPasswordMagicComponent } from './components/forgot-password-magic.component';
import { ChangePasswordResetComponent } from './components/change-password-reset.component';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'ms-word-editor', component: MsWordEditorComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  // Supabase Auth routes
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'auth/forgot-password', component: ForgotPassword },
  { path: 'auth/reset-password', component: ResetPassword },
  // Primary outlet login route (fallback)
  { path: 'login', component: LoginComponent },
  // Auxiliary route for modal outlet
  { path: 'login', outlet: 'modal', component: LoginComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'logged-out', component: LoggedOutComponent },
  { path: 'resume', component: ResumeComponent, canActivate: [authGuard] },
  { path: 'resume-generator', component: ResumeGeneratorComponent, canActivate: [authGuard] },
  { path: 'examples', component: ResumeExamplesComponent },
  { path: 'templates', component: TemplatesTableComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'my-templates', component: MyTemplatesComponent, canActivate: [authGuard] },
  { path: 'forgot-password-magic', component: ForgotPasswordMagicComponent },
  { path: 'change-password-reset', component: ChangePasswordResetComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'forgot-password-otp', component: ForgotPasswordOtpComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'otp-verification', component: OtpVerificationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'confirm-password-change', component: ConfirmPasswordChangeComponent },
  { path: 'help', component: HelpComponent },
  { path: 'word-editor', component: WordEditorComponent },
  // JWT Authentication routes
  { path: 'jwt-login', component: JwtLoginComponent },
  { path: 'jwt-profile', component: JwtProfileComponent },
  // Supabase Authentication routes
  { path: 'supabase-login', component: SupabaseLoginComponent },
  { path: 'supabase-profile', component: SupabaseProfileComponent, canActivate: [SupabaseAuthGuard] },
  { path: 'supabase-forgot-password', component: SupabaseForgotPasswordComponent },
  { path: 'supabase-otp-verification', component: SupabaseOtpVerificationComponent },
  { path: 'supabase-reset-password', component: SupabaseResetPasswordComponent, canActivate: [ResetPasswordGuard] },
  { path: 'supabase-forgot-password-old', component: SupabaseForgotPasswordComponentOld },
  { path: 'supabase-reset-password-old', component: SupabaseResetPasswordComponentOld },
  { path: 'password-reset-demo', component: PasswordResetFlowDemoComponent },
  { path: 'auth-demo', component: AuthDemoComponent },
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
