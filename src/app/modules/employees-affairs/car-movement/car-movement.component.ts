import { BehaviorSubject, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { CarMovementService } from 'src/app/core/services/Employees-Services/car-movement.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { CarMovementsVM } from 'src/app/core/Classes/ViewModels/carMovementsVM';
import { CarMovements } from 'src/app/core/Classes/DomainObjects/carMovements ';
import { ToastrService } from 'ngx-toastr';
import { CarMovementsType } from 'src/app/core/Classes/DomainObjects/carMovementsType';
import { Item } from 'src/app/core/Classes/DomainObjects/item';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { RestApiService } from 'src/app/shared/services/api.service';
import { environment } from 'src/environments/environment';
import 'hijri-date';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;
@Component({
  selector: 'app-car-movement',
  templateUrl: './car-movement.component.html',
  styleUrls: ['./car-movement.component.scss'],
})
export class CarMovementComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  // selectedDate: any;
  // selectedDateType = DateType.Hijri;
  selectedDate: any = { year: 1455, month: 4, day: 20 };
  selectedDateType = DateType.Hijri;
  public _CarMovementsVM: CarMovementsVM;
  public _Carmovment: CarMovements;
  public _itemtype: CarMovementsType;
  private _carsitem: Item;
  showSearch = true;

  isEditable: any = {};

  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'حركة السيارات',
      en: 'cars movement',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  displayedColumns: string[] = [
    'car',
    'movementType',
    'driver',
    'date',
    'driverCost',
    'managerCost',
    'operations',
  ];
  showDate = false;

  data: any = {
    filter: {
      ItemId: null,
      EmpId: null,
      Date: null,
      EndDate: null,
      Type: null,
      date: null,
    },
  };

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalcarmovtype: any = {
    namear: null,
    nameen: null,
    id: null,
  };

  modalcarmovmentitems: any = {
    namear: null,
    nameen: null,
    id: null,
    qty: null,
    price: null,
    color: null,
  };

  modalDetails: any = {
    id: null,
    car: null,
    movementType: null,
    date: null,
    hijriDate: null,
    driverAmount: null,
    employerAmount: null,
    driver: null,
    details: null,
    movementId: null,
  };
  carsMovement: any;
  CarMovementitem: any;
  CarMovementtype: any;
  EmployeeSelect: any;
  CarMovementdeleted: any;
  Carmovementtypegtid: any;
  deleteditemtype: any;
  date: '';
  hijri: '';
  carmov: '';
  driverAmount: '';
  employerAmount: '';
  details: '';
  searchtext: '';
  searchtext2: '';
  formGroup = this.fb.group({});
  lang: any = 'ar';
  datePrintJournals: any = this._sharedService.date_TO_String(new Date());
  logourl: any;
  userG: any = {};

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _CarMovementService: CarMovementService,
    private _sharedService: SharedService,
    private toast: ToastrService,
    private translate: TranslateService,
    private authenticationService: AuthenticationService,
    private print: NgxPrintElementService,
    private api: RestApiService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this._Carmovment = new CarMovements();
    this._CarMovementsVM = new CarMovementsVM();
    this.modalDetails.movementId = 0;
    this._itemtype = new CarMovementsType();
    this._carsitem = new Item();
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userG = this.authenticationService.userGlobalObj;
  }

  FillCarMovementitemSearch() {
    this._CarMovementService.FillCarMovementitemSearch().subscribe((data) => {
      console.log(data);
      this.CarMovementitem = data;
    });
  }
  FillCarMovementtypeSearch() {
    this._CarMovementService.FillCarMovementtypeSearch().subscribe((data) => {
      console.log(data);
      this.CarMovementtype = data;
    });
  }

  FillEmployeeSelect() {
    this._CarMovementService.FillEmployeeSelect().subscribe((data) => {
      console.log('employee edit' + data);
      this.EmployeeSelect = data;
    });
  }

  GetAllItemTypes() {
    if (this.searchtext != null) {
      this.searchtext2 = this.searchtext;
    } else {
      this.searchtext2 = '';
    }
    debugger;
    this._CarMovementService
      .GetAllItemTypes(this.searchtext2)
      .subscribe((data) => {
        debugger;
        console.log('aaaaa');
        console.log(data.result);
        this.Carmovementtypegtid = data.result;
      });
  }

  // savemovementtype(){
  //   debugger;
  //  console.log(this.modalcarmovtype);
  // }

  savemovementtype() {
    debugger;
    console.log(this.modalDetails);
    if (
      this.modalcarmovtype.namear == null ||
      this.modalcarmovtype.nameen == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._itemtype = new CarMovementsType();
    if (this.modalcarmovtype.id != null && this.modalcarmovtype.id != 0) {
      this._itemtype.typeId = this.modalcarmovtype.id;
    } else {
      this._itemtype.typeId = 0;
    }
    this._itemtype.nameAr = this.modalcarmovtype.namear;
    this._itemtype.nameEn = this.modalcarmovtype.nameen;

    this._CarMovementService
      .SaveItemType(this._itemtype)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllItemTypes();
          this.GetCarmovementsearch(0);
          this.FillCarMovementtypeSearch();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  savemovementitems() {
    console.log(this.modalcarmovmentitems);
    if (
      this.modalcarmovmentitems.namear == null ||
      this.modalcarmovmentitems.nameen == null ||
      this.modalcarmovmentitems.price == null ||
      this.modalcarmovmentitems.qty == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    this._carsitem = new Item();

    this._carsitem.nameAr = this.modalcarmovmentitems.namear;
    this._carsitem.nameEn = this.modalcarmovmentitems.nameen;
    this._carsitem.price = this.modalcarmovmentitems.price;
    this._carsitem.quantity = this.modalcarmovmentitems.qty;
    this._carsitem.color = this.modalcarmovmentitems.color;
    this._carsitem.typeId = 1;
    this._CarMovementService
      .SaveItem(this._carsitem)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllItemTypes();
          this.GetCarmovementsearch(0);
          this.FillCarMovementtypeSearch();
          this.FillCarMovementitemSearch();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  edititemtype(data: any) {
    debugger;

    this.modalcarmovtype.id = data.typeId;

    this.modalcarmovtype.namear = data.nameAr;
    this.modalcarmovtype.nameen = data.nameEn;
  }
  gethigridate() {
    // debugger;
    // let dt=this._sharedService.GetHijriDate(this.modalDetails.date,'Contract/GetHijriDate2');
    // debugger;
    //     this.modalDetails.hijriDate=dt;

    debugger;
    this._sharedService
      .GetHijriDate(this.modalDetails.date, 'Contract/GetHijriDate2')
      .subscribe({
        next: (data: any) => {
          debugger;
          console.log(data);
          this.modalDetails.hijriDate = data;
        },
        error: (error) => {
          console.log(error);
          debugger;
          this.modalDetails = error;
        },
      });
  }

  ngOnInit(): void {
    this.FillEmployeeSelect();
    this.FillCarMovementtypeSearch();
    this.FillCarMovementitemSearch();
    this.GetCarmovementsearch(0);
    this.GetAllItemTypes();
    this.GetOrganizationData();
  }

  open(content: any, data?: any, type?: any, info?: any) {
    debugger;
    if (data && type == 'edit') {
      this.modalDetails = data;
      data.date = new Date(data.date);
      this.modalDetails.date = data.date;
      if (this.modalDetails.date != null) {
        const DateHijri = toHijri(this.modalDetails.date);
        var DateGre = new HijriDate(
          DateHijri._year,
          DateHijri._month,
          DateHijri._date
        );
        DateGre._day = DateGre._date;
        this.modalDetails.hijriDate = DateGre;
      }
      // data.hijriDate = this.gethigridate();
      this.modalDetails.movementId = data.movementId;
      this.modalDetails.car = data.itemId;
      this.modalDetails.movementType = data.type;
      this.modalDetails.driver = data.empId;

      // this.modalDetails.hijriDate = data.hijriDate;
      this.modalDetails.driverAmount = data.empAmount;
      this.modalDetails.employerAmount = data.ownerAmount;
      this.modalDetails.details = data.notes;
    }
    if (data && type == 'delete') {
      this.CarMovementdeleted = data.movementId;
    }
    if (data && type == 'deleted') {
      this.deleteditemtype = data.typeId;
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: true,
        backdrop: 'static',
        keyboard: false,
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
    this.modalDetails = {
      id: null,
      car: null,
      movementType: null,
      date: null,
      hijriDate: null,
      driverAmount: null,
      employerAmount: null,
      driver: null,
      details: null,
    };

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // delete
  Deleteitemtype() {
    debugger;
    this._CarMovementService
      .Deleteitemtype(this.deleteditemtype)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllItemTypes();
          this.GetCarmovementsearch(0);
          this.FillCarMovementtypeSearch();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  // delete
  Delete() {
    debugger;
    this._CarMovementService
      .DeleteCarMovement(this.CarMovementdeleted)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetCarmovementsearch(0);
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  EditCarMovement() {
    console.log(this.modalDetails);
  }
  AddCarMovement() {
    debugger;
    console.log(this.modalDetails);
    if (
      this.modalDetails.car == null ||
      this.modalDetails.movementType == null ||
      this.modalDetails.driver == null ||
      this.modalDetails.date == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._Carmovment = new CarMovements();
    this._Carmovment.movementId = this.modalDetails.movementId;
    this._Carmovment.itemId = this.modalDetails.car;
    this._Carmovment.type = this.modalDetails.movementType;
    this._Carmovment.empId = this.modalDetails.driver;
    this._Carmovment.date = this._sharedService.date_TO_String(
      this.modalDetails.date
    ); //this.modalDetails.date;
    const nowHijri = toHijri(this.modalDetails.date);

    this._Carmovment.hijriDate = this._sharedService.hijri_TO_String(nowHijri);
    // this.modalDetails.hijriDate.year +
    // '-' +
    // this.modalDetails.hijriDate.month +
    // '-' +
    // this.modalDetails.hijriDate.day;
    this._Carmovment.empAmount = this.modalDetails.driverAmount;
    this._Carmovment.ownerAmount = this.modalDetails.employerAmount;
    this._Carmovment.notes = this.modalDetails.details;

    this._CarMovementService
      .SaveCarMovement(this._Carmovment)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetCarmovementsearch(0);
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  //   AddImprestRequest(loanobj : any) {

  //     debugger;
  //     this._loan.employeeId=loanobj.employeeIdw;
  //     this._loan.date=loanobj.date;
  //     this._loan.amount=loanobj.amount;
  //     this._loan.monthNo=loanobj.monthNos;
  //     this._loan.startMonth=loanobj.startMonths;
  //     this._loan.note=loanobj.note
  //     console.log(loanobj);

  //     var loan=this._loan;
  // this._loanservice.SaveLoanWorker(loan).subscribe((result: any)=>{
  //   console.log(result);
  //   console.log("result");
  //   if(result.statusCode==200){
  //     this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
  //     this.getloandata(0);
  //   }
  //   else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
  // });

  //   }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.data.filter.Date = from;
      this.data.filter.EndDate = to;
      this.GetCarmovementsearch(1);
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  //////////////////////////////////dates////////////////////////
  //Date-Hijri
  ChangeemployeeGre(event: any) {
    debugger;

    if (event != null) {
      const DateHijri = toHijri(this.modalDetails.date);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalDetails.hijriDate = DateGre;
    } else {
      this.modalDetails.hijriDate = null;
    }
  }
  ChangeemployeeDateHijri(event: any) {
    debugger;
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalDetails.date = dayGreg;
    } else {
      this.modalDetails.date = null;
    }
  }

  CarList: any;
  GetCarmovementsearch(issearched: any) {
    debugger;
    this._CarMovementsVM = new CarMovementsVM();
    this._CarMovementsVM.empId = this.data.filter.EmpId;
    this._CarMovementsVM.date = this.data.filter.Date;
    this._CarMovementsVM.endDate = this.data.filter.EndDate;
    this._CarMovementsVM.itemId = this.data.filter.ItemId;
    this._CarMovementsVM.type = this.data.filter.Type;

    if (issearched == 1) {
      this._CarMovementsVM.isSearch = true;
    } else {
      this._CarMovementsVM.isSearch = false;
    }
    this._CarMovementService
      .GetAllCarMovementsSearch(this._CarMovementsVM)
      .subscribe({
        next: (data: any) => {
          // assign data to table
          debugger;
          console.log(data.result);
          this.carsMovement = new MatTableDataSource(data.result);
          this.dataSource = new MatTableDataSource(
            this.carsMovement.filteredData
          );
          this.dataSource.paginator = this.paginator;
          this.CarList = data.result;
          this.preparedatatoprint(data.result);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  TotalEmpAmount: any = 0;
  TotalownerAmount: any = 0;

  preparedatatoprint(data: any) {
    this.TotalEmpAmount = 0;
    this.TotalownerAmount = 0;

    for (var i = 0; i < data.length; i++) {
      debugger;
      this.TotalEmpAmount += data[i].empAmount;
      this.TotalownerAmount += data[i].ownerAmount;
    }
  }
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  Printcarmovement() {
    this.printDiv('printcarmovment');
  }
  printDiv(id: any) {
    this.print.print(id, environment.printConfig);
  }
  printAllcarmovment() {
    this.printDiv('printAllcarmovment');
  }

  printall: any;
  PrintCarMovementAll() {
    this._CarMovementService.PrintCarMovementAll().subscribe((data) => {
      this.printall = data;
      console.log(data);

      const timeoutDuration = 5000;

      setTimeout(() => {
        // Code to be executed after the timeout
        this.printAllcarmovment();
      }, timeoutDuration);
    });
  }
}
