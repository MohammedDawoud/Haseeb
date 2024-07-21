import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-accept-offer-price',
  templateUrl: './accept-offer-price.component.html',
  styleUrls: ['./accept-offer-price.component.scss'],
})
export class AcceptOfferPriceComponent implements OnInit {
  pinCode: any;
  @ViewChild('pinCodeModal') otpModal: any;

  constructor(private modalService: NgbModal
    ,private authenticationService: AuthenticationService
    ,private api: RestApiService
    ,private toast: ToastrService,
    ) {
      this.authenticationService.allowWithoutToken = "allowWithoutToken";
      this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
    }

  OrganizationData :any;
  environmentPho: any;
  ngOnInit(): void {
    this.resetDataObj();
    this.environmentPho=null;
    this.authenticationService.allowWithoutToken = "allowWithoutToken";
    this.api.GetOrganizationDataLogin().subscribe(
    {
      next: (res: any) => {
        this.authenticationService.allowWithoutToken = "";
        this.OrganizationData = res.result;
        this.environmentPho=environment.PhotoURL+this.OrganizationData.logoUrl;
      },
      error: (error) => {
        this.authenticationService.allowWithoutToken = "";
      },
    }
    )
  }

  DataObj:any={
    NationalId:null,
    ProjectId:null,
    ActivationCode:null,
    VisualCode:null,
    OfferId:null,
    OfferNo:null,
  }
  resetDataObj(){
    this.DataObj={
      NationalId:null,
      ProjectId:null,
      ActivationCode:null,
      VisualCode:null,
      OfferId:null,
      OfferNo:null,
    }
  }

  checkPinCode() {
    if (this.pinCode == this.DataObj?.ActivationCode) {
      this.Customeraccept(this.DataObj?.OfferId);
      this.modalService.dismissAll();
    }
  }

  Customeraccept(offersPricesId:any) {
    this.api.Customeraccept(offersPricesId).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.toast.success(result.reasonPhrase,'رسالة');
        this.resetDataObj();
      }
      else{this.toast.error(result.reasonPhrase, 'رسالة');}
    });
  }
  DataRequest:any=null;
  GetOfferByCustomerData(offerid:any,NationalId:any,ActivationCode:any){
    this.authenticationService.allowWithoutToken = "allowWithoutToken"
    this.api.GetOfferByCustomerData(offerid,NationalId,ActivationCode).subscribe(
    {
      next: (res: any) => {
        this.authenticationService.allowWithoutToken = "";
        this.DataRequest = res.result;
        if(this.DataRequest.length>0)
        {
          this.open(this.otpModal);
        }
        else{
          this.toast.error("من فضلك أدخل بيانات صحيحة", 'رسالة');
        }
      },
      error: (error) => {
        this.authenticationService.allowWithoutToken = "";
      },
    }
    )
  }

  open(content: any) {
    this.modalService
      .open(content, {
        size: 'md',
        centered: true,
      })
      .result.then();
  }
  qrCodeCheckValue: any;

  refreshQrCode() {
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
  }

  check() {
    console.log(this.DataObj);
    if(this.DataObj?.NationalId==null || this.DataObj?.OfferId==null || this.DataObj?.ActivationCode==null)
    {
      this.toast.error("من فضلك أكمل البيانات", 'رسالة');
      return;
    }

    this.GetOfferByCustomerData(this.DataObj?.OfferId,this.DataObj?.NationalId,this.DataObj?.ActivationCode);
  }
  onOtpChange(data: any) {
    this.pinCode = data;
  }
}
