import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import { NgxPrintElementService } from 'ngx-print-element';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { Acc_Suppliers } from 'src/app/core/Classes/DomainObjects/acc_Suppliers';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent {

  title: any = {
    main: {
      name: {
        ar: 'الحسابات',
        en: 'Projects Management',
      },
      link: '/accounts',
    },
    sub: {
      ar:'الموردين',
      en:'Suppliers',
    },
  };
  closeResult = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  suppliersDisplayedColumns: string[] = [
    'nameAr',
    'nameEn',
    'taxNo',
    'phoneNo',
    'cityName',
    'compAddress',
    'operations',
  ];
  lang: any = 'ar';

  constructor(private modalService: NgbModal,
    private _accountsreportsService: AccountsreportsService,
    private _sharedService: SharedService,
    private api: RestApiService,
    private print: NgxPrintElementService,
    private toast: ToastrService,
    private _payvoucherservice: PayVoucherService,
    private translate: TranslateService,) {
    this.dataSource = new MatTableDataSource([{}]);
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  ngOnInit(): void {
    this.GetAllSuppliersR();
    this.FillSuppliersSelect2();
    this.FillCitySelects();
  }
  AddOrEditSupplier=1;
  open(content: any, data?: any, type?: any) {

    if(type=="addsupplier"){
      this.resetsupplier();
      this.AddOrEditSupplier=1;
    }
    else if(type=="editsupplier"){
      this.resetsupplier();
      this.editsupplier(data);
      this.AddOrEditSupplier=2;
    }
    else if (type == 'deletesupplier') {
    this.supplierdeleted = data.supplierId;
    }

    this.modalService
      this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type == 'addsupplier' ? 'xl' : type == 'editsupplier' ? 'xl' : 'lg' ,
        centered: type ? false : true
      })

      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any, type?: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  searchsupplier: any = null;
  supplierlist: any;
  supplierlistTemp: any;
  supplierdeleted: any;

  suppliermodel: any = {
    id: null,
    nameAr: null,
    nameEn: null,
    taxNo: null,
    phoneNo: null,
    compAddress: null,
    postalCodeFinal: null,
    externalPhone: null,
    country: null,
    neighborhood: null,
    streetName: null,
    buildingNumber: null,
    commercialRegInvoice: null,
    cityId: null,
  };
  GetAllSuppliersR() {
    this._payvoucherservice.GetAllSuppliers(this.searchsupplier ?? '').subscribe(data=>{
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.supplierlist=data;
      this.supplierlistTemp=data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  editsupplier(item: any) {
    console.log(item);
    this.suppliermodel.id = item.supplierId;
    this.suppliermodel.nameAr = item.nameAr;
    this.suppliermodel.nameEn = item.nameEn;
    this.suppliermodel.taxNo = item.taxNo;
    this.suppliermodel.phoneNo = item.phoneNo;
    this.suppliermodel.compAddress = item.compAddress;
    this.suppliermodel.postalCodeFinal = item.postalCodeFinal;
    this.suppliermodel.externalPhone = item.externalPhone;
    this.suppliermodel.country = item.country;
    this.suppliermodel.neighborhood = item.neighborhood;
    this.suppliermodel.streetName = item.streetName;
    this.suppliermodel.buildingNumber = item.buildingNumber;
    this.suppliermodel.commercialRegInvoice = item.commercialRegInvoice;
    if(item.cityId==0)
    {
      item.cityId=null;
    }
    this.suppliermodel.cityId = item.cityId;
  }
  resetsupplier() {
    this.suppliermodel.id = null;
    this.suppliermodel.nameAr = null;
    this.suppliermodel.nameEn = null;
    this.suppliermodel.taxNo = null;
    this.suppliermodel.phoneNo = null;
    this.suppliermodel.compAddress = null;
    this.suppliermodel.postalCodeFinal = null;
    this.suppliermodel.externalPhone = null;
    this.suppliermodel.country = null;
    this.suppliermodel.neighborhood = null;
    this.suppliermodel.streetName = null;
    this.suppliermodel.buildingNumber = null;
    this.suppliermodel.commercialRegInvoice = null;
    this.suppliermodel.cityId = null;
  }

  savesupplier() {
    var _supplier = new Acc_Suppliers();
    if (
      this.suppliermodel.nameAr == null ||
      this.suppliermodel.nameAr == '' ||
      this.suppliermodel.nameEn == null ||
      this.suppliermodel.nameEn == ''
    ) {
      this.toast.error('من فضلك اكمل البيانات');
      return;
    }
    debugger
    _supplier.supplierId = this.suppliermodel.id ?? 0;
    _supplier.nameAr = this.suppliermodel.nameAr;
    _supplier.nameEn = this.suppliermodel.nameEn;
    _supplier.taxNo = this.suppliermodel.taxNo;
    _supplier.phoneNo = this.suppliermodel.phoneNo;
    _supplier.compAddress = this.suppliermodel.compAddress;
    _supplier.postalCodeFinal = this.suppliermodel.postalCodeFinal;
    _supplier.externalPhone = this.suppliermodel.externalPhone;
    _supplier.country = this.suppliermodel.country;
    _supplier.neighborhood = this.suppliermodel.neighborhood;
    _supplier.streetName = this.suppliermodel.streetName;
    _supplier.buildingNumber = this.suppliermodel.buildingNumber;
    _supplier.cityId = this.suppliermodel.cityId;

    this._payvoucherservice.SaveSupplier(_supplier).subscribe(
      (data) => {
        this.GetAllSuppliersR();
        this.FillSuppliersSelect2();
        this.resetsupplier();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  DeleteSupplier(modal: any) {
    this._payvoucherservice.DeleteSupplier(this.supplierdeleted).subscribe(
      (data) => {
        this.GetAllSuppliersR();
        this.FillSuppliersSelect2();
        modal.dismiss();
        this.toast.success(
          this.translate.instant(data.reasonPhrase),
          this.translate.instant('Message')
        );
      },
      (error) => {
        modal.dismiss();

        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  citylect: any;

  FillCitySelects() {
    this._payvoucherservice.FillCitySelect().subscribe(
      (data) => {
        this.citylect = data;
      },
      (error) => {}
    );
  }
  supplierseleted: any;
  FillSuppliersSelect2() {
    this._payvoucherservice.FillSuppliersSelect2().subscribe(
      (data) => {
        this.supplierseleted = data;
      },
      (error) => {}
    );
  }

  applySuppliersFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  DataSourceAfter: any = []

  exportData() {
    let x = [];
    this.DataSourceAfter=[];

    if(this.dataSource.sort)
    {
      this.DataSourceAfter=this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort);
    }
    else
    {
      this.DataSourceAfter=this.dataSource.data;
    }

    for (let index = 0; index < this.DataSourceAfter.length; index++) {
      x.push({
        nameAr: this.DataSourceAfter[index].nameAr,
        nameEn: this.DataSourceAfter[index].nameEn,
        taxNo: this.DataSourceAfter[index].taxNo,
        phoneNo: this.DataSourceAfter[index].phoneNo,
        cityName: this.DataSourceAfter[index].cityName,
        compAddress: this.DataSourceAfter[index].compAddress,
      })
    }
    this.lang == "ar" ? this._payvoucherservice.customExportExcel(x, "الموردين") :
    this._payvoucherservice.customExportExcel(x, "Suppliers");

  }
  OrganizationData: any
  environmentPho: any
  dateprint: any
  getPrintdata(id: any) {
    this.api.GetOrganizationDataLogin().subscribe({
      next: (data: any) => {
        this.OrganizationData = data.result
        this.dateprint =this._sharedService.date_TO_String(new Date());
        this.environmentPho = environment.PhotoURL + this.OrganizationData.logoUrl;
        setTimeout(() => {
          this.print.print(id, environment.printConfig);
        }, 1000);
      },
      error: (error) => {
      },
    });

  }

}
