import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
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
   confirmepassword: any = true
   password:any
   validate_password(event: any) {
     if (this.password == event.target.value) {
       this.confirmepassword = true
     } else {
       this.confirmepassword = false
     }
   }
  send() {
    if (this.password) {
      this.authenticationService.allowWithoutToken = "allowWithoutToken"
      let link = document.location.href;
      this.api.ResetPassword(this.password,link).subscribe(
        (data) => {
          this.authenticationService.allowWithoutToken = ""
          this.toast.success(
            this.translate.instant('Change Password successfully'),
            this.translate.instant("Message")
          );
          this.router.navigate(['auth']);
        },
        (error) => {
          this.authenticationService.allowWithoutToken = ""
          this.toast.error(error.reasonPhrase, this.translate.instant("Message"));
        }
      );
    }
  }
}
