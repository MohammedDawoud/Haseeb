import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  environmenturl: any;
  OrganizationData :any
  constructor(
    private toast: ToastrService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private api: RestApiService
  ) {
    this.environmenturl = environment.PhotoURL;
  }

  ngOnInit(): void {
    this.authenticationService.allowWithoutToken = "allowWithoutToken"
    this.api.GetOrganizationDataLogin().subscribe(
      {
        next: (res: any) => {
          this.authenticationService.allowWithoutToken = ""
          this.OrganizationData = res.result;
        },
        error: (error) => {
          this.authenticationService.allowWithoutToken = ""
        },
      }
      )
   }

  send(data: any) {
    if (data?.email) {
      var prames = {email: data?.email,Forgetusername:data?.email}
      this.authenticationService.allowWithoutToken = "allowWithoutToken"
      debugger
      let url = document.location.href;
      var link = url.replace("auth/forget-password", "auth/reset-password");
      console.log(link);
      this.api.ForgetPasswordError(data?.email,link).subscribe(
        (data) => {
          debugger
          if(data==true)
          {
            this.authenticationService.allowWithoutToken = ""
            this.toast.success(
              this.translate.instant('Email Send Successfully'),
              this.translate.instant('Forget Password')
            );
          }
          else if (data==false){
            this.authenticationService.allowWithoutToken = ""
            this.toast.error(
              this.translate.instant('تأكد من البريد'),
              this.translate.instant('Forget Password')
            );
          }
          else{
            this.authenticationService.allowWithoutToken = ""
            this.toast.error(
              this.translate.instant('فشل في الارسال'),
              this.translate.instant('Forget Password')
            );
          }
        },
        (error) => {
          console.log(error);
          this.authenticationService.allowWithoutToken = ""
          this.toast.error('فشل في الارسال', this.translate.instant("Message"));
        }
      );
    }
  }
}
