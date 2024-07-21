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
import { SelectionModel } from '@angular/cdk/collections';
import { AdvanceToEmployeeService } from 'src/app/core/services/Employees-Services/advance-to-employee.service';
import { CustodyVM } from 'src/app/core/Classes/ViewModels/custodyVM';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/core/services/shared.service';
import { DateType } from 'ngx-hijri-gregorian-datepicker';
import { Custody } from 'src/app/core/Classes/DomainObjects/custody';
import { Item } from 'src/app/core/Classes/DomainObjects/item';
import { ItemType } from 'src/app/core/Classes/DomainObjects/itemType';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-advance-to-employees',
  templateUrl: './advance-to-employees.component.html',
  styleUrls: ['./advance-to-employees.component.scss'],
})
export class AdvanceToEmployeesComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent | any;
  selectedDate: any;
  selectedDateType = DateType.Hijri;
  showBranches: any = false;

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
      ar: ' عُهَد الموظفين',
      en: 'Employees Covenant',
    },
  };

  selectedUser: any;
  selectcust: any;
  users: any;
  custodyselect: any;
  custtotransfer: any;
  itemdeleted: any;
  itemtypedeleted: any;
  custtoend: any;

  closeResult = '';
  public _custodyvm: CustodyVM;
  public _Custody: Custody;
  ItemTypeselected: any;
  Itemlist: any;
  ItemTypelist: any;
  // searchtext:'';
  searchtext2: '';
  formGroup = this.fb.group({});

  displayedColumns: string[] = [
    'employeName',
    'covenant',
    'Quantity',
    'price',
    'receiptCustody',
    'operations',
  ];

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  modalDetails: any = {
    employeName: null,
    covenant: null,
    Quantity: null,
    price: null,
    receiptCustody: null,
    category: null,
    date: null,
    hijridate: null,
    amount: null,
  };

  modalitemDetails: any = {
    id: null,
    nameAr: null,
    nameEn: null,
    itemtype: null,
    qntity: null,
    price: null,
    color: null,
  };

  modalitemtypeDetails: any = {
    id: null,
    nameAr: null,
    nameEn: null,
    note: null,
  };

  convenants: any;
  CustodyTypeSelectId: any;
  itemselect: any;
  public _item: Item;
  public _itemtype: ItemType;
  constructor(
    private modalService: NgbModal,
    private _advanceofemp: AdvanceToEmployeeService,
    private toast: ToastrService,
    private _shared: SharedService,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.dataSource = new MatTableDataSource([{}]);
    this._custodyvm = new CustodyVM();
    this._Custody = new Custody();
    this._item = new Item();
    this._itemtype = new ItemType();
  }

  getallitem() {
    debugger;
    this._advanceofemp.GetAllItems().subscribe((data) => {
      debugger;
      console.log(data.result);
      this.Itemlist = data.result; //new MatTableDataSource(data.result);
      console.log('aaaaa');

      console.log(this.Itemlist);
    });
  }

  GetAllItemTypes(searchtext: any) {
    if (searchtext != null) {
      this.searchtext2 = searchtext;
    } else {
      this.searchtext2 = '';
    }
    debugger;
    this._advanceofemp.GetAllItemTypes(this.searchtext2).subscribe((data) => {
      debugger;
      console.log('aaaaa');
      console.log(data.result);
      this.ItemTypelist = data.result; //new MatTableDataSource(data.result);
    });
  }

  FillEmployeeSelect() {
    this._advanceofemp.FillEmployeeSelect().subscribe((data) => {
      this.users = data;
    });
  }
  fillitemselect() {
    this._advanceofemp.FillItemSelect().subscribe((data) => {
      this.itemselect = data;
    });
  }

  FillCustodySelect() {
    this._advanceofemp.FillCustodySelect().subscribe((data) => {
      debugger;
      this.custodyselect = data.result;
    });
  }

  Fillitemtype() {
    this._advanceofemp.FillItemTypeSelect().subscribe((data) => {
      debugger;
      console.log(data);
      this.ItemTypeselected = data;
    });
  }

  gethijridate(data: any) {
    debugger;
    console.log(new Date(data));

    this._shared.GetHijriDate(data, 'Contract/GetHijriDate').subscribe({
      next: (data: any) => {
        debugger;
        console.log(data.result);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  edititem(data: any) {
    debugger;

    this.modalitemDetails.id = data.itemId;

    this.modalitemDetails.namear = data.nameAr;
    this.modalitemDetails.nameen = data.nameEn;

    this.modalitemDetails.itemtype = data.typeId;
    this.modalitemDetails.qntity = data.quantity;
    this.modalitemDetails.price = data.price;
    this.modalitemDetails.color = data.color;
  }

  edititemtype(data: any) {
    debugger;

    this.modalitemtypeDetails.id = data.itemTypeId;

    this.modalitemtypeDetails.namear = data.nameAr;
    this.modalitemtypeDetails.nameen = data.nameEn;

    this.modalitemtypeDetails.notes = data.notes;
  }

  saveitemtypes() {
    console.log(this.modalitemtypeDetails);

    this._itemtype = new ItemType();
    if (
      this.modalitemtypeDetails.id != null &&
      this.modalitemtypeDetails.id != 0
    ) {
      this._itemtype.itemTypeId = this.modalitemtypeDetails.id;
    } else {
      this._itemtype.itemTypeId = 0;
    }
    this._itemtype.nameAr = this.modalitemtypeDetails.namear;
    this._itemtype.nameEn = this.modalitemtypeDetails.nameen;
    this._itemtype.notes = this.modalitemtypeDetails.notes;

    this._advanceofemp.SaveItemType(this._itemtype).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      debugger;
      if (result.statusCode == 200) {
        this.fillitemselect();
        this.Fillitemtype();
        this.getallitem();
        this.GetAllItemTypes('');

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

  saveitems() {
    console.log(this.modalitemDetails);

    this._item = new Item();
    if (this.modalitemDetails.id != null && this.modalitemDetails.id != 0) {
      this._item.itemId = this.modalitemDetails.id;
    } else {
      this._item.itemId = 0;
    }
    this._item.nameAr = this.modalitemDetails.namear;
    this._item.nameEn = this.modalitemDetails.nameen;
    this._item.price = this.modalitemDetails.price;
    this._item.quantity = this.modalitemDetails.qntity;
    this._item.color = this.modalitemDetails.color;
    this._item.typeId = this.modalitemDetails.itemtype;
    this._advanceofemp.SaveItem(this._item).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      debugger;
      if (result.statusCode == 200) {
        this.fillitemselect();
        this.Fillitemtype();
        this.getallitem();

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

  Deleteitem() {
    debugger;
    this._advanceofemp.Deleteitem(this.itemdeleted).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      debugger;
      if (result.statusCode == 200) {
        this.fillitemselect();
        this.Fillitemtype();
        this.getallitem();
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
  Deleteitemtype() {
    debugger;
    this._advanceofemp
      .DeleteitemType(this.itemtypedeleted)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.fillitemselect();
          this.Fillitemtype();
          this.getallitem();
          this.GetAllItemTypes('');
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

  ngOnInit(): void {
    this.FillEmployeeSelect();
    this.FillCustodySelect();
    this.GetAllCustody();
    this.fillitemselect();
    this.Fillitemtype();
    this.getallitem();
    this.GetAllItemTypes('');

    this.CustodyTypeSelectId = [
      { id: 1, Name: 'عهده عيبنية' },
      { id: 2, Name: 'عهده ماليه' },
    ];
  }

  GetAllCustody() {
    debugger;
    this._advanceofemp.GetSomeCustody(false).subscribe((data) => {
      debugger;
      console.log('aaaaa');
      console.log(data.result);
      this.dataSource = new MatTableDataSource(data.result);
    });
  }

  withReason = false;
  open(content: any, data?: any, type?: any, info?: any) {
    if (data && type == 'edit') {
      console.log('asdd');

      this.modalDetails = data;
      this.custtoend = data;
      this.modalDetails['id'] = '1';
      data.hijriDate = this.gethigridate();
      this.modalDetails.hijriDate = data.hijriDate;
    }

    if (data && type == 'transfer') {
      console.log('asdd');

      this.custtotransfer = data;
    }
    if (data && type == 'returntransfer') {
      this.custtotransfer = data;
    }
    if (data && type == 'deleted') {
      this.itemdeleted = data.itemId;
    }

    if (data && type == 'deleted3') {
      this.itemtypedeleted = data.itemTypeId;
    }

    if (info) {
      this.withReason = true;
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
  endcustody(modal: any) {
    debugger;
    console.log(this.custtoend.custodyId);
    this._advanceofemp
      .FreeCustody(this.custtoend.custodyId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllCustody();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
        }
      });
  }

  transfercustody(modal: any) {
    debugger;
    console.log(this.custtotransfer.custodyId);
    this._advanceofemp
      .ConvertStatusCustody(this.custtotransfer.custodyId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllCustody();

          this.toast.success(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
        } else {
          this.toast.error(
            this.translate.instant(result.reasonPhrase),
            this.translate.instant('Message')
          );
          modal.dismiss();
        }
      });
  }

  returntransfercustody() {
    debugger;
    console.log(this.custtotransfer.custodyId);
    this._advanceofemp
      .ReturnConvetCustody(this.custtotransfer.custodyId)
      .subscribe((result: any) => {
        console.log(result);
        console.log('result');
        debugger;
        if (result.statusCode == 200) {
          this.GetAllCustody();

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

  SearchCustody() {
    debugger;
    this._custodyvm = new CustodyVM();
    this._custodyvm.employeeId = this.selectedUser;
    this._custodyvm.itemId = this.selectcust;

    this._advanceofemp.SearchCustody(this._custodyvm).subscribe({
      next: (data: any) => {
        // assign data to table
        debugger;
        console.log(data.result);
        this.dataSource = new MatTableDataSource(data.result);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  private getDismissReason(reason: any, type?: any): string {
    this.modalDetails = {};

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    this.GetAllItemTypes(val);

    // const temp = this.temp.filter(function (d: any) {
    //   return d.name_ar.toLowerCase().indexOf(val) !== -1 || !val;
    // }
    // );

    // this.rows = temp;

    // if (this.table) {
    //   this.table!.offset = 0;
    // }
  }

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

  saveOption(data: any) {}

  addCovenant(data: any) {
    debugger;
    if (
      this.modalDetails.user == null ||
      this.modalDetails.convanantType == null ||
      this.modalDetails.date == null
    ) {
      this.toast.error('من فضلك أكمل البيانات ', 'رسالة');
      return;
    }
    console.log(data);
    console.log(this.modalDetails);
    this._Custody = new Custody();
    this._Custody.employeeId = this.modalDetails.user;
    this._Custody.itemId = this.modalDetails.category;
    this._Custody.type = this.modalDetails.convanantType;
    this._Custody.date = this.modalDetails.date;
    //this._Custody.hijriDate=this.modalDetails.Hijri;
    this._Custody.quantity = this.modalDetails.Quantity;
    this._Custody.custodyValue = this.modalDetails.amount;

    this._advanceofemp.SaveCustody(this._Custody).subscribe((result: any) => {
      console.log(result);
      console.log('result');
      debugger;
      if (result.statusCode == 200) {
        this.GetAllCustody();
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

  gethigridate() {
    debugger;
    this._shared
      .GetHijriDate(this.modalDetails.date, 'Contract/GetHijriDate2')
      .subscribe({
        next: (data: any) => {
          debugger;
          console.log(data);
          this.modalDetails.hijriDate = data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
