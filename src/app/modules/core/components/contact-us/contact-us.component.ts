import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contacts: any;
  qrCodeCheckValue: string[]
  lang: any;
  constructor(private api: RestApiService,
    private authenticationService: AuthenticationService,) {
    api.lang.subscribe((res) => {
      if (res) {
        this.lang = res;
      } else {
        this.lang = 'ar';
      }
    });
    // this.qrCodeCheckValue=[
    //   Math.floor(1000 + Math.random() * 9000).toString(),
    //   Math.floor(1000 + Math.random() * 9000).toString(),
    //   Math.floor(1000 + Math.random() * 9000).toString(),
    //   Math.floor(1000 + Math.random() * 9000).toString(),
    // ];
  }

  ngOnInit(): void {
    this.contacts = []
    this.GetAllContactBranches()
    // [
    //   {
    //     branch_id: 1,
    //     branch_name: { ar: 'فرع مكة المكرمة', en: 'Makkah Branch' },
    //     address: {
    //       ar: 'شارع منصور حي العاصمة',
    //       en: 'Mansour Street, Capital District',
    //     },
    //     branch_admin: '0503326610',
    //     customers_service: '0568582911',
    //     email: 'q@q.com',
    //   },
    //   {
    //     branch_id: 2,
    //     branch_name: {
    //       ar: 'المركز الرئيسي - الدمام',
    //       en: 'The main center - Dammam',
    //     },
    //     address: {
    //       ar: 'شارع العام ، حي الكورنيش',
    //       en: 'Al-Am Street, Corniche District',
    //     },
    //     branch_admin: '0512345671',
    //     customers_service: '0598959566',
    //     email: 'a@a.com',
    //   },
    //   {
    //     branch_id: 3,
    //     branch_name: { ar: 'فرع الرياض', en: 'Riyadh Branch' },
    //     address: {
    //       ar: 'شارع الملك فهد ، حي الملزم',
    //       en: 'King Fahd Street, Al-Molzam District',
    //     },
    //     branch_admin: '0596969696',
    //     customers_service: '0584474747',
    //     email: 'abc@abc.com',
    //   },
    //   {
    //     branch_id: 4,
    //     branch_name: { ar: 'إسطنبول', en: 'Istanbul' },
    //     address: { ar: 'عنوان الفرع', en: 'Branch address' },
    //     branch_admin: '0530530530',
    //     customers_service: '0505055226',
    //     email: 'hma@hma.com',
    //   },
    // ];
  }
  GetAllContactBranches() {
    this.authenticationService.allowWithoutToken = "allowWithoutToken"
    this.api.GetAllContactBranches().subscribe(
      {
        next: (res: any) => {
          this.authenticationService.allowWithoutToken = ""
          this.contacts = res.result
          this.qrCodeCheckValue=[]
          this.contacts.forEach((element: any) => {
            this.qrCodeCheckValue.push(Math.floor(1000 + Math.random() * 9000).toString())
          });
        },
        error: (error) => {
          this.authenticationService.allowWithoutToken = ""
        },
      }
    );
  }
  refreshQrCode(index: any) {
    this.qrCodeCheckValue[index] = Math.floor(
      1000 + Math.random() * 9000
    ).toString();
  }

  sendContact(data: any, branch_id: any) {
    console.log(data, branch_id);
  }
}
