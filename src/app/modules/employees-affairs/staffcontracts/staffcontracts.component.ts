import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { event, valHooks } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Allowance } from 'src/app/core/Classes/DomainObjects/allowance';
import { EmpContract } from 'src/app/core/Classes/DomainObjects/empContract';
import { ReasonLeave } from 'src/app/core/Classes/DomainObjects/reasonLeave';
import { EndWorkPrintVM } from 'src/app/core/Classes/ViewModels/EndWorkPrintVM';
import { EmpContractVM } from 'src/app/core/Classes/ViewModels/empContractVM';
import { EmpSalaryPartsVM } from 'src/app/core/Classes/ViewModels/empSalaryPartsVM';
import { EmpContractService } from 'src/app/core/services/Employees-Services/emp-contract.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { environment } from 'src/environments/environment';
interface Item {
  id: number;
  name: string;
}
@Component({
  selector: 'app-staffcontracts',
  templateUrl: './staffcontracts.component.html',
  styleUrls: ['./staffcontracts.component.scss'],
  providers: [DatePipe],
})
export class StaffcontractsComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;

  rows = [
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
  ];
  temp: any = [
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
    { id: 1, reason: 'اسم النشاط1', Resolutiontext: 'test test' },
  ];

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
      ar: 'عقود الموظفين',
      en: 'employee contracts',
    },
  };

  selectedUser: any;
  users: any;

  closeResult = '';

  displayedColumns: string[] = [
    'contractNo',
    'employeeNo',
    'employeName',
    'nationality',
    'branch',
    'startDate',
    'endDate',
    'liveDate',
    'operations',
  ];

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalDetails: any = {
    id: null,
    contractNo: null,
    officeName: null,
    officeUser: null,
    userJob: null,
    employeeName: null,
    employeeJob: null,
    contractType: null,
    duration: null,
    from: null,
    to: null,
    testDays: null,
    hoursInWeek: null,
    hoursInDay: null,
    daysInWeek: null,
    holidays: null,
    salaryType: null,
    basicSalary: null,
    housingAllowance: null,
    dailySalary: null,
    contractBands: null,
    limitCompetition: null,
    nonDisclosureSecrets: null,
    locating: null,
    regardingWork: null,
    noticeContractTermination: null,
    contractCompensation: null,
    compensation: null,
    firstCompensation: null,
    secondCompensation: null,
  };
  salarypart: any = {
    allowanceId: 0,
    allowanceTypeId: null,
    allowanceAmount: null,
    employeeId: 0,
  };
  endcontractdetails: any = {
    empname: null,
    empnumber: null,
    empjob: null,
    sempdate: null,
    empduration: null,
    empcustody: null,
    empcustody2: null,
    emploan: null,
    emplatesalary: null,
    empbranch: null,

    empNetsalary: null,

    EmpEndallowance: null,
    EmpEndcontract: null,
  };

  contracts: any;

  contractType: any;
  testDuration: any;
  contractid = 0;
  contracidtodelete: any;
  editstartwork: any;

  officeEmployeeInfo = this._formBuilder.group({
    contractCode: ['', [Validators.required]],
    officeName: ['', [Validators.required]],
    companyRepresentativeId: [0, [Validators.required]],
    perSe: ['', [Validators.required]],
    empId: [0, [Validators.required]],
    perse2: ['', [Validators.required]],
    orgId: [0],
  });

  contractSubject = this._formBuilder.group({
    contTypeId: [0, [Validators.required]],
    contDuration: [0],
    startDatetxt: new FormControl(),
    endDatetxt: new FormControl(),
    probationDuration: [0],
    probationTypeId: [0],
  });

  workDaysHours = this._formBuilder.group({
    workinghoursperweek: [0, [Validators.required]],
    dailyworkinghours: [0, [Validators.required]],
    workingdaysperweek: [0, [Validators.required]],
  });

  firstObligations = this._formBuilder.group({
    durationofannualleave: [0],
    paycase: [0],
    freelanceAmount: [0, [Validators.required]],
    allowanceAmount: [0, [Validators.required]],
    dailyEmpCost: [0, [Validators.required]],
    empContractDetails: [''],
  });

  bands: any = [];

  compatationValue: any;
  nonDisclosureSecretsValue: any;
  secondObligations = this._formBuilder.group({
    restrictedmode: [0],
    restrictionDuration: [0],
    identifyplaces: [''],
    withregardtowork: [''],
    notTodivulgeSecrets: [0],
    notTodivulgeSecretsDuration: [0],
    secretsIdentifyplaces: [''],
    secretsWithregardtowork: [''],
  });

  terminateContract = this._formBuilder.group({
    contractTerminationNotice: [0],
    compensation: [0],
    compensationBothParty: [0],
    firstpartycompensation: [0],
    secondpartycompensation: [0],
  });

  isEditableStepper = true;

  comationType: any;
  terminateValues = [
    { title: { ar: '٣٠ يوم', en: '30 days' }, value: '30' },
    { title: { ar: '٦٠ يوم', en: '60 days' }, value: '60' },
    { title: { ar: '٩٠ يوم', en: '90 days' }, value: '90' },
    { title: { ar: '١٢٠ يوم', en: '120 days' }, value: '120' },
  ];
  SearchDetails: any = {
    employeeId: null,
    branchId: null,
    isSearch: false,
  };
  public _empContractVM: EmpContractVM;
  employeeselectlist: any;
  employeeselectlist2: any;

  employeeselectlistarr: Item[];
  employeeselectlistarr2: Item[];

  Repemployeeselectlist: any;
  branchselectlist: any;
  orgdata: any;
  public _empContract: EmpContract;

  /////////////////////////////////////////////
  //Allownce Type

  reasonobj: any = {
    reasonId: 0,
    reasonTxt: null,
    desecionTxt: null,
  };

  public _reasonleave: ReasonLeave;
  reasonleaveiddelete: any;
  reasonleaveselect: any;
  reasonleavelist: any;
  searchtext: '';
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
  endempworkobj: any = {
    ContractId: null,
    EmpId: null,
    reson: null,
    description: null,
    enddate: null,
  };

  //////////////////////////////////////////////////
  userG: any = {};
  constructor(
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _empcontractservice: EmpContractService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private authenticationService: AuthenticationService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this._empContractVM = new EmpContractVM();
    this._empContract = new EmpContract();
    this.userG = this.authenticationService.userGlobalObj;
  }

  //////////////////////////////////////////////////////Allownce Type Crud Operations////////////////////////////////////////////////////////////////
  GetAllreasons() {
    this._empcontractservice
      .GetAllreasons(this.searchtext)
      .subscribe((data) => {
        this.reasonleavelist = data.result;
        console.log(data);
      });
  }

  editreasontext(data: any) {
    this.reasonobj.reasonId = data.reasonId;
    this.reasonobj.reasonTxt = data.reasonTxt;
    this.reasonobj.desecionTxt = data.desecionTxt;
  }

  Savereasonleave() {
    if (
      this.reasonobj.reasonTxt == null ||
      this.reasonobj.desecionTxt == null ||
      this.reasonobj.reasonTxt == '' ||
      this.reasonobj.desecionTxt == ''
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }

    console.log(this.reasonobj);

    this._reasonleave = new ReasonLeave();
    this._reasonleave.reasonId = this.reasonobj.reasonId;
    this._reasonleave.reasonTxt = this.reasonobj.reasonTxt;
    this._reasonleave.desecionTxt = this.reasonobj.desecionTxt;

    this._empcontractservice
      .SaveReason(this._reasonleave)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllreasons();
          this.refreshallreasons();

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

  Deletereasonleave() {
    this._empcontractservice
      .DeleteReason(this.reasonleaveiddelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.GetAllreasons();
          this.refreshallreasons();

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

  refreshallreasons() {
    this.reasonobj.reasonId = 0;
    this.reasonobj.reasonTxt = '';
    this.reasonobj.desecionTxt = '';
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  FillReasonSelect() {
    this._empcontractservice.FillReasonSelect().subscribe((data) => {
      this.reasonleaveselect = data.result;
    });
  }

  filluserselect() {
    this._empcontractservice.FillSelectEmployee3().subscribe((data) => {
      this.Repemployeeselectlist = data;
    });
  }

  filluserselect2() {
    this._empcontractservice.FillSelectEmployee().subscribe((data) => {
      this.employeeselectlist2 = data;
    });
  }
  FillSelectEmployee2() {
    this._empcontractservice.FillSelectEmployee2().subscribe((data) => {
      this.employeeselectlistarr = data;
    });
  }

  FillSelectEmployee3() {
    debugger;
    this._empcontractservice.FillSelectEmployee3().subscribe((data) => {
      debugger;
      this.employeeselectlistarr = data;
    });
  }

  FillSelectEmployee_edit() {
    debugger;
    this._empcontractservice.FillSelectEmployee3().subscribe((data) => {
      debugger;
      this.employeeselectlistarr2 = data;
    });
  }

  GetEmployeeJobName(EmpId: any) {
    debugger;
    this._empcontractservice.GetEmployeeJobName(EmpId).subscribe((data) => {
      debugger;
      console.log(data);
      // assign data to table
      this.officeEmployeeInfo.patchValue({
        perSe: data.jobName,
      });
    });
  }

  GetEmployeeJobName2(EmpId: any) {
    this._empcontractservice.GetEmployeeJobName2(EmpId).subscribe((data) => {
      this.officeEmployeeInfo.patchValue({
        perse2: data.jobName,
      });
    });
  }

  FillBranchSelect() {
    this._empcontractservice.FillBranchSelect().subscribe((data) => {
      this.branchselectlist = data;
    });
  }
  GetBranchOrganization() {
    this._empcontractservice.GetBranchOrganization().subscribe((data) => {
      debugger;
      this.officeEmployeeInfo.patchValue({
        officeName: data.result.nameAr,
      });
    });
  }

  getData() {
    debugger;
    this._empContractVM = new EmpContractVM();
    this._empContractVM.empId = this.SearchDetails.employeeId;
    this._empContractVM.branchId = this.SearchDetails.branchId;
    if (
      this.SearchDetails.employeeId != null ||
      this.SearchDetails.branchId != null
    ) {
      this._empContractVM.isSearch = true;
    } else {
      this._empContractVM.isSearch = false;
    }

    this._empcontractservice
      .GetAllEmpContractSearch(this._empContractVM)
      .subscribe({
        next: (data: any) => {
          // assign data to table
          console.log(data);
          this.contracts = data;
          this.dataSource = new MatTableDataSource(this.contracts);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  GenerateEmpContractNumber() {
    this._empcontractservice.GenerateEmpContractNumber().subscribe((data) => {
      debugger;

      this.officeEmployeeInfo.patchValue({
        contractCode: data.result,
      });
    });
  }

  GetSalaryParts(empid: any) {
    this._empcontractservice.GetSalaryParts(empid).subscribe((data) => {
      debugger;

      this.salarypart.allowanceAmount = data.housingAllowance.allowanceAmount;
      this.salarypart.allowanceId = data.housingAllowance.allowanceId;
      this.salarypart.allowanceTypeId = data.housingAllowance.allowanceTypeId;

      this.firstObligations.patchValue({
        allowanceAmount: data.housingAllowance.allowanceAmount,
      });
    });
  }
  ngOnInit(): void {
    this.filluserselect();
    this.filluserselect2();

    this.FillBranchSelect();
    this.FillReasonSelect();
    this.getData();
    this.GetBranchOrganization();
    this.GetAllreasons();
    this.FillSelectEmployee_edit();
  }

  // fullscreen: type == 'add' || type == 'edit' ? true : false,

  companyRepresentativeChange() {
    debugger;
    this.FillSelectEmployee3();
    //  this.employeeselectlistarr=this.employeeselectlist;
    const index = this.employeeselectlistarr.findIndex(
      (itemm) =>
        itemm.id == this.officeEmployeeInfo.value.companyRepresentativeId
    );

    // const index: number = this.employeeselectlist.indexOf(this.officeEmployeeInfo.value.companyRepresentativeId);
    this.employeeselectlistarr.splice(index, 1);
    this.employeeselectlist = this.employeeselectlistarr;
    this.GetEmployeeJobName(
      this.officeEmployeeInfo.value.companyRepresentativeId
    );
    // this.employeeselectlist.remove(this.officeEmployeeInfo.value.companyRepresentativeId);
  }
  employeechange() {
    this.GetEmployeeJobName2(this.officeEmployeeInfo.value.empId);
    this.employeeselectlist = this.employeeselectlistarr;
  }

  open(content: any, data?: any, type?: any, index?: any) {
    if (data && type == 'editcontract') {
      debugger;
      console.log('rowdata');
      console.log(data);
      this.contractid = data.contractId;

      this.employeeselectlist = this.employeeselectlistarr2;
      this.officeEmployeeInfo.patchValue(data);
      var stdt = this.getformateddate(data.startDatetxt);
      var endt = this.getformateddate(data.endDatetxt);

      this.contractSubject.patchValue(data);

      this.contractType = data.contTypeId;
      this.comationType = data.compensation;
      this.workDaysHours.patchValue(data);
      this.firstObligations.patchValue(data);
      // this.bands.patchValue(data);
      this.secondObligations.patchValue(data);
      this.terminateContract.patchValue(data);
      this.GetEmployeeJobName2(data.empId);
      this.GetSalaryParts(data.empId);
      // this.contractSubject.patchValue({
      //   startDatetxt :   ,
      // });
      // this.firstObligations.patchValue({
      //   paycase: data.paycase.toString(),
      // });
      this.modalDetails = data;

      this.contractSubject.patchValue({
        startDatetxt: '',
      });
      this.contractSubject.patchValue({
        endDatetxt: '',
      });
      this.contractSubject.patchValue({
        startDatetxt: stdt,
      });
      this.contractSubject.patchValue({
        endDatetxt: endt,
      });
      this.modalDetails['id'] = '1';
    }
    if (type == 'addnewcontract') {
      this.FillSelectEmployee2();
      this.employeeselectlist = this.employeeselectlistarr;
      this.GenerateEmpContractNumber();
    }
    if (type == 'deletecontract') {
      debugger;
      this.contracidtodelete = data.contractId;
    }
    if (type == 'editstartwork') {
      this.editstartwork = data;
    }
    if (data && type == 'deletereason') {
      this.reasonleaveiddelete = data.reasonId;
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

  checkdate(evet: any, type: any) {
    debugger;
    // this._empContract.startDatetxt = this.contractSubject.value.startDatetxt??null;
    // this._empContract.endDatetxt = this.contractSubject.value.endDatetxt??null;

    if (type == 1) {
      let stdate = evet;
      let endate = this.contractSubject.value.endDatetxt;

      this.contractSubject.patchValue({
        contDuration: 0,
      });

      if (endate != '' && endate != null && endate <= stdate) {
        this.contractSubject.patchValue({
          contDuration: 0,
        });
        this.contractSubject.patchValue({
          startDatetxt: '',
        });
        this.contractSubject.patchValue({
          endDatetxt: '',
        });
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية');
        return;
      } else if (endate != '' && endate != null) {
        const date1 = stdate;
        const date2 = endate;
        const diffTime = Math.abs(date2 - date1);
        const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24) / 30);
        //console.log(diffTime + " milliseconds");
        // $('#ContDuration').val(diffMonths);
        this.contractSubject.patchValue({
          contDuration: diffMonths,
        });
        console.log(diffMonths + 'Months');
      }
    } else {
      let stdate = this.contractSubject.value.startDatetxt;
      let endate = evet;

      this.contractSubject.patchValue({
        contDuration: 0,
      });

      if (endate != null && endate <= stdate) {
        this.contractSubject.patchValue({
          contDuration: 0,
        });
        this.contractSubject.patchValue({
          startDatetxt: '',
        });
        this.contractSubject.patchValue({
          endDatetxt: '',
        });
        this.toast.error('تاريخ البداية اكبر من تاريخ النهاية');
        return;
      } else if (endate != null) {
        const date1 = this.contractSubject.value.startDatetxt;
        const date2 = endate;
        const diffTime = Math.abs(date2 - date1);
        const diffMonths = Math.round(diffTime / (1000 * 60 * 60 * 24) / 30);
        //console.log(diffTime + " milliseconds");
        // $('#ContDuration').val(diffMonths);
        this.contractSubject.patchValue({
          contDuration: diffMonths,
        });
        console.log(diffMonths + 'Months');
      }
    }
  }

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
  onInputChange(event: any) {
    debugger;
    if (
      this.workDaysHours.value.workingdaysperweek != null &&
      this.workDaysHours.value.dailyworkinghours != null
    ) {
      var weeklyhours =
        this.workDaysHours.value.workingdaysperweek *
        this.workDaysHours.value.dailyworkinghours;
      this.workDaysHours.patchValue({
        workinghoursperweek: weeklyhours,
      });
    }
    this._empContract.dailyworkinghours =
      this.workDaysHours.value.dailyworkinghours ?? 0;

    this._empContract.workinghoursperweek =
      this.workDaysHours.value.workinghoursperweek ?? 0;
  }
  private getDismissReason(reason: any, type?: any): string {
    this.modalDetails = {
      id: null,
      contractNo: null,
      officeName: null,
      officeUser: null,
      userJob: null,
      employeeName: null,
      employeeJob: null,
      contractType: null,
      duration: null,
      from: null,
      to: null,
      testDays: null,
      hoursInWeek: null,
      hoursInDay: null,
      daysInWeek: null,
      holidays: null,
      salaryType: null,
      basicSalary: null,
      housingAllowance: null,
      dailySalary: null,
      contractBands: null,
      limitCompetition: null,
      nonDisclosureSecrets: null,
      locating: null,
      regardingWork: null,
      noticeContractTermination: null,
      contractCompensation: null,
      compensation: null,
      firstCompensation: null,
      secondCompensation: null,
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
  confirm() {}

  GetEmpdatatoendwork() {
    this._empContract = new EmpContract();
    this._empContract.contractId = this.endempworkobj.contractId;
    this._empContract.empId = this.endempworkobj.empId;
    this._empcontractservice
      .GetEmpdatatoendwork(this._empContract)
      .subscribe((data) => {
        debugger;
        this.emleavedetailsobj = data;
        this.emleavedetailsobj.endContractDate = this.datePipe.transform(
          data.endContractDate,
          'YYYY-MM-dd'
        );
        console.log(data);
      });
  }

  EndWorkforAnEmployee() {
    debugger;
    this._empContract = new EmpContract();
    this._empContract.contractId = this.endempworkobj.contractId;
    this._empContract.empId = this.endempworkobj.empId;
    if (
      this.emleavedetailsobj.empTotalServe == null ||
      this.emleavedetailsobj.empTotalServe == '' ||
      this.endempworkobj.reson == null ||
      this.endempworkobj.reson == ''
    ) {
      this.toast.error('من فضلك اكمل البيانات', 'رسالة');
      return;
    }
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
          this.toast.success(data.reasonPhrase, 'رسالة');
          this.getData();
        } else {
          this.toast.error(data.reasonPhrase, 'رسالة');
        }
      });
  }
  EditContract() {
    debugger;
    // console.log(
    //   this.officeEmployeeInfo,
    //   this.contractSubject,
    //   this.workDaysHours,
    //   this.firstObligations,
    //   this.bands,
    //   this.secondObligations,
    //   this.terminateContract
    // );

    this._empContract = new EmpContract();
    this._empContract.contractId = this.contractid;
    this._empContract.contractCode =
      this.officeEmployeeInfo.value.contractCode ?? null;

    this._empContract.orgId = this.officeEmployeeInfo.value.orgId ?? 0;
    this._empContract.companyRepresentativeId =
      this.officeEmployeeInfo.value.companyRepresentativeId ?? 0;
    this._empContract.perSe = this.officeEmployeeInfo.value.perSe ?? null;
    this._empContract.empId = this.officeEmployeeInfo.value.empId ?? 0;
    //=====
    this._empContract.contTypeId =
      this.contractSubject.value.contTypeId ?? null;
    this._empContract.contDuration =
      this.contractSubject.value.contDuration ?? null;

    if (
      this.contractSubject.value.startDatetxt != null &&
      this.contractSubject.value.startDatetxt != ''
    ) {
      this._empContract.startDatetxt =
        this.datePipe.transform(
          this.contractSubject.value.startDatetxt,
          'YYYY-MM-dd'
        ) ?? null;
    }
    if (
      this.contractSubject.value.endDatetxt != null &&
      this.contractSubject.value.endDatetxt != ''
    ) {
      this._empContract.endDatetxt =
        this.datePipe.transform(
          this.contractSubject.value.endDatetxt,
          'YYYY-MM-dd'
        ) ?? null;
    }
    this._empContract.probationTypeId =
      this.contractSubject.value.probationTypeId ?? 0;
    this._empContract.probationDuration =
      this.contractSubject.value.probationDuration ?? 0;

    this._empContract.workingdaysperweek =
      this.workDaysHours.value.workingdaysperweek ?? 0;
    this._empContract.dailyworkinghours =
      this.workDaysHours.value.dailyworkinghours ?? 0;
    this._empContract.workinghoursperweek =
      this.workDaysHours.value.workinghoursperweek ?? 0;

    this._empContract.durationofannualleave =
      this.firstObligations.value.durationofannualleave ?? 0;
    this._empContract.freelanceAmount =
      this.firstObligations.value.freelanceAmount ?? null;
    this._empContract.paycase = this.firstObligations.value.paycase ?? 0;

    this._empContract.restrictedmode =
      this.secondObligations.value.restrictedmode ?? 0;
    this._empContract.notTodivulgeSecrets =
      this.secondObligations.value.notTodivulgeSecrets ?? 0;
    this._empContract.restrictionDuration =
      this.secondObligations.value.restrictionDuration ?? 0;
    this._empContract.identifyplaces =
      this.secondObligations.value.identifyplaces ?? null;
    this._empContract.withregardtowork =
      this.secondObligations.value.withregardtowork ?? null;
    this._empContract.notTodivulgeSecretsDuration =
      this.secondObligations.value.notTodivulgeSecretsDuration ?? 0;
    this._empContract.secretsIdentifyplaces =
      this.secondObligations.value.secretsIdentifyplaces ?? null;
    this._empContract.secretsWithregardtowork =
      this.secondObligations.value.secretsWithregardtowork ?? null;

    this._empContract.contractTerminationNotice =
      this.terminateContract.value.contractTerminationNotice ?? 0;
    this._empContract.compensation =
      this.terminateContract.value.compensation ?? 0;
    this._empContract.compensationBothParty =
      this.terminateContract.value.compensationBothParty ?? 0;
    this._empContract.firstpartycompensation =
      this.terminateContract.value.firstpartycompensation ?? 0;

    this._empContract.secondpartycompensation =
      this.terminateContract.value.secondpartycompensation ?? 0;
    this._empContract.dailyEmpCost =
      this.firstObligations.value.dailyEmpCost ?? 0;
    this._empContract.empContractDetails = this.bands;
    this.salarypart.allowanceAmount =
      this.firstObligations.value.allowanceAmount;
    this.salarypart.employeeId = this.officeEmployeeInfo.value.empId ?? 0;
    //VoucherObj.Date = $('#SecondParty_EmpNameSelectId').val();;
    //VoucherObj.HijriDate = $('#SecondParty_EmpNameSelectId').val();;
    console.log(this._empContract);

    this._empcontractservice
      .SaveEmpContract(this._empContract)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.savesalarypart();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  AddContract() {
    debugger;
    // console.log(
    //   this.officeEmployeeInfo,
    //   this.contractSubject,
    //   this.workDaysHours,
    //   this.firstObligations,
    //   this.bands,
    //   this.secondObligations,
    //   this.terminateContract
    // );

    this._empContract = new EmpContract();
    this._empContract.contractId = this.contractid;
    this._empContract.contractCode =
      this.officeEmployeeInfo.value.contractCode?.toString() ?? null;

    this._empContract.orgId = this.officeEmployeeInfo.value.orgId ?? 0;
    this._empContract.companyRepresentativeId =
      this.officeEmployeeInfo.value.companyRepresentativeId ?? 0;
    this._empContract.perSe = this.officeEmployeeInfo.value.perSe ?? null;
    this._empContract.empId = this.officeEmployeeInfo.value.empId ?? 0;
    //=====
    this._empContract.contTypeId =
      this.contractSubject.value.contTypeId ?? null;
    this._empContract.contDuration =
      this.contractSubject.value.contDuration ?? null;

    if (
      this.contractSubject.value.startDatetxt != null &&
      this.contractSubject.value.startDatetxt != ''
    ) {
      this._empContract.startDatetxt =
        this.datePipe.transform(
          this.contractSubject.value.startDatetxt,
          'YYYY-MM-dd'
        ) ?? null;
    }
    if (
      this.contractSubject.value.endDatetxt != null &&
      this.contractSubject.value.endDatetxt != ''
    ) {
      this._empContract.endDatetxt =
        this.datePipe.transform(
          this.contractSubject.value.endDatetxt,
          'YYYY-MM-dd'
        ) ?? null;
    }
    this._empContract.probationTypeId =
      this.contractSubject.value.probationTypeId ?? 0;
    this._empContract.probationDuration =
      this.contractSubject.value.probationDuration ?? 0;

    this._empContract.workingdaysperweek =
      this.workDaysHours.value.workingdaysperweek ?? 0;
    this._empContract.dailyworkinghours =
      this.workDaysHours.value.dailyworkinghours ?? 0;
    this._empContract.workinghoursperweek =
      this.workDaysHours.value.workinghoursperweek ?? 0;

    this._empContract.durationofannualleave =
      this.firstObligations.value.durationofannualleave ?? 0;
    this._empContract.freelanceAmount =
      this.firstObligations.value.freelanceAmount ?? null;
    this._empContract.paycase = this.firstObligations.value.paycase ?? 0;

    this._empContract.restrictedmode =
      this.secondObligations.value.restrictedmode ?? 0;
    this._empContract.notTodivulgeSecrets =
      this.secondObligations.value.notTodivulgeSecrets ?? 0;
    this._empContract.restrictionDuration =
      this.secondObligations.value.restrictionDuration ?? 0;
    this._empContract.identifyplaces =
      this.secondObligations.value.identifyplaces ?? null;
    this._empContract.withregardtowork =
      this.secondObligations.value.withregardtowork ?? null;
    this._empContract.notTodivulgeSecretsDuration =
      this.secondObligations.value.notTodivulgeSecretsDuration ?? 0;
    this._empContract.secretsIdentifyplaces =
      this.secondObligations.value.secretsIdentifyplaces ?? null;
    this._empContract.secretsWithregardtowork =
      this.secondObligations.value.secretsWithregardtowork ?? null;

    this._empContract.contractTerminationNotice =
      this.terminateContract.value.contractTerminationNotice ?? 0;
    this._empContract.compensation =
      this.terminateContract.value.compensation ?? 0;
    this._empContract.compensationBothParty =
      this.terminateContract.value.compensationBothParty ?? 0;
    this._empContract.firstpartycompensation =
      this.terminateContract.value.firstpartycompensation ?? 0;

    this._empContract.secondpartycompensation =
      this.terminateContract.value.secondpartycompensation ?? 0;
    this._empContract.dailyEmpCost =
      this.firstObligations.value.dailyEmpCost ?? 0;
    this._empContract.empContractDetails = this.bands;
    this.salarypart.allowanceAmount =
      this.firstObligations.value.allowanceAmount;
    this.salarypart.employeeId = this.officeEmployeeInfo.value.empId ?? 0;
    //VoucherObj.Date = $('#SecondParty_EmpNameSelectId').val();;
    //VoucherObj.HijriDate = $('#SecondParty_EmpNameSelectId').val();;
    console.log(this._empContract);

    this._empcontractservice
      .SaveEmpContract(this._empContract)
      .subscribe((result) => {
        debugger;
        if (result.statusCode == 200) {
          this.savesalarypart();
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );

          this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  savesalarypart() {
    var _empSalaryPart = new EmpSalaryPartsVM();
    var _allownce = new Allowance();
    _allownce.allowanceId = this.salarypart.allowanceId;
    _allownce.allowanceTypeId = this.salarypart.allowanceTypeId;
    _allownce.allowanceAmount = this.salarypart.allowanceAmount;
    _allownce.employeeId = this.salarypart.employeeId;
    _allownce.isFixed = true;
    _empSalaryPart.housingAllowance = _allownce;

    this._empcontractservice
      .SaveSalaryParts(_empSalaryPart)
      .subscribe((result) => {
        debugger;
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  DeleteEmployee() {
    this._empcontractservice
      .DeleteEmployee(this.contracidtodelete)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');

        if (result.statusCode == 200) {
          this.getData();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addBand(index: any) {
    console.log(index);

    this.bands?.push({
      clauseId: index + 1,
      clause: '',
    });
  }

  deleteBand(index: any) {
    this.bands?.splice(index, 1);
  }

  startJob(data: any) {
    console.log(data.liveDate);
    this._empContract = new EmpContract();
    this._empContract.startWorkDate = this.datePipe.transform(
      data.liveDate,
      'YYYY-MM-dd'
    );
    this._empContract.empId = this.editstartwork.empId;
    this._empContract.contractId = this.editstartwork.contractId;
    this._empcontractservice
      .BeginNewEmployeeWork(this._empContract)
      .subscribe((result) => {
        if (result.statusCode == 200) {
          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          this.getData();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  endEmployeeServices(data: any) {
    console.log(data);
  }

  saveOption(data: any) {}

  // Save row
  save(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    console.log('Row saved: ' + rowIndex);
    console.log(row);
  }

  // Delete row
  delete(row: any, rowIndex: any) {
    this.isEditable[rowIndex] = !this.isEditable[rowIndex];
    this.rows.splice(rowIndex, 1);
    console.log('Row deleted: ' + rowIndex);
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();

    const temp = this.temp.filter(function (d: any) {
      return d.reason.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.rows = temp;

    if (this.table) {
      this.table!.offset = 0;
    }
  }

  onInputChange2(event: any) {
    debugger;
    if (
      this.firstObligations.value.freelanceAmount != null &&
      this.firstObligations.value.allowanceAmount != null
    ) {
      var dailly = parseInt(
        (
          (parseFloat(this.firstObligations.value.freelanceAmount.toString()) +
            parseFloat(
              this.firstObligations.value.allowanceAmount.toString()
            )) /
          30
        ).toString()
      );
      this.firstObligations.patchValue({
        dailyEmpCost: dailly,
      });
    }
    this._empContract.dailyEmpCost =
      this.firstObligations.value.dailyEmpCost ?? 0;
  }

  ////////////////////////////print////////////////////////////

  printDailyVoucherReport_Custody() {
    debugger;
    var _empendwork = new EndWorkPrintVM();
    _empendwork.contractId = this.endempworkobj.contractId;
    _empendwork.empId = this.endempworkobj.empId;
    _empendwork.reson = this.endempworkobj.reson.toString();
    _empendwork.resontxt = this.reasonobj.description;
    _empendwork.date =
      this.datePipe.transform(this.endempworkobj.enddate, 'YYYY-MM-dd') ?? null;

    this._empcontractservice
      .PrintEmpEndWork(_empendwork)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          var link = environment.PhotoURL + result.reasonPhrase;
          window.open(link, '_blank');
          console.log(result);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }

  PrintEmpContractReport(obj: any) {
    debugger;
    this._empcontractservice
      .PrintEmpContractReport(obj.contractId)
      .subscribe((result: any) => {
        if (result.statusCode == 200) {
          var link = environment.PhotoURL + result.reasonPhrase;
          window.open(link, '_blank');
          console.log(result);
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
        }
      });
  }
  deletedate() {
    this.toast.error('please choose date from calender', 'رسالة');
  }
}
