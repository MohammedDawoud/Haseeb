import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-retrive-password',
  templateUrl: './retrive-password.component.html',
  styleUrls: ['./retrive-password.component.scss'],
})
export class RetrivePasswordComponent {
  environmenturl: any;
  OrganizationData :any
  constructor(
    private toast: ToastrService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private api: RestApiService,
    private router: Router,

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
    if (data?.email && data?.user_name) {
      // var prames = {email: data?.email,Forgetusername: data?.user_name}
      this.authenticationService.allowWithoutToken = "allowWithoutToken"
      this.api.RetrievePassword(data?.email , data?.user_name).subscribe(
        (data) => {
          debugger
          if(data==true)
          {
            this.authenticationService.allowWithoutToken = ""
            this.toast.success(
              this.translate.instant('Email Send Successfully'),
              this.translate.instant('Forget Password')
            );
            this.router.navigate(['auth']);
          }
          else if (data==false){
            this.authenticationService.allowWithoutToken = ""
            this.toast.error(
              this.translate.instant('تأكد من البريد والمستخدم'),
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
