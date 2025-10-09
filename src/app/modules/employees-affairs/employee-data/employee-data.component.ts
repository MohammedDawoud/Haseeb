import {
  Component,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RestApiService } from 'src/app/shared/services/api.service';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { EmployeesServiceService } from 'src/app/core/services/Employees-Services/employees-service.service';
import { Nationality } from 'src/app/core/Classes/DomainObjects/nationality';
import { ToastrService } from 'ngx-toastr';
import { Job } from 'src/app/core/Classes/DomainObjects/job';
import { Department } from 'src/app/core/Classes/DomainObjects/department';
import { City } from 'src/app/core/Classes/DomainObjects/city';
import { Employees } from 'src/app/core/Classes/DomainObjects/employees';
import { environment } from 'src/environments/environment';
import { VacationType } from 'src/app/core/Classes/DomainObjects/vacationType';
import { Vacation } from 'src/app/core/Classes/DomainObjects/vacations';
import { SharedService } from 'src/app/core/services/shared.service';
import { StaffholidayServiceService } from 'src/app/core/services/Employees-Services/staffholiday-service.service';
import { DiscountReward } from 'src/app/core/Classes/DomainObjects/discountReward';
import { AllowanceType } from 'src/app/core/Classes/DomainObjects/allowanceType';
import { Allowance } from 'src/app/core/Classes/DomainObjects/allowance';
import { Loan } from 'src/app/core/Classes/DomainObjects/loan';
import { MatTabGroup } from '@angular/material/tabs';
import { EmployeesVM } from 'src/app/core/Classes/ViewModels/employeesVM';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { EmpContract } from 'src/app/core/Classes/DomainObjects/empContract';
import { EmpContractService } from 'src/app/core/services/Employees-Services/emp-contract.service';
import { EmpContractVM } from 'src/app/core/Classes/ViewModels/empContractVM';
import { TranslateService } from '@ngx-translate/core';
import { NgxPrintElementService } from 'ngx-print-element';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
import 'hijri-date';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

declare let printJS: any;
interface Item {
  id: number;
  name: string;
}
@Component({
  selector: 'app-employee-data',
  templateUrl: './employee-data.component.html',
  styleUrls: ['./employee-data.component.scss'],
  // providers: [DatePipe],
  animations: [fade],
  encapsulation: ViewEncapsulation.Emulated,
})
export class EmployeeDataComponent {
  // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('tabGroup') tabGroup2: MatTabGroup;

  selectedDate: any;
  test: any = { year: 1445, month: 4, day: 20 };
  selectedDateType = DateType.Hijri;
  title: any = {
    main: {
      name: {
        ar: 'شؤون الموظفين',
        en: 'Employees Affairs',
      },
      link: '/employees',
    },
    sub: {
      ar: 'بيانات الموظفين',
      en: 'Employees Data',
    },
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  data: any = {
    selectedEmployee: null,
    employeesData: new MatTableDataSource([{}]),
    filter: {
      show: 1,
    },
    employeeAttachment: [],
    employeeAllowances: [],
    employeeVacations: [],
    employeeDisscount: [],
    employeeAlloans: [],
    selectedAttachment: {
      AttachmentId: 0,
      AttachmentName: '',
      Date: '',
      Notes: '',
    },
    selectedVacations: {
      vacationType: '',
      Date: '',
      vacationReason: '',
    },
  };
  searchBox: any = {
    open: false,
    searchType: null,
  };
  employee: any = null;
  statics: any = {
    open: false,
    data: {
      WithoutContracts: 0,
      WithoutMedicalInsurance: 0,
      DidnotStartWork: 0,
      HaveCustodies: 0,
      HaveLoans: 0,
      HaveDicounts: 0,
    },
  };
  displayedColumns: string[] = [
    'JobId',
    'EmployeeName',
    'NationalityName',
    'Age',
    'Salary',
    'JobName',
    'Email',
    'Mobile',
    'BranchName',
    'NationalId',
    'UserName',
    'operations',
  ];
  contract: any = {
    enablecontractdetails: true,
  };
  /////////////////////////////general////////////////////////////
  usersselect: any;
  nationalitiesslect: Item[];
  jobselect: any;
  departmentselect: any;
  branchselect: any;
  nationalitysourceselected: any;
  bankselect: any;
  dawamselect: any;
  Months: any;
  rewardstatus: any;
  ///////////////////////////////////////
  users: any;
  nationalities: any;
  job: any;
  department: any;
  branch: any;
  nationalitysource: any;
  //nationality
  nationalitylist: any;
  nationalitynamear: any;
  nationalitynameen: any;
  nationalityid = 0;
  public _natinalityobj: Nationality;
  nationalityiddelete: any;
  //job
  joblist: any;
  jobnamear: any;
  jobnameen: any;
  jobid = 0;
  public _jobobj: Job;
  jobiddelete: any;
  //department
  departmentlist: any;
  departmentnamear: any;
  departmentnameen: any;
  departmentid = 0;
  public _departmentobj: Department;
  departmentiddelete: any;
  //city
  citylist: any;
  citynamear: any;
  citynameen: any;
  cityid = 0;
  public _cityobj: City;
  cityiddelete: any;
  //////////////////////////////////////////////
  //department
  vacationtypelist: any;
  vacationtypenamear: any;
  vacationtypenameen: any;
  vacationtypeid = 0;
  public _vacationtypeobj: VacationType;
  vacationtypeiddelete: any;
  vacationtypenote: any;
  vacationtypeselect: any;
  /////////////////////////////////////////////
  //vacation
  vacationDetails: any = {
    id: null,
    employeeId: null,
    vacationType: null,
    date: null,
    from: null,
    to: null,
    discound: null,
    file: null,
    vacationbalance: null,
    discountamount: null,
    vacationReason: null,
  };
  public _vacationobj: Vacation;
  vacationiddelete: any;
  vacationselect: any;
  vacationlist: any;
  /////////////////////////////////////////////
  //Discount Reward

  discountRewardobj: any = {
    discountRewardId: 0,
    discountRewardName: null,
    monthnm: null,
    status: null,
    amount: null,
    notes: null,
  };

  public _discountrewardobj: DiscountReward;
  discountrewardiddelete: any;
  discountrewardselect: any;
  discountrewardlist: any;
  ///////////////////////////////////////////////////

  /////////////////////////////////////////////
  //Allownce Type

  AllownceTypeobj: any = {
    AllownceTypeId: 0,
    nameAr: null,
    nameEn: null,
    notes: null,
  };

  public _allowncetype: AllowanceType;
  allowncetypeiddelete: any;
  allowncetypeselect: any;
  allowncetypelist: any;
  ///////////////////////////////////////////////////
  //Allownce

  Allownceobj: any = {
    AllownceId: 0,
    AllownceTypeId: null,
    amount: null,
    monthNo: null,
  };

  public _allownce: Allowance;
  allownceiddelete: any;
  allownceselect: any;
  allowncelist: any;

  //////////////////////////////////////////////////////////////
  //Loan

  loanobj: any = {
    loanId: 0,
    date: null,
    amount: null,
    monthNo: null,
    startMonth: null,
    notes: null,
  };

  public _loan: Loan;
  loaniddelete: any;
  loanlist: any;
  ///////////////////////////////////////////////////

  empid = '0';
  employeeid = 0;
  vacationid = 0;

  directmangerselect: any;
  modalDetails: any = {
    employeeId: null,
    employeeNo: null,
    employeeNameAr: null,
    employeeNameEn: null,
    educationalQualification: null,
    birthDate: null,
    birthPlace: null,
    maritalStatus: null,
    childrenNo: null,
    gender: null,
    nationalityId: null,
    religionId: null,
    userId: null,
    jobId: null,
    departmentId: null,
    deppID: null,
    branchId: null,
    telephone: null,
    mobile: null,
    email: null,
    address: null,
    nationalId: null,
    nationalIdSource: null,
    nationalIdEndDate: null,
    nationalIdEndHijriDate: null, // { year: 1445, month: 4, day: 20 },
    file: null,
    photoUrl: null,
    addusername: null,
    adddate: null,
    addhigridate: null,
    directManager: null,
    age: null,
  };

  EmpOffDocObj: any = {
    employeeId: null,
    passportNo: null,
    passportSource: null,
    passportNoDate: null,
    passportEndDate: null,
    contractNo: null,
    contractStartDate: null,
    contractEndDate: null,
    medicalNo: null,
    medicalSource: null,
    medicalStartDate: null,
    medicalEndDate: null,
    dawamId: null,
    timeDurationLate: null,
    earlyLogin: null,
    logoutDuration: null,
    afterLogoutTime: null,
    salary: null,
    bonus: null,
    bankId: null,
    bankCardNo: null,
    taamen: null,
    vacationEndCount: null,
    housingsalary: null,
    pastVacationsCount: null,
    tameen2: null,
    QuaContract: null,
    Workstartdate: null,
    otherAllownces: null,
  };
  EmpAttachmentObj: any = {
    attachmentId: null,
    attachmentName: null,
    date: null,
    hijriDate: null,
    notes: null,
    file: null,
  };

  EmpSearchObj: any = {
    employeeNameAr: null,
    nationalId: null,
    mobile: null,
    passportNo: null,
    email: null,
    employeeNo: null,
  };
  public _employessVM: EmployeesVM;
  public _employess: Employees;
  employeeselect: any;
  employeeworkerselect: any;
  vacationBalance = 0;
  Salary = 0;
  vVacationDays = 0;
  VacationIsDiscount: any;
  employeeidtodelete: any;
  userG: any = {};
  public _empContractVM: EmpContractVM;
  public _empContract: EmpContract;

  environmnt = environment.PhotoURL;
  lang: any = 'ar';
  datePrintJournals: any = this._sharedService.date_TO_String(new Date());
  logourl: any;
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private _EmpService: EmployeesServiceService,
    private toast: ToastrService,
    private _sharedService: SharedService,
    private _staffholidayservice: StaffholidayServiceService,
    private renderer: Renderer2,
    private authenticationService: AuthenticationService,
    private _empcontractservice: EmpContractService,
    private translate: TranslateService,
    private printing: NgxPrintElementService
  ) {
    this.getData();
    this.userG = this.authenticationService.userGlobalObj;
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this._natinalityobj = new Nationality();
    this._jobobj = new Job();
    this._departmentobj = new Department();
    this._cityobj = new City();
    this._employess = new Employees();
    this._vacationtypeobj = new VacationType();
    this._allowncetype = new AllowanceType();
    this._employessVM = new EmployeesVM();
    this._empContractVM = new EmpContractVM();
    this._empContract = new EmpContract();
    debugger;
    // this.modalDetails.nationalIdEndHijriDate={year:1445,month:4,day:20}//new Date('12/3/1445');
    // this.selectedDateType=DateType.Hijri;
    api.lang.subscribe((res) => {
      this.lang = res;
    });
  }

  navigateToTab(tabIndex: number) {
    this.tabGroup2.selectedIndex = tabIndex;
  }
  onDatesChange(date: any) {
    console.log(date);
  }

  selectedItem: any; // You might want to define a type for your selected item

  selectedText: string;
  attachmentidtodelete: any;

  onSelectionChange() {
    // Assuming ng-select provides you with the selected item

    const selectedItem = this.nationalitiesslect.find(
      (itemm) => itemm.id === this.modalDetails.nationalityId
    );
    if (selectedItem) {
      this.selectedText = selectedItem.name;
    } else {
      this.selectedText = '';
    }
  }

  gethijri() {
    debugger;

    //let hijdt=this.datePipe.transform(this.modalDetails.nationalIdEndDate,'iYYYY/iM/iD HH:mm:ss')
    // let a= this._EmpService.GetHijriDate(this.modalDetails.nationalIdEndDate,'Contract/GetHijriDate');//.subscribe((result: any)=>{
    debugger;
    this._EmpService
      .GetHijriDate(
        this.modalDetails.nationalIdEndDate,
        'Contract/GetHijriDate2'
      )
      .subscribe({
        next: (data: any) => {
          debugger;
          console.log(data);
        },
        error: (error) => {
          console.log(error);
          debugger;
          this.modalDetails.nationalIdEndHijriDate = new Date(error);
        },
      });
    // assign data to table
    //     console.log(result);
    //   this.modalDetails.nationalIdEndHijriDate=result

    // });
    this.modalDetails.nationalIdEndHijriDate = this._sharedService.hijridate;
    console.log('zaaaa', this._sharedService.hijridate);
  }
  dataprint: any;
  getData() {
    this._EmpService.GetAllEmployees().subscribe({
      next: (data: any) => {
        // assign data to table
        console.log(data.result);
        this.data.employeesData = new MatTableDataSource(data.result);
        this.dataSourceTemp = data.result;
        this.dataprint = data.result;
        this.data.employeesData.paginator = this.paginator;
        this.data.employeesData.sort = this.sort;
        // this.data.employeeAttachment = data.employeeAttachment;
        // this.data.employeeAllowances = data.employeeAllowances;
        // this.data.employeeVacations = data.employeeVacations;
        // this.data.employeeDisscount = data.employeeDisscount;
        // this.data.employeeAlloans = data.employeeAlloans;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  userimg: any;
  getuserData(userid: any) {
    this._EmpService.GetUserById(userid).subscribe({
      next: (data: any) => {
        debugger;
        // assign data to table
        this.modalDetails.addusername = data.result.fullName;
        if (data.result.imgUrl != null && data.result.imgUrl != '') {
          this.modalDetails.addEmployeeImg =
            environment.PhotoURL + data.result.imgUrl;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  dataSourceTemp: any = [];
  SearchEmployees() {
    this._employessVM = new EmployeesVM();
    this._employessVM.employeeNameAr = this.EmpSearchObj.employeeNameAr;
    this._employessVM.nationalId = this.EmpSearchObj.nationalId;
    this._employessVM.mobile = this.EmpSearchObj.mobile;
    this._employessVM.passportNo = this.EmpSearchObj.passportNo;
    this._employessVM.email = this.EmpSearchObj.email;
    this._employessVM.employeeNo = this.EmpSearchObj.employeeNo;

    this._EmpService.SearchEmployees(this._employessVM).subscribe({
      next: (data: any) => {
        // assign data to table
        console.log(data.result);
        this.data.employeesData = new MatTableDataSource(data.result);
        this.dataSourceTemp = data.result;
        this.data.employeesData.paginator = this.paginator;
        this.data.employeesData.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  DeleteEmployee() {
    this._EmpService
      .DeleteEmployee(this.employeeidtodelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  GetEmployeeStatistics() {
    this._EmpService.GetEmployeeStatistics().subscribe({
      next: (data: any) => {
        this.statics.data.WithoutContracts = data.result.withoutContracts ?? 0;
        this.statics.data.WithoutMedicalInsurance =
          data.result.withoutMedicalInsurance ?? 0;
        this.statics.data.DidnotStartWork = data.result.didnotStartWork ?? 0;
        this.statics.data.HaveCustodies = data.result.haveCustodies ?? 0;
        this.statics.data.HaveLoans = data.result.haveLoans ?? 0;
        this.statics.data.HaveDicounts = data.result.haveDicounts ?? 0;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  SaveEmployeedata() {
    if (
      this.modalDetails.employeeNo == null ||
      this.modalDetails.employeeNameAr == null ||
      this.modalDetails.employeeNameEn == null ||
      this.modalDetails.nationalityId == null ||
      this.modalDetails.mobile == null ||
      this.modalDetails.maritalStatus == null ||
      this.modalDetails.nationalId == null ||
      this.modalDetails.nationalIdSource == null ||
      this.modalDetails.nationalIdEndDate == null ||
      this.modalDetails.birthDate == null ||
      this.modalDetails.email == null ||
      this.modalDetails.departmentId == null ||
      this.modalDetails.branchId == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    const formData = new FormData();

    // let bdt = this.datePipe
    //   .transform(this.modalDetails.birthDate, 'YYYY-MM-dd')
    //   ?.toString();
    // this.modalDetails.birthDate = bdt;
    // let ndt = this.datePipe
    //   .transform(this.modalDetails.nationalIdEndDate, 'YYYY-MM-dd')
    //   ?.toString();
    // this.data.nationalIdEndDate = ndt;
    formData.append('UploadedEmployeeImage', this.control?.value[0]);

    formData.append('EmployeeId', this.empid);
    formData.append('EmployeeNo', this.modalDetails.employeeNo);
    formData.append('EmployeeNameAr', this.modalDetails.employeeNameAr);
    formData.append('EmployeeNameEn', this.modalDetails.employeeNameEn);
    formData.append(
      'EducationalQualification',
      this.modalDetails.educationalQualification
    );
    if (this.modalDetails.birthDate != null) {
      formData.append(
        'BirthDate',
        this._sharedService.date_TO_String(this.modalDetails.birthDate)
      );
    } else {
      formData.append('BirthDate', '');
    }
    formData.append('BirthPlace', this.modalDetails.birthPlace);
    formData.append('MaritalStatus', this.modalDetails.maritalStatus);
    formData.append('ChildrenNo', this.modalDetails.childrenNo ?? 0);
    formData.append('Gender', this.modalDetails.gender);
    formData.append('NationalityId', this.modalDetails.nationalityId);
    formData.append('ReligionId', this.modalDetails.religionId);
    formData.append('UserId', this.modalDetails.userId ?? 0);

    formData.append('JobId', this.modalDetails.jobId);
    formData.append('DepartmentId', this.modalDetails.departmentId);
    formData.append('DeppID', '0');
    formData.append('BranchId', this.modalDetails.branchId);
    formData.append('Telephone', this.modalDetails.telephone);
    formData.append('Mobile', this.modalDetails.mobile);
    formData.append('Email', this.modalDetails.email);
    formData.append('Address', this.modalDetails.address);
    formData.append('DirectManager', this.modalDetails.directManager ?? 0);
    formData.append('Age', this.modalDetails.age);

    // formData.append('NationalIdEndDate', this.data.nationalIdEndDate);

    var nationality = this.selectedText;
    if (nationality.includes('سعودي')) {
      if (this.modalDetails.nationalId.charAt(0) != '1') {
        this.toast.success('يجب ان يبدأ رقم الهوية ب 1', 'رسالة');

        return false;
      }
    } else {
      if (this.modalDetails.nationalId.charAt(0) != '2') {
        this.toast.success('يجب ان يبدأ رقم الهوية ب 2', 'رسالة');

        return false;
      }
    }

    formData.append('NationalId', this.modalDetails.nationalId);
    formData.append('NationalIdSource', this.modalDetails.nationalIdSource);
    // var result = this.dateIsValid(this.modalDetails.nationalIdEndDate);

    // if ((result == false && this.modalDetails.nationalIdEndDate != null && this.modalDetails.nationalIdEndDate != "")) {
    //     this.toast.success("خطا في صيغة التاريخ من فضلك اختر تاريخ",'رسالة');

    //     return false;
    // }
    // formData.append('NationalIdEndDate', this.modalDetails.nationalIdEndDate);
    // formData.append(
    //   'NationalIdEndHijriDate',
    //   this.modalDetails.nationalIdEndHijriDate
    // );

    if (this.modalDetails.nationalIdEndDate != null) {
      formData.append(
        'NationalIdEndDate',
        this._sharedService.date_TO_String(this.modalDetails.nationalIdEndDate)
      );

      const nowHijri = toHijri(this.modalDetails.nationalIdEndDate);
      formData.append(
        'NationalIdEndHijriDate',
        this._sharedService.hijri_TO_String(nowHijri)
      );
    }

    this._EmpService.SaveEmployee(formData).subscribe((result) => {
      if (result.statusCode == 200) {
        debugger;
        this.employeeid = result.returnedParm;
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.getData();
        this.navigateToTab(2);
        // const selectedIndex = this.tabGroup.selectedIndex??0;
        // const nextIndex = selectedIndex + 1;

        // if (nextIndex < this.tabGroup._tabs.length) {
        //   this.renderer.setProperty(this.tabGroup, 'selectedIndex', nextIndex);
        // } else {
        //   // Handle when you reach the last tab
        // }
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
    return;
  }
  refreshempdata() {
    debugger;
    const DateHijri = toHijri(new Date());
    var DateGre = new HijriDate(
      DateHijri._year,
      DateHijri._month,
      DateHijri._date
    );
    DateGre._day = DateGre._date;

    this.modalDetails.employeeId = null;
    this.modalDetails.employeeNo = null;
    this.modalDetails.employeeNameAr = null;
    this.modalDetails.employeeNameEn = null;
    this.modalDetails.educationalQualification = null;
    this.modalDetails.birthDate = null;
    this.modalDetails.birthPlace = null;
    this.modalDetails.maritalStatus = null;
    this.modalDetails.childrenNo = null;
    this.modalDetails.gender = null;
    this.modalDetails.nationalityId = null;
    this.modalDetails.religionId = null;
    this.modalDetails.userId = null;
    this.modalDetails.jobId = null;
    this.modalDetails.departmentId = null;
    this.modalDetails.deppID = null;
    this.modalDetails.branchId = null;
    this.modalDetails.telephone = null;
    this.modalDetails.mobile = null;
    this.modalDetails.email = null;
    this.modalDetails.address = null;
    this.modalDetails.nationalId = null;
    this.modalDetails.nationalIdSource = null;
    this.modalDetails.nationalIdEndDate = new Date();
    this.modalDetails.nationalIdEndHijriDate = DateGre;
    this.modalDetails.file = null;
  }

  //Date-Hijri
  ChangeemployeeGre(event: any) {
    debugger;

    if (event != null) {
      const DateHijri = toHijri(this.modalDetails.nationalIdEndDate);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalDetails.nationalIdEndHijriDate = DateGre;
    } else {
      this.modalDetails.nationalIdEndHijriDate = null;
    }
  }
  ChangeemployeeDateHijri(event: any) {
    debugger;
    if (event != null) {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.modalDetails.nationalIdEndDate = dayGreg;
    } else {
      this.modalDetails.nationalIdEndDate = null;
    }
  }

  SaveOfficialDocsandstartjob() {
    console.log(this.EmpOffDocObj);
    debugger;
    if (
      this.EmpOffDocObj.earlyLogin == null ||
      this.EmpOffDocObj.dawamId == null ||
      this.EmpOffDocObj.timeDurationLate == null ||
      this.EmpOffDocObj.logoutDuration == null ||
      this.EmpOffDocObj.afterLogoutTime == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    if (
      this.EmpOffDocObj.contractStartDate == null ||
      this.EmpOffDocObj.contractEndDate == null ||
      this.EmpOffDocObj.salary == null ||
      this.EmpOffDocObj.salary == ''
    ) {
      this.toast.error('من فضلك ادخل بداية ونهاية العقد والراتب ', 'رسالة');
      return;
    } else {
      this._employess.beginWork = '1';
    }

    this._employess = new Employees();
    this._employess.beginWork = '1';
    if (this.employeeid != null && this.employeeid != 0) {
      this._employess.employeeId = this.employeeid;
      this._employess.passportNo = this.EmpOffDocObj.passportNo;
      if (this.EmpOffDocObj.passportSource != null) {
        this._employess.passportSource =
          this.EmpOffDocObj.passportSource.toString() ?? '0';
      } else {
        this._employess.passportSource = '0';
      }
      this._employess.passportNoDate = this.EmpOffDocObj.passportNoDate;
      this._employess.passportEndDate = this.EmpOffDocObj.passportEndDate;
      this._employess.contractNo = this.EmpOffDocObj.contractNo;
      if (this.EmpOffDocObj.contractStartDate != null) {
        this._employess.contractStartDate = this._sharedService.date_TO_String(
          this.EmpOffDocObj.contractStartDate
        );
      }
      if (this.EmpOffDocObj.contractEndDate != null) {
        this._employess.contractEndDate = this._sharedService.date_TO_String(
          this.EmpOffDocObj.contractEndDate
        );
      }
      this._employess.medicalNo = this.EmpOffDocObj.medicalNo;
      this._employess.medicalSource = this.EmpOffDocObj.medicalSource;
      this._employess.medicalStartDate = this.EmpOffDocObj.medicalStartDate;
      this._employess.medicalEndDate = this.EmpOffDocObj.medicalEndDate;
      this._employess.dawamId = this.EmpOffDocObj.dawamId;
      this._employess.timeDurationLate = this.EmpOffDocObj.timeDurationLate;
      this._employess.earlyLogin = this.EmpOffDocObj.earlyLogin;
      this._employess.logoutDuration = this.EmpOffDocObj.logoutDuration;
      this._employess.afterLogoutTime = this.EmpOffDocObj.afterLogoutTime;
      this._employess.salary = this.EmpOffDocObj.salary;
      this._employess.bonus = this.EmpOffDocObj.bonus;
      this._employess.bankId = this.EmpOffDocObj.bankId;
      this._employess.bankCardNo = this.EmpOffDocObj.bankCardNo;
      this._employess.taamen = this.EmpOffDocObj.taamen;
      this._employess.vacationEndCount = this.EmpOffDocObj.vacationEndCount;
      this._employess.allowances = this.EmpOffDocObj.housingsalary;
      this._employess.otherAllownces = this.EmpOffDocObj.otherAllownces;

      this._EmpService
        .SaveOfficialDocuments(this._employess)
        .subscribe((result) => {
          debugger;
          if (result.statusCode == 200) {
            //this.employeeid=  result.returnedParm;

            if (this.EmpOffDocObj.QuaContract != null) {
              const formData = new FormData();
              this.datenow = this._sharedService.date_TO_String(new Date());
              formData.append('EmployeeId', this.employeeid.toString());
              formData.append('postedFiles', this.EmpOffDocObj.QuaContract);
              formData.append('AttachmentId', '0');
              formData.append('AttachmentName', 'عقد قوي');
              formData.append('Date', this.datenow?.toString());
              formData.append('HijriDate', '');
              formData.append('Notes', 'عقد قوي');

              this._EmpService.SaveAttachment2(formData).subscribe((result) => {
                if (result.statusCode == 200) {
                  //  this.employeeid=  result.returnedParm;
                  this.toast.success(
                    this.translate.instant(result.reasonPhrase),
                    this.translate.instant('Message')
                  );
                  this.getData();
                } else {
                  this.toast.error(result.reasonPhrase, 'رسالة');
                }
              });
            }
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.getData();
          } else {
            this.toast.error(result.reasonPhrase, 'رسالة');
          }
        });
      return;
    }
  }

  datenow: any;
  SaveOfficialDocs() {
    debugger;
    console.log(this.EmpOffDocObj);

    if (
      this.EmpOffDocObj.earlyLogin == null ||
      this.EmpOffDocObj.dawamId == null ||
      this.EmpOffDocObj.timeDurationLate == null ||
      this.EmpOffDocObj.logoutDuration == null ||
      this.EmpOffDocObj.afterLogoutTime == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    this._employess = new Employees();
    if (this.EmpOffDocObj.QuaContract != null) {
      if (
        this.EmpOffDocObj.contractStartDate == null ||
        this.EmpOffDocObj.contractEndDate == null ||
        this.EmpOffDocObj.salary == null
      ) {
        this.toast.error('من فضلك ادخل بداية ونهاية العقد والراتب ', 'رسالة');
        return;
      } else {
        this._employess.beginWork = '1';
      }
    }
    if (this.employeeid != null && this.employeeid != 0) {
      this._employess.employeeId = this.employeeid;
      this._employess.passportNo = this.EmpOffDocObj.passportNo;
      // this._employess.passportSource = this.EmpOffDocObj.passportSource ?? '0';
      if (this.EmpOffDocObj.passportSource != null) {
        this._employess.passportSource =
          this.EmpOffDocObj.passportSource.toString() ?? '0';
      } else {
        this._employess.passportSource = '0';
      }
      this._employess.passportNoDate = this.EmpOffDocObj.passportNoDate;
      this._employess.passportEndDate = this.EmpOffDocObj.passportEndDate;
      this._employess.contractNo = this.EmpOffDocObj.contractNo;
      // this._employess.contractStartDate = this.datePipe.transform(
      //   this.EmpOffDocObj.contractStartDate,
      //   'YYYY-MM-dd'
      // );
      // this._employess.contractEndDate = this.datePipe.transform(
      //   this.EmpOffDocObj.contractEndDate,
      //   'YYYY-MM-dd'
      // );

      if (this.EmpOffDocObj.contractStartDate != null) {
        this._employess.contractStartDate = this._sharedService.date_TO_String(
          this.EmpOffDocObj.contractStartDate
        );
      }
      if (this.EmpOffDocObj.contractEndDate != null) {
        this._employess.contractEndDate = this._sharedService.date_TO_String(
          this.EmpOffDocObj.contractEndDate
        );
      }
      this._employess.medicalNo = this.EmpOffDocObj.medicalNo;
      this._employess.medicalSource = this.EmpOffDocObj.medicalSource;
      this._employess.medicalStartDate = this.EmpOffDocObj.medicalStartDate;
      this._employess.medicalEndDate = this.EmpOffDocObj.medicalEndDate;
      this._employess.dawamId = this.EmpOffDocObj.dawamId;
      this._employess.timeDurationLate = this.EmpOffDocObj.timeDurationLate;
      this._employess.earlyLogin = this.EmpOffDocObj.earlyLogin;
      this._employess.logoutDuration = this.EmpOffDocObj.logoutDuration;
      this._employess.afterLogoutTime = this.EmpOffDocObj.afterLogoutTime;
      this._employess.salary = this.EmpOffDocObj.salary;
      this._employess.bonus = this.EmpOffDocObj.bonus;
      this._employess.bankId = this.EmpOffDocObj.bankId;
      this._employess.bankCardNo = this.EmpOffDocObj.bankCardNo;
      this._employess.taamen = this.EmpOffDocObj.taamen;
      this._employess.vacationEndCount = this.EmpOffDocObj.vacationEndCount;
      this._employess.allowances = this.EmpOffDocObj.housingsalary;
      this._employess.otherAllownces = this.EmpOffDocObj.otherAllownces;

      this._EmpService
        .SaveOfficialDocuments(this._employess)
        .subscribe((result) => {
          debugger;
          if (result.statusCode == 200) {
            // this.employeeid=  result.returnedParm;
            if (this.EmpOffDocObj.QuaContract != null) {
              const formData = new FormData();
              this.datenow = this._sharedService.date_TO_String(new Date());
              formData.append('EmployeeId', this.employeeid.toString());
              formData.append('postedFiles', this.EmpOffDocObj.QuaContract);
              formData.append('AttachmentId', '0');
              formData.append('AttachmentName', 'عقد قوي');
              formData.append('Date', this.datenow?.toString());
              formData.append('HijriDate', '');
              formData.append('Notes', 'عقد قوي');

              this._EmpService.SaveAttachment2(formData).subscribe((result) => {
                if (result.statusCode == 200) {
                  //this.employeeid=  result.returnedParm;
                  this.toast.success(
                    this.translate.instant(result.reasonPhrase),
                    this.translate.instant('Message')
                  );
                  this.getData();
                } else {
                  this.toast.error(result.reasonPhrase, 'رسالة');
                }
              });
            }

            // this.employeeid=  result.returnedParm;
            this.toast.success(
              this.translate.instant(result.reasonPhrase),
              this.translate.instant('Message')
            );
            this.getData();
          } else {
            this.toast.error(result.reasonPhrase, 'رسالة');
          }
        });
      return;
    }
  }

  Checkpassportfromdate() {
    debugger;

    if (this.EmpOffDocObj.passportEndDate != null) {
      if (
        this.EmpOffDocObj.passportNoDate > this.EmpOffDocObj.passportEndDate
      ) {
        this.EmpOffDocObj.passportNoDate = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
  }
  Checkpassporttodate() {
    debugger;

    if (this.EmpOffDocObj.passportNoDate != null) {
      if (
        this.EmpOffDocObj.passportEndDate < this.EmpOffDocObj.passportNoDate
      ) {
        this.EmpOffDocObj.passportEndDate = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
  }

  Checkmedicalfromdate() {
    debugger;

    if (this.EmpOffDocObj.medicalEndDate != null) {
      if (
        this.EmpOffDocObj.medicalStartDate > this.EmpOffDocObj.medicalEndDate
      ) {
        this.EmpOffDocObj.medicalStartDate = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
  }
  Checkmedicaltodate() {
    debugger;

    if (this.EmpOffDocObj.medicalStartDate != null) {
      if (
        this.EmpOffDocObj.medicalEndDate < this.EmpOffDocObj.medicalStartDate
      ) {
        this.EmpOffDocObj.medicalEndDate = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
  }

  refreshofficialdocuments() {
    this.EmpOffDocObj.employeeId = null;
    this.EmpOffDocObj.passportNo = null;
    this.EmpOffDocObj.passportSource = null;
    this.EmpOffDocObj.passportNoDate = null;
    this.EmpOffDocObj.passportEndDate = null;
    this.EmpOffDocObj.contractNo = null;
    this.EmpOffDocObj.contractStartDate = null;
    this.EmpOffDocObj.contractEndDate = null;
    this.EmpOffDocObj.medicalNo = null;
    this.EmpOffDocObj.medicalSource = null;
    this.EmpOffDocObj.medicalStartDate = null;
    this.EmpOffDocObj.medicalEndDate = null;
    this.EmpOffDocObj.dawamId = 1;
    this.EmpOffDocObj.timeDurationLate = 10;
    this.EmpOffDocObj.earlyLogin = 10;
    this.EmpOffDocObj.logoutDuration = 10;
    this.EmpOffDocObj.afterLogoutTime = 10;
    this.EmpOffDocObj.salary = null;
    this.EmpOffDocObj.bonus = null;
    this.EmpOffDocObj.bankId = null;
    this.EmpOffDocObj.bankCardNo = null;
    this.EmpOffDocObj.taamen = null;
    this.EmpOffDocObj.vacationEndCount = null;
    this.EmpOffDocObj.housingsalary = null;
    this.EmpOffDocObj.otherAllownces = null;

    this.EmpOffDocObj.pastVacationsCount = null;
    this.EmpOffDocObj.tameen2 = null;
  }

  setempdatatoedit(data: any) {
    //employee data
    this.modalDetails.employeeId = data.employeeId;
    this.modalDetails.employeeNo = data.employeeNo;
    this.modalDetails.employeeNameAr = data.employeeNameAr;
    this.modalDetails.employeeNameEn = data.employeeNameEn;
    this.modalDetails.educationalQualification = data.educationalQualification;
    this.modalDetails.birthDate = new Date(data.birthDate);
    this.modalDetails.birthPlace = data.birthPlace;
    this.modalDetails.maritalStatus = data.maritalStatus;
    this.modalDetails.childrenNo = data.childrenNo;
    this.modalDetails.gender = data.gender;
    this.modalDetails.nationalityId = data.nationalityId;
    this.modalDetails.religionId = data.religionId;
    this.modalDetails.userId = data.userId;
    this.modalDetails.jobId = data.jobId;
    this.modalDetails.departmentId = data.departmentId;
    this.modalDetails.deppID = data.deppID;
    this.modalDetails.branchId = data.branchId;
    this.modalDetails.telephone = data.telephone;
    this.modalDetails.mobile = data.mobile;
    this.modalDetails.email = data.email;
    this.modalDetails.address = data.address;
    this.modalDetails.nationalId = data.nationalId;
    this.modalDetails.nationalIdSource = data.nationalIdSource;
    this.modalDetails.nationalIdEndDate = new Date(data.nationalIdEndDate);
    // this.modalDetails.nationalIdEndHijriDate = new Date(
    //   data.nationalIdEndHijriDate
    // );
    if (this.modalDetails.nationalIdEndDate != null) {
      const DateHijri = toHijri(this.modalDetails.nationalIdEndDate);
      var DateGre = new HijriDate(
        DateHijri._year,
        DateHijri._month,
        DateHijri._date
      );
      DateGre._day = DateGre._date;
      this.modalDetails.nationalIdEndHijriDate = DateGre;
    }
    this.modalDetails.file = data.file;
    this.modalDetails.directManager = data.directManager;
    this.modalDetails.age = data.age;
    this.CalculateAge();
    this.modalDetails.photoUrl = data.photoUrl;
    debugger;
    this.onSelectionChange();
    console.log(this.modalDetails);
    debugger;
    this.getuserData(data.addUser);
    // this.modalDetails.adddate=data.addDate;
    this.modalDetails.adddate = this._sharedService.date_TO_String(
      new Date(data.addDate)
    );

    //official document data
    debugger;
    this.EmpOffDocObj.employeeId = data.employeeId;
    this.EmpOffDocObj.passportNo = data.passportNo;
    this.EmpOffDocObj.passportSource = parseInt(data.passportSource);
    this.EmpOffDocObj.passportNoDate = new Date(data.passportNoDate);
    this.EmpOffDocObj.passportEndDate = new Date(data.passportEndDate);
    this.EmpOffDocObj.contractNo = data.contractNo;
    this.EmpOffDocObj.Workstartdate = data.workStartDate;
    if (data.contractStartDate != null) {
      var stdate = new Date(data.contractStartDate);

      this.EmpOffDocObj.contractStartDate = stdate; //this.getformateddate(stdate);
    }
    if (data.contractEndDate != null) {
      var endate = new Date(data.contractEndDate);
      this.EmpOffDocObj.contractEndDate = endate; //; this.getformateddate(endate);
    }

    this.EmpOffDocObj.medicalNo = data.medicalNo;
    this.EmpOffDocObj.medicalSource = data.medicalSource;
    this.EmpOffDocObj.medicalStartDate = new Date(data.medicalStartDate);
    this.EmpOffDocObj.medicalEndDate = new Date(data.medicalEndDate);
    this.EmpOffDocObj.dawamId = data.dawamId;
    this.EmpOffDocObj.timeDurationLate = data.timeDurationLate;
    this.EmpOffDocObj.earlyLogin = data.earlyLogin;
    this.EmpOffDocObj.logoutDuration = data.logoutDuration;
    this.EmpOffDocObj.afterLogoutTime = data.afterLogoutTime;
    this.EmpOffDocObj.salary = data.salary;
    this.EmpOffDocObj.bonus = data.bonus;
    this.EmpOffDocObj.bankId = data.bankId;
    this.EmpOffDocObj.bankCardNo = data.bankCardNo;
    this.EmpOffDocObj.taamen = data.taamen;
    this.EmpOffDocObj.housingsalary = data.allowances;
    this.EmpOffDocObj.otherAllownces = data.otherAllownces;
    this.GetVacationbalance(data);
    // let vacationBalance = data.vacationEndCount;

    // if (vacationBalance == '' || vacationBalance == null) vacationBalance = 0;
    // if (vacationBalance <= 30) {
    //   this.EmpOffDocObj.vacationEndCount = vacationBalance;
    //   this.EmpOffDocObj.pastVacationsCount = 0;
    // } else {
    //   this.EmpOffDocObj.vacationEndCount = 30;
    //   var past = vacationBalance - 30;

    //   this.EmpOffDocObj.pastVacationsCount = past;
    // }
    debugger;
    if (data.salary != null && data.taamen != null) {
      var tamnvalue =
        ((parseFloat(data.salary) + parseFloat(data.allowances)) *
          parseFloat(data.taamen)) /
        100;

      this.EmpOffDocObj.tameen2 = tamnvalue + ' ريال شهرياً';
    } else {
      this.EmpOffDocObj.tameen2 = '';
    }
  }

  GetVacationbalance(data: any) {
    this._EmpService.GetContractByEmpId(data.employeeId).subscribe((dataa) => {
      debugger;
      let vacationBalance = data.vacationEndCount;

      if (vacationBalance == '' || vacationBalance == null) vacationBalance = 0;
      if (vacationBalance <= dataa.durationofannualleave) {
        this.EmpOffDocObj.vacationEndCount = vacationBalance;
        this.EmpOffDocObj.pastVacationsCount = 0;
      } else {
        this.EmpOffDocObj.vacationEndCount = dataa.durationofannualleave;
        var past = vacationBalance - dataa.durationofannualleave;

        this.EmpOffDocObj.pastVacationsCount = past;
      }
    });
  }

  //    dateIsValid(dateStr:any) {
  //     const regex = /^\d{4}-\d{2}-\d{2}$/;

  //     if (dateStr.match(regex) === null) {
  //         return false;
  //     }

  //     const date = new Date(dateStr);

  //     const timestamp = date.getTime();

  //     if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
  //         return false;
  //     }

  //     return true;
  // }

  getformateddate(dateString: any) {
    //const dateString = '2023-09-21';  // Replace with your date string
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JavaScript Date object
    const day = parseInt(dateParts[2]);

    const utcDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
    console.log('UTC Date:', utcDate.toISOString());

    // If you want to display it in a specific format (e.g., "yyyy-MM-dd")
    // const formattedDate = utcDate.toISOString().split('T')[0];
    // console.log('Formatted Date:', formattedDate);

    return utcDate;
  }

  GetAllAttachments() {
    this._EmpService.GetAllAttachments(this.employeeid).subscribe((data) => {
      console.log(data);
      this.data.employeeAttachment = data.result;
    });
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.EmpAttachmentObj.file = event.target.files[0];
    }
  }
  onFileqoaSelected(event: any) {
    if (event.target.files.length > 0) {
      this.EmpOffDocObj.QuaContract = event.target.files[0];
    }
  }

  saveAttachment() {
    const formData = new FormData();
    if (
      this.EmpAttachmentObj.attachmentName == null ||
      this.EmpAttachmentObj.date == null ||
      this.EmpAttachmentObj.file == null ||
      this.EmpAttachmentObj.attachmentName == '' ||
      this.EmpAttachmentObj.date == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    // let dat = this.datePipe
    //   .transform(this.EmpAttachmentObj.date, 'YYYY-MM-dd')
    //   ?.toString();
    if (this.EmpAttachmentObj.date != null) {
      formData.append(
        'Date',
        this._sharedService.date_TO_String(this.EmpAttachmentObj.date)
      );
    } else {
      formData.append('Date', '');
    }
    formData.append('EmployeeId', this.employeeid.toString());
    formData.append('postedFiles', this.EmpAttachmentObj.file);
    formData.append('AttachmentId', this.EmpAttachmentObj.attachmentId ?? 0);
    formData.append('AttachmentName', this.EmpAttachmentObj.attachmentName);
    // formData.append('Date', dat?.toString() ?? '');
    formData.append('HijriDate', this.EmpAttachmentObj.hijriDate);
    formData.append('Notes', this.EmpAttachmentObj.notes);

    this._EmpService.SaveAttachment(formData).subscribe((result) => {
      if (result.statusCode == 200) {
        // this.employeeid=  result.returnedParm;
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        this.getData();
        this.GetAllAttachments();
        this.RefreshAttachment();
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  editFile(data: any) {
    this.EmpAttachmentObj.attachmentId = data.attachmentId;
    this.EmpAttachmentObj.attachmentName = data.attachmentName;
    this.EmpAttachmentObj.date = data.date;
    this.EmpAttachmentObj.notes = data.notes;
  }
  RefreshAttachment() {
    this.EmpAttachmentObj.attachmentId = 0;
    this.EmpAttachmentObj.attachmentName = '';
    this.EmpAttachmentObj.date = null;
    this.EmpAttachmentObj.notes = '';
  }
  deleteFile() {
    this._EmpService
      .DeleteAttachment(this.attachmentidtodelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.GetAllAttachments();
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  downloadFile(data: any) {
    var link = environment.PhotoURL + data.attachmentUrl;
    window.open(link, '_blank');
  }

  downloadFileqoa(data: any) {
    var link = environment.PhotoURL + data;
    window.open(link, '_blank');
  }

  filluserselect() {
    this._EmpService.FillAllUsersSelectAll().subscribe((data) => {
      this.usersselect = data;
    });
  }
  FillBranchSelect() {
    this._EmpService.FillBranchSelect().subscribe((data) => {
      this.branchselect = data;
    });
  }
  FillCitySelect() {
    this._EmpService.FillCitySelect().subscribe((data) => {
      this.nationalitysourceselected = data;
    });
  }
  FillDepartmentSelectByType() {
    this._EmpService.FillDepartmentSelectByType().subscribe((data) => {
      this.departmentselect = data;
    });
  }
  FillNationalitySelect() {
    this._EmpService.FillNationalitySelect().subscribe((data) => {
      this.nationalitiesslect = data;
    });
  }
  FillJobSelect() {
    this._EmpService.FillJobSelect().subscribe((data) => {
      this.jobselect = data;
    });
  }
  FillBankSelect() {
    this._EmpService.FillBankSelect().subscribe((data) => {
      this.bankselect = data;
    });
  }
  FillAttendanceTimeSelect() {
    this._EmpService.FillAttendanceTimeSelect().subscribe((data) => {
      this.dawamselect = data;
    });
  }
  FillVacationTypeSelect() {
    this._EmpService.FillVacationTypeSelect().subscribe((data) => {
      this.vacationtypeselect = data;
    });
  }

  FillAllowanceTypeSelect() {
    this._EmpService.FillAllowanceTypeSelect().subscribe((data) => {
      this.allowncetypeselect = data;
    });
  }

  FillDirectmanagerSelect() {
    this._EmpService.FillEmployeeSelect().subscribe((data) => {
      this.directmangerselect = data;
    });
  }

  ///////////////////////////////nationality crud operations/////////////////////////////
  GetAllNationalities() {
    this._EmpService.GetAllNationalities().subscribe((data) => {
      this.nationalitylist = data.result;
    });
  }
  editnationality(data: any) {
    this.nationalitynamear = data.nameAr;
    this.nationalitynameen = data.nameEn;
    this.nationalityid = data.nationalityId;
  }
  savenationality() {
    debugger;
    if (this.nationalitynamear == null || this.nationalitynameen == null) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._natinalityobj = new Nationality();
    this._natinalityobj.nationalityId = this.nationalityid;
    this._natinalityobj.nameAr = this.nationalitynamear;
    this._natinalityobj.nameEn = this.nationalitynameen;
    this._EmpService
      .SaveNationality(this._natinalityobj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllNationalities();
          this.FillNationalitySelect();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  deletenationality() {
    if (this.nationalityiddelete <= 44) {
      this.toast.error(' عفوا لا يمكن حذف هذا العنصر', 'رسالة');
      return;
    }
    this._EmpService
      .DeleteNationality(this.nationalityiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllNationalities();
          this.FillNationalitySelect();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  //  ///////////////////////////////jobs Crud Operations/////////////////////////////
  GetAllJobs() {
    this._EmpService.GetAllJobs().subscribe((data) => {
      this.joblist = data.result;
    });
  }
  editjob(data: any) {
    this.jobnamear = data.jobNameAr;
    this.jobnameen = data.jobNameEn;
    this.jobid = data.jobId;
  }
  SaveJob() {
    if (this.jobnamear == null || this.jobnameen == null) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._jobobj = new Job();
    this._jobobj.jobId = this.jobid;
    this._jobobj.jobNameAr = this.jobnamear;
    this._jobobj.jobNameEn = this.jobnameen;
    this._EmpService.SaveJob(this._jobobj).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.FillJobSelect();
        this.GetAllJobs();
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  DeleteJob() {
    this._EmpService.DeleteJob(this.jobiddelete).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.FillJobSelect();
        this.GetAllJobs();

        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  /////////////////////////////Department crud operations ////////////////////////////////////////////
  GetAllDepartmentbyType() {
    this._EmpService.GetAllDepartmentbyType().subscribe((data) => {
      this.departmentlist = data.result;
    });
  }
  editdepartment(data: any) {
    this.departmentnamear = data.nameAr;
    this.departmentnameen = data.nameEn;
    this.departmentid = data.departmentId;
  }
  SaveDepartment() {
    if (this.departmentnamear == null || this.departmentnameen == null) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._departmentobj = new Department();
    this._departmentobj.departmentId = this.departmentid;
    this._departmentobj.departmentNameAr = this.departmentnamear;
    this._departmentobj.departmentNameEn = this.departmentnameen;
    this._departmentobj.type = 1;
    this._EmpService
      .SaveDepartment(this._departmentobj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.FillDepartmentSelectByType();
          this.GetAllDepartmentbyType();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  DeleteDepartment() {
    this._EmpService
      .DeleteDepartment(this.departmentiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.FillDepartmentSelectByType();
          this.GetAllDepartmentbyType();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  /////////////////////////////Cities crud operations ////////////////////////////////////////////
  GetAllCities() {
    this._EmpService.GetAllCities().subscribe((data) => {
      this.citylist = data.result;
    });
  }
  editcity(data: any) {
    this.citynamear = data.nameAr;
    this.citynameen = data.nameEn;
    this.cityid = data.cityId;
  }
  SaveCity() {
    if (this.citynamear == null || this.citynameen == null) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._cityobj = new City();
    this._cityobj.cityId = this.cityid;
    this._cityobj.nameAr = this.citynamear;
    this._cityobj.nameEn = this.citynameen;
    this._EmpService.SaveCity(this._cityobj).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.FillCitySelect();
        this.GetAllCities();
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }
  DeleteCity() {
    this._EmpService.DeleteCity(this.cityiddelete).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.FillCitySelect();
        this.GetAllCities();
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  ///////////////////////////////////VacationType crud operations ////////////////////////////////////////////
  GetAllVacationsTypes() {
    this._EmpService.GetAllVacationsTypes().subscribe((data) => {
      this.vacationtypelist = data.result;
    });
  }
  editvactiontype(data: any) {
    this.vacationtypenamear = data.nameAr;
    this.vacationtypenameen = data.nameEn;
    this.vacationtypeid = data.vacationTypeId;
    this.vacationtypenote = data.notes;
  }
  SaveVacationType() {
    if (this.vacationtypenamear == null || this.vacationtypenameen == null) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._vacationtypeobj = new VacationType();
    this._vacationtypeobj.vacationTypeId = this.vacationtypeid;
    this._vacationtypeobj.nameAr = this.vacationtypenamear;
    this._vacationtypeobj.nameEn = this.vacationtypenameen;
    this._vacationtypeobj.notes = this.vacationtypenote;
    this._EmpService
      .SaveVacationType(this._vacationtypeobj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.FillVacationTypeSelect();
          this.GetAllVacationsTypes();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  DeleteVacationType() {
    this._EmpService
      .DeleteVacationType(this.vacationtypeiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.FillVacationTypeSelect();
          this.GetAllVacationsTypes();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  /////////////////////////////////////////vacation crude operations///////////////////////////////////////////////////////////
  GetAllVacations() {
    this._EmpService.GetAllVacations(this.employeeid, '').subscribe((data) => {
      this.vacationlist = data.result;
      console.log(data);
    });
  }
  SaveVacation2() {
    if (
      this.vacationDetails.discound == false &&
      this.vacationDetails.vacationbalance == 0
    ) {
      this.toast.error('يرجي اختيار خصم من الراتب ', 'رسالة');
      return;
    }

    if (
      this.employeeid == null ||
      this.vacationDetails.vacationType == null ||
      this.vacationDetails.from == null ||
      this.vacationDetails.to == null ||
      this.vacationDetails.vacationReason == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    this._vacationobj = new Vacation();
    this._vacationobj.employeeId = this.employeeid;
    this._vacationobj.vacationId = this.vacationid;
    this._vacationobj.vacationTypeId = this.vacationDetails.vacationType;
    this._vacationobj.startDate = this._sharedService.date_TO_String(
      this.vacationDetails.from
    );
    this._vacationobj.endDate = this._sharedService.date_TO_String(
      this.vacationDetails.to
    );
    this._vacationobj.vacationReason = this.vacationDetails.vacationReason;
    this._vacationobj.vacationStatus = 1;
    this._vacationobj.isDiscount = this.vacationDetails.discound;

    if (this.vacationDetails.discound == true) {
      this._vacationobj.discountAmount = this.vacationDetails.discountamount;
    }

    this._staffholidayservice
      .SaveVacation2(this._vacationobj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllVacations();
          this.refreshvacation();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }
  editvacation(data: any) {
    this.vacationid = data.vacationId;
    this.employeeid = data.employeeId;
    this.vacationDetails.vacationType = data.vacationTypeId;
    this.vacationDetails.vacationReason = data.vacationReason;
    this.vacationDetails.discound = data.isDiscount;
    this.vacationDetails.discountamount = data.discountAmount;
    this.vacationDetails.from = new Date(data.startDate);
    this.vacationDetails.to = new Date(data.endDate);
  }
  DeleteVacation() {
    this._staffholidayservice
      .DeleteVacation(this.vacationiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllVacations();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  refreshvacation() {
    this.vacationid = 0;
    this.vacationDetails.vacationType = null;
    this.vacationDetails.vacationReason = null;
    this.vacationDetails.discound = null;
    this.vacationDetails.discountamount = null;
    this.vacationDetails.from = null;
    this.vacationDetails.to = null;
  }
  //////////////////////////////////////////////////////Discount Reward Crud Operations////////////////////////////////////////////////////////////////
  GetAllDiscountRewards() {
    this._EmpService
      .GetAllDiscountRewards(this.employeeid, '')
      .subscribe((data) => {
        this.discountrewardlist = data.result;
        console.log(data);
      });
  }

  editreward(data: any) {
    this.discountRewardobj.employeeid = data.employeeId;
    this.discountRewardobj.discountRewardId = data.discountRewardId;
    this.discountRewardobj.monthnm = data.monthNo;
    this.discountRewardobj.amount = data.amount;
    this.discountRewardobj.status = data.type;
    this.discountRewardobj.notes = data.notes;
  }

  Savediscountreward() {
    if (
      this.discountRewardobj.monthnm == null ||
      this.discountRewardobj.amount == null ||
      this.discountRewardobj.status == null ||
      this.discountRewardobj.notes == null ||
      this.discountRewardobj.monthnm == '' ||
      this.discountRewardobj.amount == '' ||
      this.discountRewardobj.status == '' ||
      this.discountRewardobj.notes == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.discountRewardobj);

    this._discountrewardobj = new DiscountReward();
    this._discountrewardobj.employeeId = this.employeeid;
    this._discountrewardobj.discountRewardId =
      this.discountRewardobj.discountRewardId;
    this._discountrewardobj.monthNo = this.discountRewardobj.monthnm;
    this._discountrewardobj.amount = this.discountRewardobj.amount;
    this._discountrewardobj.type = this.discountRewardobj.status;
    this._discountrewardobj.notes = this.discountRewardobj.notes;

    this._EmpService
      .SaveDiscountReward(this._discountrewardobj)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllDiscountRewards();
          this.refreshdiscountreward();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  DeleteDiscountReward() {
    this._EmpService
      .DeleteDiscountReward(this.discountrewardiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllDiscountRewards();
          this.refreshdiscountreward();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  refreshdiscountreward() {
    this.discountRewardobj.discountRewardId = 0;
    this.discountRewardobj.monthnm = '';
    this.discountRewardobj.amount = '';
    this.discountRewardobj.status = '';
    this.discountRewardobj.notes = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////Allownce Type Crud Operations////////////////////////////////////////////////////////////////
  GetAllAllowncetype() {
    this._EmpService.GetAllAllowancesTypes('').subscribe((data) => {
      this.allowncetypelist = data.result;
      console.log(data);
    });
  }

  editallowncetype(data: any) {
    this.AllownceTypeobj.allowanceTypeId = data.allowanceTypeId;
    this.AllownceTypeobj.nameAr = data.nameAr;
    this.AllownceTypeobj.nameEn = data.nameEn;
    this.AllownceTypeobj.notes = data.notes;
  }

  SaveAllownceType() {
    if (
      this.AllownceTypeobj.nameAr == null ||
      this.AllownceTypeobj.nameEn == null ||
      this.AllownceTypeobj.notes == null ||
      this.AllownceTypeobj.nameAr == '' ||
      this.AllownceTypeobj.nameEn == '' ||
      this.AllownceTypeobj.notes == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.AllownceTypeobj);

    this._allowncetype = new AllowanceType();
    this._allowncetype.allowanceTypeId = this.AllownceTypeobj.allowanceTypeId;
    this._allowncetype.nameAr = this.AllownceTypeobj.nameAr;
    this._allowncetype.nameEn = this.AllownceTypeobj.nameEn;
    this._allowncetype.notes = this.AllownceTypeobj.notes;

    this._EmpService
      .SaveAllowanceType(this._allowncetype)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllAllowncetype();
          this.FillAllowanceTypeSelect();
          this.refreshallowncetype();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  DeleteAllownceTyp() {
    this._EmpService
      .DeleteAllowanceType(this.allowncetypeiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllAllowncetype();
          this.FillAllowanceTypeSelect();

          this.refreshallowncetype();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  refreshallowncetype() {
    this.AllownceTypeobj.allowanceTypeId = 0;
    this.AllownceTypeobj.nameAr = '';
    this.AllownceTypeobj.nameEn = '';
    this.AllownceTypeobj.notes = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////Allownce  Crud Operations////////////////////////////////////////////////////////////////
  GetAllAllownce() {
    this._EmpService.GetAllAllowances(this.employeeid, '').subscribe((data) => {
      this.allowncelist = data.result;
      console.log(data);
    });
  }

  editallownce(data: any) {
    this.Allownceobj.allowanceId = data.allowanceId;
    this.Allownceobj.allowanceTypeId = data.allowanceTypeId;
    this.Allownceobj.amount = data.amount;
    this.Allownceobj.monthNo = data.monthNo;
  }

  SaveAllownce() {
    if (
      this.Allownceobj.allowanceTypeId == null ||
      this.Allownceobj.amount == null ||
      this.Allownceobj.monthNo == null ||
      this.Allownceobj.allowanceTypeId == '' ||
      this.Allownceobj.amount == '' ||
      this.Allownceobj.monthNo == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.Allownceobj);

    this._allownce = new Allowance();
    this._allownce.allowanceId = this.Allownceobj.allowanceId ?? 0;
    this._allownce.employeeId = this.employeeid;
    this._allownce.allowanceTypeId = this.Allownceobj.allowanceTypeId;
    this._allownce.allowanceAmount = this.Allownceobj.amount;
    this._allownce.allowanceMonthNo = this.Allownceobj.monthNo;

    this._EmpService.SaveAllowance(this._allownce).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.GetAllAllownce();
        this.refreshallownce();

        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  DeleteAllownce() {
    this._EmpService
      .DeleteAllowance(this.allownceiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllAllownce();
          this.refreshallownce();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        } else {
          this.toast.error(result.reasonPhrase, 'رسالة');
        }
      });
  }

  refreshallownce() {
    this.Allownceobj.allowanceId = 0;
    this.Allownceobj.allowanceTypeId = '';
    this.Allownceobj.amount = '';
    this.Allownceobj.monthNo = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////loans  Crud Operations////////////////////////////////////////////////////////////////
  LoanDetails: any;
  GetAllLoans() {
    this._EmpService.GetAllLoansE(this.employeeid, '').subscribe((data) => {
      this.loanlist = data.result;
      console.log(data);
    });
  }

  GetAllLoanDetails(loan: any) {
    debugger;
    this.LoanDetails = null;
    console.log('loan', loan);
    this._EmpService.GetAllLoanDetails(loan.loanId).subscribe((data) => {
      this.LoanDetails = data.result;
      console.log('loan details', this.LoanDetails);
    });
  }

  editloan(data: any) {
    this.loanobj.loanId = data.loanId;
    this.loanobj.date = new Date(data.date);
    this.loanobj.amount = data.amount;
    this.loanobj.monthNo = data.monthNo;
    this.loanobj.startMonth = data.startMonth;
  }

  SaveLoans() {
    if (
      this.loanobj.date == null ||
      this.loanobj.amount == null ||
      this.loanobj.monthNo == null ||
      this.loanobj.startMonth == null ||
      this.loanobj.date == '' ||
      this.loanobj.amount == '' ||
      this.loanobj.monthNo == '' ||
      this.loanobj.startMonth == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.loanobj);

    this._loan = new Loan();
    this._loan.loanId = this.loanobj.loanId ?? 0;
    this._loan.employeeId = this.employeeid;
    this._loan.date = this.loanobj.date;
    this._loan.amount = this.loanobj.amount;
    this._loan.monthNo = this.loanobj.monthNo;
    this._loan.startMonth = this.loanobj.startMonth;
    this._loan.note = this.loanobj.notes;
    this._loan.status = 1;

    this._EmpService.SaveLoan2(this._loan).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.GetAllLoans();
        this.refreshloan();

        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
      } else {
        this.toast.error(result.reasonPhrase, 'رسالة');
      }
    });
  }

  DeleteLoan() {
    this._EmpService.DeleteLoan(this.loaniddelete).subscribe((result: any) => {
      console.log(result);
      console.log('result');

      if (result.statusCode == 200) {
        this.GetAllLoans();
        this.refreshloan();

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

  refreshloan() {
    this.loanobj.loanId = 0;
    this.loanobj.date = '';
    this.loanobj.amount = '';
    this.loanobj.monthNo = '';
    this.loanobj.startMonth = '';
    this.loanobj.notes = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  GenerateNextEmpNumber() {
    this._EmpService.GenerateNextEmpNumber().subscribe((data) => {
      debugger;
      this.modalDetails.employeeNo = data.result;
      console.log(data);
    });
  }

  CheckifCodeIsExist() {
    debugger;
    const timeoutDuration = 3000;

    setTimeout(() => {
      // Code to be executed after the timeout

      this._EmpService
        .CheckifCodeIsExist(this.modalDetails.employeeNo)
        .subscribe((result: any) => {
          console.log(result);
          console.log('result');
          debugger;
          if (result.statusCode == 200) {
          } else {
            this.modalDetails.employeeNo = '';

            this.toast.error(result.reasonPhrase, 'رسالة');
          }
        });
    }, timeoutDuration);
  }

  print(id: any) {
    //const printContents = document.getElementById(divName).innerHTML;
    const printContents: any = window.document.getElementById(id)!.innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  ngOnInit(): void {
    // this.modalDetails.nationalIdEndHijriDate={year:1445,month:4,day:20}//new Date('12/3/1445');
    this.GetEmployeeStatistics();
    this.GetOrganizationData();
    this.Months = [
      { id: 1, Name: 'يناير' },
      { id: 2, Name: 'فبراير' },
      { id: 3, Name: 'مارس' },
      { id: 4, Name: 'إبريل' },
      { id: 5, Name: 'مايو' },
      { id: 6, Name: 'يونية' },
      { id: 7, Name: 'يوليو' },
      { id: 8, Name: 'أغسطس' },
      { id: 9, Name: 'سبتمبر' },
      { id: 10, Name: 'أكتوبر' },
      { id: 11, Name: 'نوفمبر' },
      { id: 12, Name: 'ديسمبر' },
    ];

    this.rewardstatus = [
      { id: 1, Name: 'خصم' },
      { id: 2, Name: 'مكافأة' },
    ];
  }

  applyFilter(event: any) {
    debugger;
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (
        d.employeeNo?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.employeeName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.nationalityName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        //|| (d.salary?.trim().toLowerCase().indexOf(val) !== -1 || !val)
        d.jobName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.email?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.mobile?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.branchName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.nationalId?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.userName?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.data.employeesData = new MatTableDataSource(tempsource);
    this.data.employeesData.paginator = this.paginator;
    this.data.employeesData.sort = this.sort;
  }

  endempworkobj: any = {
    ContractId: null,
    EmpId: null,
    reson: null,
    description: null,
    enddate: null,
  };

  editemp = 0;
  deletequa: any;
  open(content: any, data?: any, type?: any) {
    if (data && type == 'editemployee') {
      this.editemp = 1;
      this.refreshempdata();
      this.loanlist = null;
      this.allowncelist = null;
      this.discountrewardlist = null;
      this.vacationlist = null;
      this.data.employeeAttachment = null;
      this.refreshofficialdocuments();
      this.employeeid = data.employeeId;
      this.empid = data.employeeId;
      this.FillBranchSelect();
      this.FillCitySelect();
      this.FillDepartmentSelectByType();
      this.FillJobSelect();
      this.FillNationalitySelect();
      this.filluserselect();
      this.FillBankSelect();
      this.FillAttendanceTimeSelect();
      this.FillAllowanceTypeSelect();
      this.GetAllNationalities();
      this.GetAllJobs();
      this.GetAllDepartmentbyType();
      this.GetAllCities();
      this.GetAllAttachments();
      this.GetAllVacationsTypes();
      this.FillVacationTypeSelect();
      this.GetAllVacations();
      this.GetAllDiscountRewards();
      this.GetAllAllowncetype();
      this.GetAllAllownce();
      this.GetAllLoans();
      this.setempdatatoedit(data);
      this.FillDirectmanagerSelect();
    }
    if (data && type == 'addemployee') {
      this.editemp = 0;
      this.refreshempdata();
      this.loanlist = null;
      this.allowncelist = null;
      this.discountrewardlist = null;
      this.vacationlist = null;
      this.data.employeeAttachment = null;

      this.refreshofficialdocuments();
      this.employeeid = 0;
      this.empid = '0';
      this.FillBranchSelect();
      this.FillCitySelect();
      this.FillDepartmentSelectByType();
      this.FillJobSelect();
      this.FillNationalitySelect();
      this.filluserselect();
      this.FillBankSelect();
      this.FillAttendanceTimeSelect();
      this.FillAllowanceTypeSelect();
      this.GetAllNationalities();
      this.GetAllJobs();
      this.GetAllDepartmentbyType();
      this.GetAllCities();
      this.GetAllVacationsTypes();
      this.FillVacationTypeSelect();
      this.GetAllAllowncetype();
      this.modalDetails.addusername = '';
      this.modalDetails.photoUrl = null;
      this.modalDetails.adddate = '';
      // this.getuserData(this.userG.userId);
      // this.modalDetails.adddate=this.datePipe.transform(new Date(),"YYYY-MM-dd");
      this.GenerateNextEmpNumber();
      this.FillDirectmanagerSelect();
    }

    if (data && type == 'nationalitydeleted') {
      this.nationalityiddelete = data.nationalityId;
    }

    if (data && type == 'jobdeleted') {
      this.jobiddelete = data.jobId;
    }
    if (data && type == 'departmentdeleted') {
      this.departmentiddelete = data.departmentId;
    }
    if (data && type == 'citydeleted') {
      this.cityiddelete = data.cityId;
    }
    if (data && type == 'deleteattachment') {
      this.attachmentidtodelete = data.attachmentId;
    }
    if (data && type == 'vacationtypedelete') {
      this.vacationtypeiddelete = data.vacationTypeId;
    }
    if (data && type == 'deletevacation') {
      this.vacationiddelete = data.vacationId;
    }
    if (data && type == 'discountreward') {
      this.discountrewardiddelete = data.discountRewardId;
    }
    if (data && type == 'deleteallownceType') {
      this.allowncetypeiddelete = data.allowanceTypeId;
    }

    if (data && type == 'deleteallownce') {
      this.allownceiddelete = data.allowanceId;
    }

    if (data && type == 'deleteloan') {
      this.loaniddelete = data.loanId;
    }
    if (data && type == 'deleteemployee') {
      this.employeeidtodelete = data.employeeId;
    }

    if (data && type == 'deleteemployeequa') {
      this.deletequa = data.employeeId;
    }
    if (data && type == 'endEmployeeService') {
      this.endempworkobj.contractId = data.contractId;
      this.endempworkobj.empId = data.empId;
      this.GetEmpdatatoendwork();
    }

    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        (result) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  // upload img ]
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      // accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      // FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  private subscription?: Subscription;

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }
  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  CheckDate(event: any) {
    if (event != null) {
      var from = this._sharedService.date_TO_String(event[0]);
      var to = this._sharedService.date_TO_String(event[1]);
      //this.RefreshData_ByDate(from,to);
      this.vacationDetails.from = from;
      this.vacationDetails.to = to;
      // this.getallv(1);
    } else {
      this.data.filter.DateFrom_P = '';
      this.data.filter.DateTo_P = '';
      //this.RefreshData();
    }
  }

  Getemployeebyid() {
    this._staffholidayservice
      .GetEmployeeById(this.employeeid)
      .subscribe((data) => {
        if (data.result.dawamId == 0) {
          this.toast.error('يرجي ضبط دوام الموظف', 'رسالة');
        } else {
          this.vacationBalance =
            data.result.vacationEndCount == null
              ? 0
              : data.result.vacationEndCount;
          this.Salary = data.result.salary == null ? 0 : data.result.salary;
        }
      });
  }

  GetNetVacationDays(pVacationBalance: any, from: any, to: any) {
    debugger;
    this._staffholidayservice
      .GetNetVacationDays(
        from,
        to,
        this.employeeid,
        this.vacationDetails.vacationType
      )
      .subscribe((data) => {
        debugger;
        this.vVacationDays = data;
        if (this.vVacationDays > 0) {
          if (this.vVacationDays > pVacationBalance || pVacationBalance == 0) {
            //$('input#IsDiscounttxt').prop('disabled', true);
            //$('input#IsDiscounttxt').prop('checked', true);
            //$('input#IsDiscounttxt').change();
            if (pVacationBalance == 0 || pVacationBalance == null) {
              this.vacationDetails.vacationbalance = 0;
              this.toast.error('المستخدم ليس لديه رصيد إجازات مستحق ', 'رسالة');
            } else {
              this.toast.error(
                'رصيد إجازات الموظف لا تكفي أيام الإجازات المطلوبة وهي  ' +
                  this.vVacationDays +
                  ' و يخصم المتبقي من الإجازة من مرتب الموظف',
                'رسالة'
              );

              this.vacationDetails.discound = false;
            }
            this.vacationDetails.discound = true;
            this.isdiscountchange();
            // this.vacationDetails.discountamount=
          } else {
            this.vacationDetails.discound = false;
            this.vacationDetails.vacationbalance = this.vVacationDays;
            this.vacationDetails.discountamount = '';
          }
        }
      });
  }

  isdiscountchange() {
    debugger;
    this.Getemployeebyid();

    if (this.vacationDetails.discound == true) {
      this.vacationDetails.vacationbalance = null;
      let SalaryDiscount = 0;
      if (this.Salary > 0) {
        if (this.vVacationDays > this.vacationBalance) {
          //حالة الخصم من المرتب إجبارية
          SalaryDiscount =
            (this.vVacationDays - this.vacationBalance) * (this.Salary / 30);
          this.vacationDetails.discountamount = SalaryDiscount.toFixed(2);
          this.VacationIsDiscount = 0;

          if (this.vacationBalance > 0) {
            this.vacationDetails.vacationbalance = this.vacationBalance;
          }
        } else {
          // حالة الخصم إختيارية
          SalaryDiscount = this.vVacationDays * (this.Salary / 30);
          this.vacationDetails.discountamount = SalaryDiscount.toFixed(2);
          this.VacationIsDiscount = 1;
          this.vacationDetails.vacationbalance = null;
        }
      }
    } else {
      this.vacationDetails.discountamount = null;
      this.VacationIsDiscount = 0;
      if (this.vacationBalance == 0 || this.vacationBalance == null) {
        this.vacationDetails.vacationbalance = '0';
      } else {
        this.vacationDetails.vacationbalance = this.vVacationDays;
      }
    }
  }

  Checkfromdate() {
    this.Getemployeebyid();

    // if(this.vacationDetails.from <new Date())
    // {
    //   this.vacationDetails.from='';
    //   this.toast.error('تاريخ البداية اصغر من تاريخ اليوم', 'رسالة');

    // }
    if (this.vacationDetails.to != null && this.vacationDetails.to != '') {
      if (this.vacationDetails.from > this.vacationDetails.to) {
        this.vacationDetails.from = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
  }
  Checktodate() {
    debugger;
    this.Getemployeebyid();
    // if(this.vacationDetails.to < new Date())
    // {
    //   this.vacationDetails.to='';
    //   this.toast.error('تاريخ النهاية اصغر من تاريخ اليوم', 'رسالة');

    // }
    debugger;
    if (this.vacationDetails.from != null && this.vacationDetails.from != '') {
      if (this.vacationDetails.to < this.vacationDetails.from) {
        this.vacationDetails.to = '';
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية', 'رسالة');
      }
    }
    if (this.employeeid == null) {
      this.vacationDetails.to = '';
      this.toast.error('اختر الموظف', 'رسالة');
    }

    if (this.vacationDetails.vacationType == null) {
      this.vacationDetails.to = '';
      this.toast.error('اخترنوع الاجازه', 'رسالة');
    }
    this.GetNetVacationDays(
      this.vacationBalance,
      this._sharedService.date_TO_String(this.vacationDetails.from),
      this._sharedService.date_TO_String(this.vacationDetails.to)
    );
  }
  getmonthname(monthn: any) {
    if (monthn == 1) {
      return 'يناير';
    } else if (monthn == 2) {
      return 'فبراير';
    } else if (monthn == 3) {
      return 'مارس';
    } else if (monthn == 4) {
      return 'ابريل';
    } else if (monthn == 5) {
      return 'مايو';
    } else if (monthn == 6) {
      return 'يونيه';
    } else if (monthn == 7) {
      return 'يوليو';
    } else if (monthn == 8) {
      return 'أغسطس';
    } else if (monthn == 9) {
      return 'سبتمبر';
    } else if (monthn == 10) {
      return 'اكتوبر';
    } else if (monthn == 11) {
      return 'نوفمبر';
    } else if (monthn == 12) {
      return 'ديسمبر';
    } else {
      return '';
    }
  }
  ///////////////////////////////////////////////////
  emleavedetailsobj: any = {
    empName: null,
    empJobNo: null,
    empJob: null,
    empStartWork: null,
    empTotalServe: null,
    empCustoday: null,
    custoday2: null,
    empLoan: null,
    empLateSalary: null,
    empbranch: null,
    empNetSalary: null,
    empEndallowance: null,
    endContractDate: null,
  };

  reasonobj: any = {
    reasonId: 0,
    reasonTxt: null,
    desecionTxt: null,
  };
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  GetEmpdatatoendwork() {
    this._empContract = new EmpContract();
    this._empContract.contractId = this.endempworkobj.contractId;
    this._empContract.empId = this.endempworkobj.empId;
    this._empcontractservice
      .GetEmpdatatoendwork(this._empContract)
      .subscribe((data) => {
        debugger;
        this.emleavedetailsobj = data;
        this.emleavedetailsobj.endContractDate =
          this._sharedService.date_TO_String(data.endContractDate);
        console.log(data);
      });
  }

  EndWorkforAnEmployee() {
    debugger;
    this._empContract = new EmpContract();
    this._empContract.contractId = this.endempworkobj.contractId;
    this._empContract.empId = this.endempworkobj.empId;
    this._empcontractservice
      .EndWorkforAnEmployee(
        this._empContract,
        this.emleavedetailsobj.empTotalServe,
        this.endempworkobj.reson
      )
      .subscribe((data) => {
        debugger;
        this.emleavedetailsobj = data;
        if (data.statusCode == 200) {
          this.toast.success(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
          this.getData();
        } else {
          this.toast.error(this.translate.instant(data.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  //#region Print
  ///////////////////////print///////////////////////////
  GetOrganizationData() {
    this._sharedService.GetOrganizationData().subscribe((data) => {
      this.logourl = environment.PhotoURL + data.logoUrl;
    });
  }
  PrintEmp() {
    this.printDiv('reportemployee');
  }
  printDiv(id: any) {
    this.printing.print(id, environment.printConfig);
  }
  employeemodelprint: any = {
    employeeNameAr: null,
    departmentName: null,
    nationalityName: null,
    jobName: null,
    educationalQualification: null,
    workStartDate: null,
    lastVacation: null,
    vacationEndCount: null,
    bankName: null,
    bankCardNo: null,
    salary: null,

    nationalId: null,
    nationalIdDate: null,
    nationalIdEndDate: null,
    medicalNo: null,
    medicalSource: null,
    medicalStartDate: null,
    medicalEndDate: null,
    passportNo: null,
    passportNoDate: null,
    passportEndDate: null,
    age: null,
  };
  Allownces: any = null;
  SumAllownces: any = null;
  discounts: any = null;
  Loans: any = null;
  Loanvms: any = null;
  TotalVal: any = null;
  MonthlyTotalloan: any = null;
  PaidTotal: any = null;
  remainTotal: any = null;
  Rewards: any = null;
  TotalRewards: any = null;
  VacVMs: any = null;
  Totalvac: any = null;
  excpecTotalDays: any = null;
  actuallTotalDays: any = null;
  Nationalsource: any = null;
  PassportSource: any = null;
  housing: any = null;
  printemployeecard(empid: any) {
    debugger;
    this._EmpService
      .PrintEmployeeIdentityReports(empid.employeeId)
      .subscribe((data) => {
        console.log('employeedata', data);
        this.employeemodelprint = {
          employeeNameAr: data.employee.employeeNameAr,
          departmentName: data.employee.departmentName,
          nationalityName: data.employee.nationalityName,
          jobName: data.employee.jobName,
          educationalQualification: data.employee.educationalQualification,
          workStartDate: data.employee.workStartDate,
          lastVacation: data.lastVacation,
          vacationEndCount: data.employee.vacationEndCount,
          bankName: data.employee.bankName,
          bankCardNo: data.employee.bankCardNo,
          salary: data.employee.salary,

          nationalId: data.employee.nationalId,
          nationalIdDate: data.employee.nationalIdDate,
          nationalIdEndDate: data.employee.nationalIdEndDate,
          medicalNo: data.employee.medicalNo,
          medicalSource: data.employee.medicalSource,
          medicalStartDate: data.employee.medicalStartDate,
          medicalEndDate: data.employee.medicalEndDate,
          passportNo: data.employee.passportNo,
          passportNoDate: data.employee.passportNoDate,
          passportEndDate: data.employee.passportEndDate,
          age: data.employee.age,
        };
        this.Allownces = data.allowances;
        this.housing = data.employee.allowances;

        this.SumAllownces = data.sumAllownces;
        this.discounts = data.discounts;
        this.Loans = data.loans;
        this.Loanvms = data.Loanvms;
        this.TotalVal = data.totalVal;
        this.MonthlyTotalloan = data.monthlyTotalloan;
        this.PaidTotal = data.paidTotal;
        this.remainTotal = data.remainTotal;
        this.Rewards = data.rewards;
        this.TotalRewards = data.totalRewards;
        this.VacVMs = data.vacVMs;
        this.Totalvac = data.totalvac;
        this.excpecTotalDays = data.excpecTotalDays;
        this.actuallTotalDays = data.actuallTotalDays;
        this.Nationalsource = data.nationalsource;
        this.PassportSource = data.passportSource;
        const timeoutDuration = 5000;

        setTimeout(() => {
          // Code to be executed after the timeout
          this.printDiv('reportemployeeecard');
        }, timeoutDuration);
      });
  }

  //test testttt
  //#endregion

  DeleteEmployeeContractQua() {
    debugger;
    this._EmpService
      .DeleteEmployeeContractQua(this.deletequa)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        }
      });
  }

  deletedate() {
    this.toast.error('please choose date from calender', 'رسالة');
  }
  CalculateAge() {
    var age = this.calculateAgewithbirthdate(this.modalDetails.birthDate);
    this.modalDetails.age = age;
  }

  CalculateAge2() {
    var age = this.calculateAgewithbirthdate(this.modalDetails.birthDate);
    if (age < 18) {
      debugger;
      this.toast.error('هذا العمر تحت السن القانوني', 'رسالة');
      this.modalDetails.birthDate = '';
      return;
      }else if (age>=70){
       //debugger;
      this.toast.error('هذا العمر فوق السن القانوني', 'رسالة');
      this.modalDetails.birthDate = '';
      return;
    }
    this.modalDetails.age = age;
  }

  calculateAgewithbirthdate(birthdate: Date): number {
    debugger;
    const today = new Date();
    const birthDate = new Date(birthdate);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the current month is before the birth month or
    // if it's the same month but the current day is before the birth day,
    // then decrement the age by 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  clearson() {
    if (this.modalDetails.maritalStatus == 1) {
      this.modalDetails.childrenNo = '';
    }
  }
}
