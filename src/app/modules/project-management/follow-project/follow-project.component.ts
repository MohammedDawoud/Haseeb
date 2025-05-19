import { map, take } from 'rxjs/operators';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RestApiService } from 'src/app/shared/services/api.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { fade } from 'src/app/shared/animations/toggleBtn.animation';
import { ProjectVM } from 'src/app/core/Classes/ViewModels/projectVM';
import { environment } from 'src/environments/environment';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexGrid,
  ApexTooltip,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};
import { FollowprojectService } from 'src/app/core/services/pro_Services/followproject.service';
import { FollowProj } from 'src/app/core/Classes/DomainObjects/followProj';
import { ReceiptService } from 'src/app/core/services/acc_Services/receipt.service';
import { PayVoucherService } from 'src/app/core/services/acc_Services/pay-voucher.service';
import { VoucherFilterVM } from 'src/app/core/Classes/ViewModels/voucherFilterVM';
import { AccountsreportsService } from 'src/app/core/services/acc_Services/accountsreports.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { VoucherDetails } from 'src/app/core/Classes/DomainObjects/voucherDetails';
import { Invoices } from 'src/app/core/Classes/DomainObjects/invoices';
import { DatePipe } from '@angular/common';
import { Acc_Clauses } from 'src/app/core/Classes/DomainObjects/acc_Clauses';
import { Acc_Suppliers } from 'src/app/core/Classes/DomainObjects/acc_Suppliers';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
const hijriSafe = require('hijri-date/lib/safe');
const HijriDate = hijriSafe.default;
const toHijri = hijriSafe.toHijri;

@Component({
  selector: 'app-follow-project',
  templateUrl: './follow-project.component.html',
  styleUrls: ['./follow-project.component.scss'],
  providers: [DatePipe],
  animations: [fade],
})
export class FollowProjectComponent {
  // @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: any;
  public calculatorChartOptions: any;

  title: any = {
    main: {
      name: {
        ar: 'إدارة المشاريع',
        en: 'Projects Manegment',
      },
      link: '/projects',
    },
    sub: {
      ar: ' متابعة إيرادات ومصروفات المشاريع',
      en: ' Monitor project revenues and expenses',
    },
  };
  searchBox: any = {
    open: false,
    searchType: null,
    searchTypes: [
      {
        name: {
          ar: 'اسم العميل',
          en: 'Customer Name',
        },
        id: 1,
      },
      {
        name: {
          ar: 'رقم الهوية',
          en: 'National Id',
        },
        id: 2,
      },
      {
        name: {
          ar: 'رقم الجوال',
          en: 'Mobile Number',
        },
        id: 3,
      },
    ],
  };

  displayedColumns: string[] = [
    'projectNumber',
    'ProjectTime',
    'ProjectPrice',
    'index',
    'profitability',
    'Net',
    'operations',
  ];
  data: any = {
    filter: {
      enable: false,
      date: null,
      search_CustomerId: null,
      search_ManagerId: null,
      isChecked: false,
    },
    stage: {
      NameAr: '',
      NameEn: '',
    },
    clause: {
      NameAr: '',
      NameEn: '',
    },
    stages: [],
    clauses: [],
    highestpayingcustomer: null,
    highestpayingEng: null,
    ImgEng: null,
    myArrayProNo: [],
    myArrayCost: [],

    FinalTable: {
      projectTime: null,
      projectValue: null,
      projectCost: null,
      projectStatusVal: null,
      projectStatusName: null,
    },
  };
  dataSourceTemp: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([{}]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userG: any = {};

  constructor(
    private modalService: BsModalService,
    private modalServiceR: NgbModal,
    private api: RestApiService,
    private _followprojectService: FollowprojectService,
    private _sharedService: SharedService,
    private datePipe: DatePipe,
    private toast: ToastrService,
    private translate: TranslateService,
    private receiptService: ReceiptService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private _accountsreportsService: AccountsreportsService,
    private _payvoucherservice: PayVoucherService
  ) {
    this.userG = this.authenticationService.userGlobalObj;
    this.chartOptions = {
      series: [
        {
          name: '',
          data: this.data.myArrayCost,
        },
      ],
      annotations: {
        points: [
          {
            x: 'Bananas',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0',
              },
              text: '',
            },
          },
        ],
      },
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: [
        '#3e95cd',
        '#3e95cd',
        '#3e95cd',
        '#3e95cd',
        '#3e95cd',
        '#ff5252',
        '#ff5252',
        '#ff5252',
        '#ff5252',
        '#ff5252',
      ],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          //distributed: true
          // endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: this.data.myArrayProNo,
      },
      yaxis: {
        title: {
          text: 'Servings',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    };
    this.calculatorChartOptions = {
      series: [
        {
          name: 'Net Profit',
          data: [44],
        },
        {
          name: 'Revenue',
          data: [76],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '100%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Feb'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
    };

    this.GetMaxCosEManagerTOP10();
    this.getData();
    this.FillCustomerSelectWProOnly();
    this.FillAllUsersSelectAll();
    this.GetMaxCosECustomerNameTOP1();
    this.GetMaxCosEManagerNameTOP1();
  }
  //------------------------------------------Dash--------------------------------------------------------
  //#region
  getData() {
    var empty: any = [];
    this.dataSource = new MatTableDataSource(empty);
    this._followprojectService
      .GetAllProjectsWithCostE_CostS()
      .subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSourceTemp = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  getAllProject() {
    this._followprojectService
      .GetAllProjectsWithoutCostE_CostS()
      .subscribe((data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSourceTemp = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  GetPercProfit(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);

    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);

    var valDiff = valCostE - valCostS; //ايرادات - مصروفات
    var Res = 0;
    if (Obj.contractValue != 0) {
      Res = (valDiff / Obj.contractValue) * 100;
    } else {
      Res = 0;
    }
    return parseFloat(Res.toString()).toFixed(2);
  }
  GetNet(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);

    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);

    var valDiff = valCostE - valCostS; //ايرادات - مصروفات
    return parseFloat(valDiff.toString()).toFixed(2);
  }
  GetvalCostE(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);
    return parseFloat(valCostE.toString()).toFixed(2);
  }
  GetvalCostS(Obj: any) {
    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);
    return parseFloat(valCostS.toString()).toFixed(2);
  }
  GetvalCostEPer(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);

    var CostERate = 0;
    if (Obj.contractValue != 0) {
      CostERate = +parseFloat(
        ((valCostE / Obj.contractValue) * 100).toString()
      ).toFixed(2);
    } else {
      CostERate = 0;
    }
    return CostERate;
  }
  GetvalCostEPer_width(Obj: any) {
    var valCostE =
      +parseFloat(Obj.costE_W).toFixed(2) +
      +parseFloat(Obj.costE_Depit_W).toFixed(2) -
      +parseFloat(Obj.costE_Credit_W).toFixed(2);
    valCostE = +parseFloat(valCostE.toString()).toFixed(2);

    var CostERate = 0;
    if (Obj.contractValue != 0) {
      CostERate = +parseFloat(
        ((valCostE / Obj.contractValue) * 100).toString()
      ).toFixed(2);
    } else {
      CostERate = 0;
    }
    return 'width:' + CostERate + '%';
  }
  GetvalCostSPer(Obj: any) {
    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);
    var CostSRate = 0;
    if (Obj.contractValue != 0) {
      CostSRate = +parseFloat(
        ((valCostS / Obj.contractValue) * 100).toString()
      ).toFixed(2);
    } else {
      CostSRate = 0;
    }
    return CostSRate;
  }
  GetvalCostSPer_width(Obj: any) {
    var valCostS =
      +parseFloat(Obj.costS_W).toFixed(2) +
      +parseFloat(Obj.oper_expeValue).toFixed(2);
    valCostS = +parseFloat(valCostS.toString()).toFixed(2);
    var CostSRate = 0;
    if (Obj.contractValue != 0) {
      CostSRate = +parseFloat(
        ((valCostS / Obj.contractValue) * 100).toString()
      ).toFixed(2);
    } else {
      CostSRate = 0;
    }
    return 'width:' + CostSRate + '%';
  }
  load_CustomerSearch: any;
  FillCustomerSelectWProOnly() {
    this._followprojectService
      .FillCustomerSelectWProOnly()
      .subscribe((data) => {
        console.log(data);
        this.load_CustomerSearch = data;
      });
  }
  load_ManagerSearch: any;
  FillAllUsersSelectAll() {
    this._followprojectService.FillAllUsersSelectAll().subscribe((data) => {
      console.log(data);
      this.load_ManagerSearch = data;
    });
  }

  GetMaxCosECustomerNameTOP1() {
    this._followprojectService
      .GetMaxCosECustomerNameTOP1()
      .subscribe((data) => {
        console.log(data);
        this.data.highestpayingcustomer = data.customerName;
      });
  }
  GetMaxCosEManagerTOP10() {
    this._followprojectService.GetMaxCosEManagerTOP10().subscribe((data) => {
      console.log(data);
      data.forEach((element: any) => {
        this.data.myArrayProNo.push(element.projectNo);
        this.data.myArrayCost.push(element.costES);
      });
      console.log('myArrayProNo');
      console.log(this.data.myArrayProNo);
      console.log(this.data.myArrayCost);
      this.GetChartDash(this.data.myArrayCost, this.data.myArrayProNo);
    });
  }
  GetMaxCosEManagerNameTOP1() {
    this._followprojectService.GetMaxCosEManagerNameTOP1().subscribe((data) => {
      console.log(data);
      debugger;
      this.data.highestpayingEng = data.managerName;
      if (data.imgUrl == null || data.imgUrl == '') {
        this.data.ImgEng = 'assets/images/logo_image.png';
      } else {
        this.data.ImgEng = environment.PhotoURL + data.imgUrl;
      }
      console.log('this.data.highestpayingEng');
      console.log(this.data.highestpayingEng);
      console.log(this.data.ImgEng);
    });
  }

  GetChartDash(_myArrayCost: any, _myArrayProNo: any) {
    this.chartOptions = {
      series: [
        {
          name: 'القيمة',
          data: _myArrayCost,
        },
      ],
      annotations: {
        points: [
          {
            x: 'Bananas',
            seriesIndex: 0,
            label: {
              borderColor: '#775DD0',
              offsetY: 0,
              style: {
                color: '#fff',
                background: '#775DD0',
              },
              text: '',
            },
          },
        ],
      },
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: [
        '#3e95cd',
        '#3e95cd',
        '#3e95cd',
        '#3e95cd',
        '#3e95cd',
        '#ff5252',
        '#ff5252',
        '#ff5252',
        '#ff5252',
        '#ff5252',
      ],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          //distributed: true
          // endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
      },

      grid: {
        row: {
          colors: ['#fff', '#f2f2f2'],
        },
      },
      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: _myArrayProNo,
      },
      yaxis: {
        title: {
          text: 'Servings',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    };
  }

  public _projectVM: ProjectVM;

  RefreshData() {
    debugger;
    this._projectVM = new ProjectVM();
    this._projectVM.customerId = this.data.filter.search_CustomerId;
    this._projectVM.mangerId = this.data.filter.search_ManagerId;

    this._projectVM.status = 0;

    var obj = this._projectVM;
    this._followprojectService.GetProjectsSearch(obj).subscribe((data) => {
      console.log(data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSourceTemp = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  checkValue(event: any) {
    if (event == 'A') {
      this.getAllProject();
    } else {
      this.RefreshData();
    }
  }

  applyFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const tempsource = this.dataSourceTemp.filter(function (d: any) {
      return (
        d.projectNo?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.timeStr?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val ||
        d.contractValue?.trim().toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.dataSource = new MatTableDataSource(tempsource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //#endregion
  //-----------------------------------(End)-------Dash--------------------------------------------------------

  //------------------------------------calc page---------------------------------------------------------
  //#region
  employees: any = [];

  addEmployee() {
    var maxVal = 0;
    debugger;
    if (this.employees.length > 0) {
      maxVal = Math.max(...this.employees.map((o: { idRow: any }) => o.idRow));
    } else {
      maxVal = 0;
    }

    let newEmployee = {
      idRow: maxVal + 1,
      id: 0,
      name: 0,
      duration: null,
      durationType: 4,
      ratio: null,
      salary: null,
      cost: null,
      accSalary: null,
    };
    this.employees.push(newEmployee);
    this.FillSelectEmployee();
  }
  deleteRow(idRow: any) {
    debugger;
    let index = this.employees.findIndex(
      (d: { idRow: any }) => d.idRow == idRow
    );
    this.employees.splice(index, 1);
  }
  RowValue: any;
  GetValueCalc(element: any) {
    debugger;
    this.RowValue = element;
    this.employees = [];
    this.data.FinalTable.projectStatusName = null;
    this.data.FinalTable.projectStatusVal = null;
    this.data.FinalTable.projectCost = null;
    this.SetDistTable();
    this.SetFinalTable(element.timeStr, element.contractValue);
  }
  load_Employee: any;
  FillSelectEmployee() {
    this._followprojectService.FillSelectEmployee().subscribe((data) => {
      console.log(data);
      this.load_Employee = data;
    });
  }
  emp_Change(element: any) {
    debugger;
    if (element.name == null) {
      //this.EmployeeInfo=[];
      element.accSalary = null;
    } else {
      this.GetEmployeeInfo(element);
    }
  }
  //EmployeeInfo:any;
  GetEmployeeInfo(element: any) {
    debugger;
    this._followprojectService
      .GetEmployeeInfo(element.name)
      .subscribe((data) => {
        console.log(data);
        element.accSalary = data.salary;
        // Salary
      });
  }
  CalcDist(element: any) {
    debugger;
    var TimeNO = element.duration;
    var TimeType = element.durationType;
    var Salary = element.accSalary;
    var Days = 0;
    if (TimeType == 1) {
      Days = 1;
    } //يوم
    else if (TimeType == 2) {
      Days = 7;
    } // اسبوع
    else if (TimeType == 3) {
      Days = 30;
    } // شهر
    else if (TimeType == 4) {
      Days = 1 / 24;
    } //    1/24   ساعة
    else {
      Days = 0;
    }
    var Value = parseFloat(((TimeNO * Days * Salary) / 30).toString()).toFixed(
      2
    );
    element.salary = Value;
    var PercentEmp = element.ratio;
    var EmpValueAfter = parseFloat(
      ((PercentEmp * this.RowValue.contractValue) / 100).toString()
    ).toFixed(2);
    var Cost = parseFloat(
      (
        +parseFloat(EmpValueAfter).toFixed(2) + +parseFloat(Value).toFixed(2)
      ).toString()
    ).toFixed(2);
    element.cost = Cost;
    //--------------------------------------
    this.FinalCalcDist();
    //---------------------------------------
  }
  FinalCalcDist() {
    if (this.employees.length == 0) {
      this.data.FinalTable.projectStatusName = null;
      this.data.FinalTable.projectStatusVal = null;
      this.data.FinalTable.projectCost = null;
      return;
    }

    var FinalVal = 0.0;
    this.employees.forEach((element: any) => {
      FinalVal =
        +parseFloat(FinalVal.toString()).toFixed(2) +
        +parseFloat(element.cost ?? 0).toFixed(2);
    });
    this.data.FinalTable.projectCost = parseFloat(FinalVal.toString()).toFixed(
      2
    );
    var FinalV = parseFloat(FinalVal.toString()).toFixed(2);
    var ProConV = this.data.FinalTable.projectValue;
    if (+FinalV > +ProConV) {
      this.data.FinalTable.projectStatusName = 'المشروع خاسر';
      this.data.FinalTable.projectStatusVal = 0;
    } else {
      this.data.FinalTable.projectStatusName = 'المشروع ناجح';
      this.data.FinalTable.projectStatusVal = 1;
    }
  }
  SetFinalTable(TimeStr: any, ConValue: any) {
    this.data.FinalTable.projectTime = TimeStr;
    this.data.FinalTable.projectValue = ConValue;
  }

  SetDistTable() {
    this.GetAllFollowProj();

    console.log('this.RowValue');
    console.log(this.RowValue);

    var CostE = this.GetvalCostE(this.RowValue);
    var CostS = this.GetvalCostS(this.RowValue);
    console.log('CostS');

    console.log(CostE);
    console.log(CostS);

    this.GetChartCalc(this.RowValue.projectNo, CostE, CostS);
  }
  FollowProjData = [];
  GetAllFollowProj() {
    debugger;
    this.FollowProjData = [];
    this._followprojectService
      .GetAllFollowProj(this.RowValue.projectId)
      .subscribe((data) => {
        console.log('dasdadsadsata');
        console.log(data);

        data.forEach((element: any) => {
          this.FillSelectEmployee();
          var maxVal = 0;
          debugger;
          if (this.employees.length > 0) {
            maxVal = Math.max(
              ...this.employees.map((o: { idRow: any }) => o.idRow)
            );
          } else {
            maxVal = 0;
          }
          debugger;
          let newEmployee = {
            idRow: maxVal + 1,
            id: element.followProjId,
            name: element.empId,
            duration: element.timeNo,
            durationType: element.timeType,
            ratio: element.empRate,
            salary: element.amount,
            cost: element.expectedCost,
            accSalary: element.empSalary,
          };
          this.employees.push(newEmployee);
        });
        this.FollowProjData = data;
        this.FinalCalcDist();
      });
  }

  FollowProjListData: any = {
    FollowProj: null,
  };

  FollowProjList: any = [];
  FollowProj: any;
  SaveFollowProj(calcModal: any) {
    debugger;
    var CheckValid = 1;
    this.employees.forEach((element: any) => {
      if (
        element.name == null ||
        element.duration == null ||
        element.durationType == null
      ) {
        CheckValid = 0;
      }
    });
    if (CheckValid == 0) {
      this.toast.error('من فضلك أكمل البيانات',this.translate.instant("Message"));
      return;
    }

    debugger;
    this.FollowProjList = [];
    this.employees.forEach((element: any) => {
      var FollowProj: any = {};
      FollowProj.FollowProjId = 0;
      FollowProj.EmpId = element.name;
      FollowProj.ProjectId = this.RowValue.projectId;
      FollowProj.TimeNo = String(element.duration);
      FollowProj.TimeType = String(element.durationType);
      FollowProj.EmpRate = String(element.ratio ?? '0');
      FollowProj.Amount = parseFloat(element.salary);
      FollowProj.ExpectedCost = parseFloat(element.cost);
      FollowProj.ConfirmRate = false;
      this.FollowProjList.push(FollowProj);
    });

    console.log('this.FollowProjList');
    console.log(this.FollowProjList);
    this.FollowProjListData.FollowProj = this.FollowProjList;

    var obj = this.FollowProjListData;
    this._followprojectService.SaveFollowProj(obj).subscribe((result: any) => {
      debugger;
      if (result.statusCode == 200) {
        this.toast.success(
          this.translate.instant(result.reasonPhrase),
          this.translate.instant('Message')
        );
        calcModal?.hide();
      } else {
        this.toast.error(result.reasonPhrase,this.translate.instant("Message"));
      }
    });
  }

  GetChartCalc(ProjNo: any, CostE: any, CostS: any) {
    this.calculatorChartOptions = {
      series: [
        {
          name: 'المصرزفات',
          data: [CostS],
        },
        {
          name: 'الإيرادات',
          data: [CostE],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '100%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [ProjNo],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
    };
  }

  //#endregion
  //-----------------------------------end calc page-----------------------------------------------------------

  //----------------------------------- PayVoucher-----------------------------------------------------------
  //#region
  payVoucherdata: any = {
    voucher: {
      InvoiceId: 0,
      InvoiceNumber: null,
      JournalNumber: null,
      Date: null,
      HijriDate: null,
      Notes: null,
      InvoiceNotes: null,
      Type: null,
      InvoiceValue: null,
      TaxAmount: null,
      TotalValue: null,
      ProjectId: null,
      ToAccountId: null,
      InvoiceReference: null,
      SupplierInvoiceNo: null,
      RecevierTxt: null,
      ClauseId: null,
      SupplierId: null,
      DunCalc: false,
      PayType: null,
      voucherDetailsList: [],

      CostCenterSelectId: null,
      FileImg: null,
      InvoiceValuetxt: null,
      ValueTax: null,
      ValueBefore: null,
      ValueAfter: null,
      SupplierTaxID: null,
      AccountId: null,
      AccountIdCode: null,
      ToAccountIdCode: null,
      TaxCheck: false,
    },
    voucherDetailsObj: {
      LineNumber: 1,
      AccountId: null,
      Amount: null,
      TaxType: null,
      TaxAmount: null,
      TotalAmount: null,
      PayType: null,
      ToAccountId: null,
      CostCenterId: null,
      ReferenceNumber: null,
      Description: null,
      CheckNo: null,
      CheckDate: null,
      BankId: null,
      MoneyOrderNo: null,
      MoneyOrderDate: null,
    },
    Desc: null,
    Checkand7wala: false,
  };

  OpenPayVoucherN(element: any) {
    this.RowValue = element;
    this.payVoucherdata.voucher.DunCalc = false;
    this.payVoucherdata.voucherDetailsObj.TaxType = false;
    //this.payVoucherdata.voucher.HijriDate=new Date();
    this.payVoucherdata.Desc = element.projectNo;

    this.payVoucherdata.voucher.PayType = 1;

    this.ResetVoucherControls();

    // let PayTypeN2de = 1;  //نقدي

    // $('#PayType').val(PayTypeN2de);
    // $('#select2-PayType-container').html($("select[name=PayType] option[value='" + PayTypeN2de + "']").text());

    // loadSelectItems('#ToAccountId', '@Url.Action("FillCustAccountsSelect2", "Account")', 1);
    // getcount('@Url.Action("FillCustAccountsSelect2", "Account")', 1);
    this.FillCustAccountsSelect2(1);
    this.GetCostCenterByProId_Proj(element.projectId);
  }

  GetCostCenterByProId_Proj(projid: any) {
    this._followprojectService
      .GetCostCenterByProId(projid)
      .subscribe((data) => {
        console.log(data);
        this.payVoucherdata.voucher.CostCenterSelectId =
          data.result.costCenterId;
      });
  }

  ResetVoucherControls() {
    this.FillCostCenterSelect();
    this.FillSubAccountLoad();
    this.FillClausesSelect();
    this.FillSuppliersSelect();
    this.payVoucherdata.voucher.Date = new Date();
    this.payVoucherdata.voucher.InvoiceId = 0;
    this.payVoucherdata.Checkand7wala = false;
    this.GenerateVoucherNumber();
  }
  VoucherType = 5;
  GenerateVoucherNumber() {
    debugger;
    this._followprojectService
      .GenerateVoucherNumber(this.VoucherType)
      .subscribe((data) => {
        console.log('data2');
        console.log(data);
        this.payVoucherdata.voucher.InvoiceNumber = data;
      });

    this._followprojectService.GenerateVoucherNumber(this.VoucherType).pipe(
      map((response) => {
        var a = response;
        console.log('response');
        console.log(response);
      })
    );
    var aaaa = this._followprojectService.GenerateVoucherNumber(
      this.VoucherType
    );
    // this.payVoucherdata.voucher.InvoiceNumber=this._followprojectService.GenerateVoucherNumber(this.VoucherType);
  }

  load_CustAccounts: any;
  FillCustAccountsSelect2(param: any) {
    this._followprojectService
      .FillCustAccountsSelect2(param)
      .subscribe((data) => {
        console.log('data1');
        console.log(data);

        this.load_CustAccounts = data;
      });
  }

  load_CostCenter: any;
  FillCostCenterSelect() {
    this._followprojectService.FillCostCenterSelect().subscribe((data) => {
      console.log('data1');
      console.log(data);

      this.load_CostCenter = data;
    });
  }
  load_SubAccount: any;
  FillSubAccountLoad() {
    this._followprojectService.FillSubAccountLoad().subscribe((data) => {
      console.log('data2');
      console.log(data);
      this.load_SubAccount = data.result;
    });
  }
  load_Clausesh: any;
  // FillClausesSelect(){
  //   this._followprojectService.FillClausesSelect().subscribe(data=>{
  //     console.log("data3");
  //     console.log(data);
  //     this.load_Clausesh=data;
  //   });
  // }
  load_Suppliers: any;
  FillSuppliersSelect() {
    this._followprojectService.FillSuppliersSelect().subscribe((data) => {
      console.log('data4');
      console.log(data);
      this.load_Suppliers = data;
    });
  }
  //#endregion
  //-----------------------------------end PayVoucher-----------------------------------------------------------
  selection = new SelectionModel<any>(true, []);
  modalDetails: any;
  addNewSupervision?: BsModalRef;

  log(asd: any) {
    console.log(asd);
    console.log(asd);
  }
  availableSupervision() {}
  decline() {}
  confirmDelete() {}

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  // ==========================================================
  closeResult = '';
  open(content: any, data?: any, type?: any, idRow?: any, status?: any) {
    if (type == 'clause') {
      this.GetAllClauses();
    } else if (type == 'deleteclase') {
      this.clausedeleted = data.clauseId;
    } else if (type == 'editvoucher') {
      this.FillCustAccountsSelect2R(1);
      this.CheckDetailsIntial();

      this.GetAllVouchersLastMonth();
      this.FillBankSelect();
      this.FillCostCentersSelect();
      this.FillClausesSelect();
      this.FillCitySelects();
      this.FillSuppliersSelect2();
      this.FillBankSelect();
      this.GetLayoutReadyVm();
      if (this.userG?.userPrivileges.includes(13100307)) {
        this.saveandpost = 1;
      }
      this.GenerateVoucherNumberR();
      this.FillSubAccountLoadR();
      this.GetBranch_CostcenterR();
    } else if (type == 'EditCheckDetailsModal') {
      if (status == 'newCheckDetails') {
        this.CheckDetailsIntial();
        this.CheckDetailsForm.controls['paymenttypeName'].disable();
        // var PayType = this.ReceiptVoucherForm.controls["paymenttype"].value
        var PayType = this.vouchermodel.payType;

        if (PayType == 2) {
          this.transferNumber = true;
          this.CheckDetailsForm.controls['paymenttypeName'].setValue(
            this.translate.instant('Check')
          );
        } else if (PayType == 6) {
          this.transferNumber = true;
          this.CheckDetailsForm.controls['paymenttypeName'].setValue(
            this.translate.instant('transfer')
          );
        } else if (PayType == 17) {
          this.transferNumber = false;
          this.CheckDetailsForm.controls['paymenttypeName'].setValue(
            this.translate.instant('Cash account points of sale - Mada-ATM')
          );
        }
      } else if (status == 'EditCheckDetails') {
        this.CheckDetailsForm.controls['paymenttypeName'].disable();
        this.CheckDetailsIntial();
        this.CheckDetailsForm.controls['paymenttypeName'].setValue(
          data.checkdetailpaytype
        );
        this.CheckDetailsForm.controls['Check_transferNumber'].setValue(
          data.checkdetailcheckNo
        );
        this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(
          new Date(data.checkdetailcheckDate)
        );
        this.CheckDetailsForm.controls['BankId'].setValue(
          data.checkdetailbankId
        );
      }
    } else if (type == 'supplier') {
      this.GetAllSuppliersR();
    } else if (type == 'deletesupplier') {
      this.supplierdeleted = data.supplierId;
    } else if (type == 'AddModalBanks') {
      this.GetAllBanks();
    } else if (type == 'deleteBank') {
      this.DeletebanksId = data.bankId;
    }

    this.modalServiceR
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: type ? 'xl' : 'lg',
        centered: type ? false : true,
      })

      .result.then(
        (result) => {
          if (type == 'edit') {
            this.modalDetails = {
              projectNo: null,
              projectDuration: null,
              branch: null,
              center: null,
              from: null,
              to: null,
              projectType: null,
              subProjectDetails: null,
              walk: null,
              customer: null,
              buildingType: null,
              service: null,
              user: null,
              region: null,
              projectDescription: null,
              offerPriceNumber: null,
              projectDepartment: null,
              projectPermissions: null,
              projectGoals: null,
            };
          }
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  searchClause: any = null;
  claselist: any;
  clausedeleted: any;
  clauseseleted: any = [];
  VoucherTypeR: any = 5;
  projectsDataSource = new MatTableDataSource();

  Clausemodel: any = {
    id: null,
    nameAr: null,
    nameEn: null,
  };
  GetAllVouchersList: any;
  GetAllVouchersLastMonth() {
    var _voucherFilterVM = new VoucherFilterVM();
    _voucherFilterVM.type = this.VoucherTypeR;
    var obj = _voucherFilterVM;

    this._payvoucherservice.GetAllVouchersLastMonth(obj).subscribe((data) => {
      this.projectsDataSource = new MatTableDataSource(data);
      this.GetAllVouchersList = data;
      this.projectsDataSource.paginator = this.paginator;
      this.projectsDataSource.sort = this.sort;
      console.log('alldata', data);
    });
  }
  FillClausesSelect() {
    this._payvoucherservice.FillClausesSelect().subscribe(
      (data) => {
        this.clauseseleted = data;
        console.log(this.clauseseleted);
      },
      (error) => {}
    );
  }
  costCentersList: any;
  FillCostCentersSelect() {
    this._accountsreportsService.FillCostCenterSelect().subscribe((data) => {
      this.costCentersList = data;
    });
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

  BankSelectList: any;
  FillBankSelect() {
    this.receiptService.FillBankSelect().subscribe((data) => {
      this.BankSelectList = data;
    });
  }
  vouchermodel: any = {
    invoiceNumber: null,
    journalNumber: null,
    date: null,
    hijriDate: null,
    notes: null,
    type: null,
    invoiceValue: null,
    taxAmount: null,
    totalValue: null,
    toAccountId: null,
    invoiceReference: null,
    supplierInvoiceNo: null,
    recevierTxt: null,
    clauseId: null,
    supplierId: null,
    dunCalc: null,
    payType: 1,
    taxtype: 2,
    costCenterId: null,
    reftxt: null,
    reVoucherNValueText: null,
    valuebefore: null,
    valueafter: null,
    supplierTaxID: null,
    fromAccountId2Code: null,
    toAccountIdCode: null,
    invoiceNotes: null,
    taxcheck1: false,
    CostCenterId: null,
  };
  voucherDetails: any = {
    invoiceNumber: null,
    journalNumber: null,
    date: new Date(),
    hijriDate: null,
    notes: null,
    type: null,
    invoiceValue: null,
    checkNo: null,
    checkDate: null,
    bankId: null,
    moneyOrderNo: null,
    moneyOrderDate: null,
  };
  resetvouchermodel() {
    const DateHijri =toHijri(new Date());
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;

    this.vouchermodel.invoiceId = 0;
    this.vouchermodel.invoiceNumber = null;
    this.vouchermodel.journalNumber = null;
    this.vouchermodel.date = new Date();
    this.vouchermodel.hijriDate = DateGre;
    this.vouchermodel.notes = null;
    this.vouchermodel.type = null;
    this.vouchermodel.invoiceValue = null;
    this.vouchermodel.taxAmount = null;
    this.vouchermodel.totalValue = null;
    this.vouchermodel.toAccountId = null;
    this.vouchermodel.invoiceReference = null;
    this.vouchermodel.supplierInvoiceNo = null;
    this.vouchermodel.recevierTxt = null;
    this.vouchermodel.clauseId = null;
    this.vouchermodel.supplierId = null;
    this.vouchermodel.dunCalc = null;
    (this.vouchermodel.payType = 1),
      (this.vouchermodel.taxtype = 2),
      (this.vouchermodel.costCenterId = null);
    this.vouchermodel.reftxt = null;
    this.vouchermodel.reVoucherNValueText = null;
    this.vouchermodel.valuebefore = null;
    this.vouchermodel.valueafter = null;
    this.vouchermodel.supplierTaxID = null;
    this.vouchermodel.fromAccountId2Code = null;
    this.vouchermodel.toAccountIdCode = null;
    this.vouchermodel.accountId = null;
    this.vouchermodel.invoiceNotes = null;
    (this.vouchermodel.taxcheck1 = false),
      (this.vouchermodel.CostCenterId = null);

    this.voucherDetails.invoiceNumber = null;
    this.voucherDetails.journalNumber = null;

    this.voucherDetails.notes = null;
    this.voucherDetails.type = null;
    this.voucherDetails.invoiceValue = null;
    this.voucherDetails.checkNo = null;
    this.voucherDetails.checkDate = null;
    this.voucherDetails.bankId = null;
    this.voucherDetails.moneyOrderNo = null;
    this.voucherDetails.moneyOrderDate = null;
    this.checkdetailsList = [];
  }
  checkdetailsList: any = [];
  addUser: any;
  addDate: any;
  addInvoiceImg: any;
  modalType = 0;
  saveandpost: any;
  public uploadedFilesR: Array<File> = [];
  Taxchechdisabl = false;
  PayTypeList = [
    { id: 1, name: 'monetary' },
    { id: 17, name: 'Cash account points of sale - Mada-ATM' },
    { id: 2, name: 'Check' },
    { id: 6, name: 'transfer' },
    { id: 9, name: 'Network/transfer' },
    { id: 15, name: 'عهد موظفين' },
    { id: 16, name: 'جاري المالك' },
  ];


  projectId: any;
  @ViewChild('EditCheckDetailsModal') EditCheckDetailsModal: any;
  CheckDetailsForm: FormGroup;
  transferNumber: boolean = false;
  Toaccount: any;
  hijriDate: any = { year: 1455, month: 4, day: 20 };
  selectedDateTypeR = DateType.Hijri;
  submitted: boolean = false;
  editvouccher(data: any) {
    const DateHijri =toHijri(new Date());
    var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
    DateGre._day=DateGre._date;
    this.projectId = null;
    this.vouchermodel.invoiceId = 0;
    this.vouchermodel.invoiceNumber = null;
    this.vouchermodel.journalNumber = null;
    this.vouchermodel.date = new Date();
    this.vouchermodel.hijriDate = DateGre;
    this.vouchermodel.notes = null;
    this.vouchermodel.type = null;
    this.vouchermodel.invoiceValue = null;
    this.vouchermodel.taxAmount = null;
    this.vouchermodel.totalValue = null;
    this.vouchermodel.toAccountId = null;
    this.vouchermodel.invoiceReference = null;
    this.vouchermodel.supplierInvoiceNo = null;
    this.vouchermodel.recevierTxt = null;
    this.vouchermodel.clauseId = null;
    this.vouchermodel.supplierId = null;
    this.vouchermodel.dunCalc = null;
    (this.vouchermodel.payType = 1),
      (this.vouchermodel.taxtype = 2),
      (this.vouchermodel.costCenterId = null);
    this.vouchermodel.reftxt = null;
    this.vouchermodel.reVoucherNValueText = null;
    this.vouchermodel.valuebefore = null;
    this.vouchermodel.valueafter = null;
    this.vouchermodel.supplierTaxID = null;
    this.vouchermodel.fromAccountId2Code = null;
    this.vouchermodel.toAccountIdCode = null;
    this.vouchermodel.accountId = null;
    this.vouchermodel.invoiceNotes = null;
    (this.vouchermodel.taxcheck1 = false),
      (this.vouchermodel.CostCenterId = null);

    this.voucherDetails.invoiceNumber = null;
    this.voucherDetails.journalNumber = null;
    this.voucherDetails.notes = null;
    this.voucherDetails.type = null;
    this.voucherDetails.invoiceValue = null;
    this.voucherDetails.checkNo = null;
    this.voucherDetails.checkDate = null;
    this.voucherDetails.bankId = null;
    this.voucherDetails.moneyOrderNo = null;
    this.voucherDetails.moneyOrderDate = null;
    this.checkdetailsList = [];
    // this.vouchermodel.invoiceNumber = data.invoiceNumber;

    // this.vouchermodel.hijriDate = data.hijriDate;
    this.vouchermodel.notes = data.notes;
    this.vouchermodel.invoiceNotes = data.invoiceNotes;
    var VoucherValue = data.invoiceValue;
    var TaxValue = 0;
    //var VoucherTotalValue = $('#receiptVoucherGrid').DataTable().row($(this).closest('tr')).data().TotalValue;
    this.vouchermodel.journalNumber = data.journalNumber;

    // this.vouchermodel.supplierInvoiceNo=data.supplierInvoiceNo;
    this.vouchermodel.supplierInvoiceNo = data.invoiceNumber;
    this.vouchermodel.RecevierTxt = data.recevierTxt;
    this.vouchermodel.invoiceReference = data.invoiceReference;
    this.vouchermodel.invoiceValue = data.invoiceValue;
    this.vouchermodel.reVoucherNValueText = data.invoiceValueText;
    this.vouchermodel.valuebefore=0;
    // if (parseInt(data.invoiceValue) == parseInt(data.totalValue)) {
    //   this.vouchermodel.valuebefore = parseFloat(
    //     (
    //       parseFloat(data.invoiceValue?.toString()) -
    //       parseFloat(data.taxAmount?.toString())
    //     ).toString()
    //   ).toFixed(this.DigitalNumGlobal);
    // } else {
    //   this.vouchermodel.valuebefore = parseFloat(data.invoiceValue).toFixed(
    //     this.DigitalNumGlobal
    //   );
    // }
    this.projectId = data.projectId;

    this.vouchermodel.taxAmount = data.taxAmount;
    this.vouchermodel.valueafter = data.totalValue;
    if (parseFloat(data.taxAmount).toFixed(2).toString() == '0.00') {
      this.Taxchechdisabl = false;

      this.vouchermodel.taxcheck1 = true;
    } else {
      this.Taxchechdisabl = false;

      this.vouchermodel.taxcheck1 = false;
    }

    var DunCalcV = data.dunCalc;

    if (DunCalcV == true) {
      this.vouchermodel.dunCalc = true;
    } else {
      this.vouchermodel.dunCalc = false;
    }

    var taxType =
      parseInt(data.totalValue) === parseInt(data.tnvoiceValue) ? 3 : 2;
    this.vouchermodel.taxtype = taxType;

    // this.vouchermodel.supplierId = data.supplierId;
    this._payvoucherservice.FillClausesSelect().subscribe(
      (data) => {
        this.clauseseleted = data;
        if (this.clauseseleted.length > 0) {
          this.vouchermodel.clauseId = this.clauseseleted[0].id;
        }
      },
      (error) => {}
    );
    if (data.addDate != null) {
      this.addUser = data.addUser;
      this.addDate = data.addDate;
      if (data.addInvoiceImg != '' && data.addInvoiceImg != null) {
        this.addInvoiceImg = data.addInvoiceImg;
      }
    }

    //this.GetTaxNoBySuppIdR(data.supplierId);
  }

  CheckDetailsIntial() {
    this.CheckDetailsForm = this.formBuilder.group({
      dateCheck_transfer: [new Date(), []],
      paymenttypeName: [null, []],
      Check_transferNumber: [null, []],
      BankId: [null, []],
      bankName: [null, []],
    });
  }
  checkdetailsTabel(modal?: any) {
    this.BankSelectList.forEach((element: any) => {
      if (element.id == this.CheckDetailsForm.controls['BankId'].value)
        this.CheckDetailsForm.controls['bankName'].setValue(element.name);
    });

    if (
      this.CheckDetailsForm.controls['dateCheck_transfer'].value != null &&
      typeof this.CheckDetailsForm.controls['dateCheck_transfer'].value !=
        'string'
    ) {
      var date = this._sharedService.date_TO_String(
        this.CheckDetailsForm.controls['dateCheck_transfer'].value
      );
      this.CheckDetailsForm.controls['dateCheck_transfer'].setValue(date);
    }
    this.checkdetailsList = [
      {
        checkdetail: 1,
        checkdetailpaytype:
          this.CheckDetailsForm.controls['paymenttypeName'].value,
        checkdetailcheckNo:
          this.CheckDetailsForm.controls['Check_transferNumber'].value,
        checkdetailcheckDate:
          this.CheckDetailsForm.controls['dateCheck_transfer'].value,
        checkdetailbankId: this.CheckDetailsForm.controls['BankId'].value,
        checkdetailbankName: this.CheckDetailsForm.controls['bankName'].value,
      },
    ];
    if (modal) {
      modal.dismiss();
    }
  }

  GetTaxNoBySuppIdR(suppid: any) {
    this._payvoucherservice.GetTaxNoBySuppId(suppid).subscribe((data) => {
      this.vouchermodel.supplierTaxID = data ?? '';
    });
  }

  FillCustAccountsSelect2listTO: any;
  FillSubAccountLoadR() {
    this.receiptService.FillSubAccountLoad().subscribe((data) => {
      this.FillCustAccountsSelect2listTO = data.result;
    });
  }

  FillCustAccountsSelect2listFROM: any;
  FillCustAccountsSelect2R(PayTypeId: any) {
    this.receiptService.FillCustAccountsSelect2(PayTypeId).subscribe((data) => {
      this.Toaccount = data;
    });
  }

  getaccountcode(accountid: any, type: any) {
    if (accountid == null || accountid == '') {
      if (type == 1) {
        this.vouchermodel.toAccountIdCode = null;
      } else {
        this.vouchermodel.fromAccountId2Code = null;
      }
    } else {
      this._payvoucherservice.GetAccCodeFormID(accountid).subscribe((data) => {
        if (type == 1) {
          this.vouchermodel.toAccountIdCode = data;
        } else {
          this.vouchermodel.fromAccountId2Code = data;
        }
      });
    }
  }

  savefileR(id: any) {
    const formData = new FormData();
    formData.append('UploadedFile', this.uploadedFilesR[0]);
    formData.append('InvoiceId', id);
    this.receiptService.UploadPayVoucherImage(formData).subscribe((data) => {
      this.GetAllVouchersLastMonth();
    });
  }

  savevoucher(type: any, modal: any) {
    this.submitted = true;

    if (
      this.vouchermodel.date == null ||
      this.vouchermodel.invoiceValue == null ||
      this.vouchermodel.toAccountId == null ||
      this.vouchermodel.recevierTxt == null ||
      this.vouchermodel.clauseId == null ||
      this.vouchermodel.supplierId == null ||
      this.vouchermodel.CostCenterId == null ||
      this.vouchermodel.accountId == null ||
      this.vouchermodel.payType == null
    ) {
      this.toast.error(
        this.translate.instant('من فضلك اكمل البيانات'),
        this.translate.instant('Message')
      );
      return;
    }
    var VoucherDetailsList = [];
    var VoucherObj = new Invoices();
    VoucherObj.invoiceId = 0;
    VoucherObj.invoiceNumber = this.vouchermodel.invoiceNumber;
    VoucherObj.journalNumber = this.vouchermodel.journalNumber;

    if(this.vouchermodel.date!=null)
    {
      VoucherObj.date =this._sharedService.date_TO_String(this.vouchermodel.date);
      const nowHijri =toHijri(this.vouchermodel.date);
      VoucherObj.hijriDate= this._sharedService.hijri_TO_String(nowHijri);
    }
    VoucherObj.notes = this.vouchermodel.notes;
    VoucherObj.invoiceNotes = this.vouchermodel.invoiceNotes;
    VoucherObj.type = this.VoucherTypeR;
    VoucherObj.invoiceValue = this.vouchermodel.invoiceValue;
    VoucherObj.taxAmount = this.vouchermodel.taxAmount;
    VoucherObj.totalValue = this.vouchermodel.valueafter;

    VoucherObj.toAccountId = this.vouchermodel.toAccountId;
    VoucherObj.invoiceReference = this.vouchermodel.invoiceReference;

    VoucherObj.toInvoiceId = this.vouchermodel.supplierInvoiceNo;
    VoucherObj.supplierInvoiceNo = this.vouchermodel.supplierInvoiceNo;
    VoucherObj.recevierTxt = this.vouchermodel.recevierTxt;
    VoucherObj.clauseId = this.vouchermodel.clauseId;
    VoucherObj.supplierId = this.vouchermodel.supplierId;
    VoucherObj.projectId = this.projectId;
    //  if (this.vouchermodel.) {
    VoucherObj.dunCalc = this.vouchermodel.dunCalc ?? false;
    // }
    // else {
    //     VoucherObj.dunCalc = false;
    // }
    VoucherObj.payType = this.vouchermodel.payType;
    // var input = { valid: true, message: "" }
    // var ValidCostCenterAcc = true;
    // var SelctedAccCostList = [];

    var VoucherDetailsObj = new VoucherDetails();
    VoucherDetailsObj.lineNumber = 1;
    VoucherDetailsObj.accountId = this.vouchermodel.accountId;
    VoucherDetailsObj.amount = this.vouchermodel.invoiceValue;
    VoucherDetailsObj.taxType = this.vouchermodel.taxtype;
    VoucherDetailsObj.taxAmount = this.vouchermodel.taxAmount;

    VoucherDetailsObj.totalAmount = this.vouchermodel.valueafter;
    VoucherDetailsObj.payType = this.vouchermodel.payType;
    VoucherDetailsObj.toAccountId = this.vouchermodel.toAccountId;

    VoucherDetailsObj.costCenterId = this.vouchermodel.CostCenterId;
    VoucherDetailsObj.referenceNumber = this.vouchermodel.invoiceReference;
    VoucherDetailsObj.description = this.vouchermodel.notes;

    if (this.vouchermodel.payType == 2) {
      const checkTransferNumber =
        this.CheckDetailsForm.controls['Check_transferNumber'].value;
      VoucherDetailsObj.checkNo = checkTransferNumber
        ? checkTransferNumber.toString()
        : '';
      VoucherDetailsObj.checkDate =
        this.CheckDetailsForm.controls['dateCheck_transfer'].value;
      VoucherDetailsObj.bankId = this.CheckDetailsForm.controls['BankId'].value;
    } else if (this.vouchermodel.payType == 6) {
      VoucherDetailsObj.moneyOrderNo =
        this.CheckDetailsForm.controls['Check_transferNumber'].value;
      VoucherDetailsObj.moneyOrderDate =
        this.CheckDetailsForm.controls['dateCheck_transfer'].value;
      VoucherDetailsObj.bankId = this.CheckDetailsForm.controls['BankId'].value;
    } else if (this.vouchermodel.payType == 17) {
      VoucherDetailsObj.moneyOrderNo =
        this.CheckDetailsForm.controls['Check_transferNumber'].value;
      VoucherDetailsObj.moneyOrderDate =
        this.CheckDetailsForm.controls['dateCheck_transfer'].value;
      VoucherDetailsObj.bankId = this.CheckDetailsForm.controls['BankId'].value;
    }

    VoucherDetailsList.push(VoucherDetailsObj);

    VoucherObj.voucherDetails = VoucherDetailsList;
    if (type == 1) {
      this._payvoucherservice.SaveandPostVoucherP(VoucherObj).pipe(take(1)).subscribe(
        (data) => {
          if (data.statusCode == 200) {
            this.submitted = false;
            if (this.data.filter.isChecked == true) {
              this.RefreshData();
            } else {
              this.getAllProject();
            }
            if (this.uploadedFilesR.length > 0) {
              this.savefileR(data.returnedParm);
              this.GetAllVouchersLastMonth();
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          } else {
            this.toast.error(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
            this.submitted = false;
          }
        }
      );
    } else {
      this._payvoucherservice.SaveVoucherP(VoucherObj).pipe(take(1)).subscribe(
        (data) => {
          this.submitted = false;
          if (this.data.filter.isChecked == true) {
            this.RefreshData();
          } else {
            this.getAllProject();
          }
          if (data.statusCode == 200) {
            if (this.uploadedFilesR.length > 0) {
              this.GetAllVouchersLastMonth();
              this.savefileR(data.returnedParm);
              modal.dismiss();
              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            } else {
              modal.dismiss();

              this.toast.success(
                this.translate.instant(data.reasonPhrase),
                this.translate.instant('Message')
              );
            }
          } else {
            this.toast.error(
              this.translate.instant(data.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        }
      );
    }
  }

  FillCustAc(add: any) {
    var PayType = this.vouchermodel.payType;
    this.checkdetailsList = [];

    if (PayType == 1) {
      this.FillCustAccountsSelect2R(1);
    } else if (PayType == 2 || PayType == 6) {
      this.FillCustAccountsSelect2R(6);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else if (PayType == 3) {
      this.FillCustAccountsSelect2R(4);
    } else if (PayType == 4) {
      this.FillCustAccountsSelect2R(5);
    } else if (PayType == 5) {
      this.FillCustAccountsSelect2R(6);
    } else if (PayType == 9) {
      this.FillCustAccountsSelect2R(9);
    } else if (PayType == 15) {
      this.FillCustAccountsSelect2R(15);
    } else if (PayType == 16) {
      this.FillCustAccountsSelect2R(16);
    } else if (PayType == 17) {
      this.FillCustAccountsSelect2R(17);
      if (add == false) {
        this.open(
          this.EditCheckDetailsModal,
          '',
          'EditCheckDetailsModal',
          'newCheckDetails'
        );
      }
    } else {
      this.FillCustAccountsSelect2R(0);
    }
  }

  GetAllClauses() {
    this._payvoucherservice.GetAllClauses(this.searchClause ?? '').subscribe(
      (data) => {
        this.claselist = data.result;
        console.log(this.claselist);
      },
      (error) => {}
    );
  }
  editclause(item: any) {
    console.log(item);
    this.Clausemodel.id = item.id;
    this.Clausemodel.nameAr = item.nameAr;
    this.Clausemodel.nameEn = item.nameEn;
  }

  SaveClause() {
    var _Clause = new Acc_Clauses();
    if (
      this.Clausemodel.nameAr == null ||
      this.Clausemodel.nameAr == '' ||
      this.Clausemodel.nameEn == null ||
      this.Clausemodel.nameEn == ''
    ) {
      this.toast.error('من فضلك اكمل البيانات');
      return;
    }
    _Clause.clauseId = this.Clausemodel.id ?? 0;
    _Clause.nameAr = this.Clausemodel.nameAr;
    _Clause.nameEn = this.Clausemodel.nameEn;

    this._payvoucherservice.SaveClause(_Clause).subscribe(
      (data) => {
        this.GetAllClauses();
        this.FillClausesSelect();
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

  DeleteClause(modal: any) {
    this._payvoucherservice.DeleteClause(this.clausedeleted).subscribe(
      (data) => {
        this.GetAllClauses();
        this.FillClausesSelect();
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

  taxtypeChangeR() {
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
  }

  searchsupplier: any = null;
  supplierlist: any;
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
    this._payvoucherservice
      .GetAllSuppliers(this.searchsupplier ?? '')
      .subscribe(
        (data) => {
          this.supplierlist = data;
        },
        (error) => {}
      );
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

  Taxckeck1Change() {
    if (this.vouchermodel.taxcheck1 == false) {
      this.vouchermodel.taxtype = 3;
      this.Taxchechdisabl = true;
      let totalInvoices = parseFloat(this.vouchermodel.invoiceValue);
      this.vouchermodel.taxAmount = 0;
      this.vouchermodel.valuebefore = 0;
      this.vouchermodel.valueafter = totalInvoices.toFixed(
        this.DigitalNumGlobal
      );
    } else {
      this.Taxchechdisabl = false;
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
  }
  invoiceValuechange() {
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
    this._payvoucherservice
      .ConvertNumToString(this.vouchermodel.invoiceValue)
      .subscribe((data) => {
        this.vouchermodel.reVoucherNValueText = data.reasonPhrase;
      });
  }

  BanksList: any;
  GetAllBanks() {
    this.receiptService.GetAllBanks().subscribe(
      (data) => {
        this.BanksList = data.result;
      },
      (error) => {}
    );
  }
  BanksId: any = '0';
  BanksNameAr: any;
  BanksNameEn: any;
  SaveBanks() {
    if (this.BanksNameAr != null && this.BanksNameEn != null) {
      const prames = {
        bankId: this.BanksId,
        NameAr: this.BanksNameAr,
        NameEn: this.BanksNameEn,
      };
      this.receiptService.Savebanks(prames).subscribe(
        (data) => {
          this.BanksNameAr = null;
          this.BanksNameEn = null;
          this.BanksId = '0';
          this.FillBankSelect();
          this.GetAllBanks();
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
  }
  updateBanks(Banks: any) {
    this.BanksId = Banks.bankId;
    this.BanksNameAr = Banks.nameAr;
    this.BanksNameEn = Banks.nameEn;
  }

  DeletebanksId: any;
  DeleteBank(modal: any) {
    this.receiptService.DeleteBanks(this.DeletebanksId).subscribe(
      (data) => {
        if (data.statusCode == 200) {
          this.toast.success(
            this.translate.instant(data.reasonPhrase),
            this.translate.instant('Message')
          );
          this.FillBankSelect();
          this.GetAllBanks();
          this.DeletebanksId = null;
          modal.dismiss();
        }
      },
      (error) => {
        this.toast.error(
          this.translate.instant(error.reasonPhrase),
          this.translate.instant('Message')
        );
      }
    );
  }

  GenerateVoucherNumberR() {
    this._payvoucherservice
      .GenerateVoucherNumber(this.VoucherTypeR)
      .subscribe((data) => {
        debugger;
        this.vouchermodel.invoiceNumber = data.reasonPhrase;
      });
  }
  selectedDateType = DateType.Hijri;
  //Date-Hijri
  ChangeReceiptVoucherGre(event:any){
    if(event!=null)
    {
      const DateHijri =toHijri(this.vouchermodel.date);
      var DateGre = new HijriDate(DateHijri._year, DateHijri._month, DateHijri._date);
      DateGre._day=DateGre._date;
      this.vouchermodel.hijriDate=DateGre;
    }
    else{
      this.vouchermodel.hijriDate=null;
    }
  }
  ChangeReceiptVoucherHijri(event:any){
    if(event!=null)
    {
      const DateGre = new HijriDate(event.year, event.month, event.day);
      const dayGreg = DateGre.toGregorian();
      this.vouchermodel.date=dayGreg;
    }
    else{
      this.vouchermodel.date=null;
    }
  }

  GetBranch_CostcenterR() {
    this._payvoucherservice.GetBranch_Costcenter().subscribe({
      next: (data: any) => {
        this.vouchermodel.CostCenterId = data.result.costCenterId;
      },
      error: (error) => {},
    });
  }
  DigitalNumGlobal: any;
  GetLayoutReadyVm() {
    this._payvoucherservice.GetLayoutReadyVm().subscribe((data) => {
      if (data.decimalPoints == null || data.decimalPoints == '') {
        this.DigitalNumGlobal = 0;
      } else {
        this.DigitalNumGlobal = parseInt(data.decimalPoints);
      }
    });
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

  taxtypeChange() {
    debugger;
    if (this.vouchermodel.taxtype == 2) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        var vAT_TaxVal = data.result.vat;
        debugger;
        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue).toFixed(
          this.DigitalNumGlobal
        );

        var tax = parseFloat(
          ((parseFloat(totalInvoices.toString()) * vAT_TaxVal) / 100).toString()
        ).toFixed(this.DigitalNumGlobal);

        var totalwithtax = parseFloat(
          (+totalInvoices + +tax).toString()
        ).toFixed(this.DigitalNumGlobal);

        // $("#ValueTax").val(tax);
        // $("#ValueBefore").val(totalInvoices);
        // $("#ValueAfter").val(totalwithtax);

        this.vouchermodel.taxAmount = tax;
        this.vouchermodel.valuebefore = totalInvoices;
        this.vouchermodel.valueafter = totalwithtax;
      });
    } else if (this.vouchermodel.taxtype == 3) {
      this._payvoucherservice.GetALLOrgData().subscribe((data) => {
        debugger;
        var vAT_TaxVal = data.result.vat;

        let totalInvoices = parseFloat(this.vouchermodel.invoiceValue); //.toFixed(this.DigitalNumGlobal);
        // var totalWithtaxInvoices = parseFloat($("#TotalVoucherValueLbl").val()).toFixed($('#DigitalNumGlobal').val());

        var tax = parseFloat(
          (
            parseFloat(totalInvoices.toString()) -
            parseFloat(totalInvoices.toString()) / (vAT_TaxVal / 100 + 1)
          ).toString()
        ); //.toFixed(this.DigitalNumGlobal);

        //var totalwithtax = parseFloat((totalWithtaxInvoices - tax).toString()).toFixed(this.DigitalNumGlobal);

        this.vouchermodel.taxAmount = tax.toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valuebefore = parseFloat(
          (totalInvoices - tax).toString()
        ).toFixed(this.DigitalNumGlobal);
        this.vouchermodel.valueafter = totalInvoices.toFixed(
          this.DigitalNumGlobal
        );
      });
    }
  }
  // =========================================================
}
