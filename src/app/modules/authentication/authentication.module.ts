import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { RetrivePasswordComponent } from './components/retrive-password/retrive-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    RetrivePasswordComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    AuthenticationRoutingModule,
    ToastrModule,
    TranslateModule,
    NgOtpInputModule,
  ],
})
export class AuthenticationModule {}
