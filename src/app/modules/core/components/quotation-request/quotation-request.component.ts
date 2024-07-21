import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quotation-request',
  templateUrl: './quotation-request.component.html',
  styleUrls: ['./quotation-request.component.scss'],
})
export class QuotationRequestComponent implements OnInit {
  qrCodeCheckValue: string;
  qrCodeCheckValue2: string;

  contactFormGroup = this._formBuilder.group({
    user_name: [null, [Validators.required, Validators.minLength(4)]],
    phone: [
      null,
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    email: [null, [Validators.required, Validators.email]],
    branchid: [null, Validators.required],

  });

  earthInfoFormGroup = this._formBuilder.group({
    land_area: [null, Validators.required],
    number_of_streets: [null, Validators.required],
    height: [null, Validators.required],
    width: [null, Validators.required],
  });

  requestServiceFormGroup = this._formBuilder.group({
    service: [null, Validators.required],
    parCode: [null, [Validators.required, Validators.minLength(4)]],
  });

  serviceDetailsFormGroup = this._formBuilder.group({
    parCode: [null, [Validators.required, Validators.minLength(4)]],
    basement: [null],
    basementInfo: [null],
    Ground_floor: [null],
    Ground_floor_info: [null],
    roomNumbers: [null],
    toiltNumbers: [null],
    First_round: [null],
    First_round_if_Room_and_bathroom: [null],
    First_round_if_oneRoom: [null],
    First_round_info: [null],
    surface_extension: [null],
    surface_extension_info: [null],
    garden: [null],
    external_supplement: [null],
    parking: [null],
    parkingInfo: [null],
    Driver_room: [null],
    Driver_room_info: [null],
    more_info: [null],
  });

  resetDataObj(){
    this.contactFormGroup = this._formBuilder.group({
      user_name: [null, [Validators.required, Validators.minLength(4)]],
      phone: [
        null,
        [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
      ],
      email: [null, [Validators.required, Validators.email]],
      branchid: [null, Validators.required],
    });

    this.earthInfoFormGroup = this._formBuilder.group({
      land_area: [null, Validators.required],
      number_of_streets: [null, Validators.required],
      height: [null, Validators.required],
      width: [null, Validators.required],
    });

    this.requestServiceFormGroup = this._formBuilder.group({
      service: [null, Validators.required],
      parCode: [null, [Validators.required, Validators.minLength(4)]],
    });

    this.serviceDetailsFormGroup = this._formBuilder.group({
      parCode: [null, [Validators.required, Validators.minLength(4)]],
      basement: [null],
      basementInfo: [null],
      Ground_floor: [null],
      Ground_floor_info: [null],
      roomNumbers: [null],
      toiltNumbers: [null],
      First_round: [null],
      First_round_if_Room_and_bathroom: [null],
      First_round_if_oneRoom: [null],
      First_round_info: [null],
      surface_extension: [null],
      surface_extension_info: [null],
      garden: [null],
      external_supplement: [null],
      parking: [null],
      parkingInfo: [null],
      Driver_room: [null],
      Driver_room_info: [null],
      more_info: [null],
    });
  }

  isEditable = true;

  basementOptions = [
    {title: { ar: 'مسبح', en: 'swimming pool' }, value: 1 },
    {title: { ar: ' مجلس', en: '  council' }, value: 2 },
    {title: { ar: ' حديقة', en: '  garden' }, value: 3 },
    {title: { ar: ' غرفة غسيل', en: '  Laundry Room' },value: 4},
    {title: { ar: ' مستودع', en: '  storehouse' }, value: 5 },
    {title: { ar: ' مواقف سيارات', en: '  Car parking' },value: 6},
    {title: { ar: ' مكتب', en: '  office' }, value: 7 },
    {title: { ar: ' مطبخ مفتوح', en: '  Open kitchen' },value: 8},
    {title: { ar: ' مطبخ مغلق', en: '  Closed kitchen' },value: 9},
    {title: { ar: ' غرفة نوم فقط', en: '  bedroom only' },value: 10},
    {title: { ar: ' غرفة نوم + دورة مياه', en: '  Bedroom + bathroom' },value:11},
    {title: { ar: ' نادي صحي', en: '  Health club' }, value: 12 },
    {title: { ar: ' صالة متعددة الإستخدامات', en: '  Multi-purpose hall' },value: 13},
    {title: { ar: ' غرفة ألعاب أطفال', en: '  Children playroom' },value: 14},
    {title: { ar: ' صالة سنيما منزلية', en: '  Home cinema hall' },value: 15},
  ];

  groundFloorOptions = [
    {title: { ar: 'معيشة عائلية', en: 'family living' },value: 16},
    {
      title: { ar: ' غرفة طعام الضيوف', en: '  Guest dining room' },
      value: 17
    },
    {
      title: { ar: ' مجلس الضيوف', en: '  Guest Council' },
      value: 18
    },
    {
      title: { ar: ' مطبخ مغلق', en: '  Closed kitchen' },
      value: 19
    },
    { title: { ar: ' مكتب', en: '  office' }, value: 20 },
    {
      title: { ar: ' غرفة طعام العائلة', en: '  Family dining room' },
      value: 21
    },
    { title: { ar: ' مصعد ', en: '  elevator' }, value: 22 },
    { title: { ar: 'مخزن', en: 'Store' }, value: 'Store' },
    {
      title: { ar: ' مطبخ مفتوح', en: '  Open kitchen' },
      value: 23
    },
    {
      title: { ar: ' مدخل فرعي', en: '  Sub-entrance' },
      value: 24
    },
    {
      title: { ar: ' مدخل رئيسي', en: '  Main entrance' },
      value: 25
    },
    { title: { ar: ' دورات مياه', en: '  Bathrooms' }, value: 26 },
    {
      title: {
        ar: ' غرفة نوم إضافية + حمام ',
        en: '  Additional bedroom + bathroom',
      },
      value: 27
    },
    { title: { ar: 'درج خدمة', en: 'service tray' }, value: 28 },
    {
      title: { ar: ' درج رئيسي ', en: '  Master staircase' },
      value: 29
    },
    {
      title: { ar: 'غرفة غسيل الملابس و الكي', en: 'Laundry and ironing room' },
      value: 30
    },
    {
      title: { ar: ' غرفة خادمة + دورة مياه', en: '  Maid room + bathroom' },
      value: 31
    },
    {
      title: { ar: ' غرفة نوم إضافية فقط', en: '  Extra bedroom only' },
      value: 32
    },
  ];

  firstFloorOptions = [
    {
      title: { ar: 'غرفة نوم فقط ', en: 'bedroom only' },
      value: 33
    },
    {
      title: { ar: 'غرفة نوم + دورة مياه', en: 'Bedroom + bathroom' },
      value: 34
    },
    {
      title: { ar: ' جناح غرفة النوم الرئيسية', en: '  Master bedroom suite' },
      value: 35
    },
    {
      title: {
        ar: ' مطبخ صغير و مفتوح للتخديم',
        en: '  Small kitchen open for serving',
      },
      value: 36
    },
    {
      title: { ar: ' جلسة عائلية', en: '  Family session' },
      value: 37
    },
    {
      title: { ar: ' دورة مياه', en: '  W.C' },
      value: 38
    },
    {
      title: { ar: ' صالة رياضية', en: '  gym' },
      value: 39
    },
    {
      title: { ar: ' غرفة خدمات', en: '  Service room' },
      value: 40
    },
    {
      title: { ar: ' مكتب', en: '  office' },
      value: 41
    },
  ];

  surfaceExtensionOptions = [
    {
      title: { ar: 'مستودع ', en: 'storehouse' },
      value: 42
    },
    {
      title: { ar: ' دورة مياه ', en: '  toilet' },
      value: 43
    },
    {
      title: { ar: ' جلسة سطح ', en: '  rooftop session' },
      value: 44
    },
    {
      title: { ar: ' غرفة نوم للخادمه ', en: '  Maid bedroom' },
      value: 45
    },
    {
      title: {
        ar: ' غرفة غسيل الملابس و الكي ',
        en: '  Laundry and ironing room',
      },
      value: 46
    },
    {
      title: { ar: ' صالة متعددة الإستخدامات ', en: '  Multi-use hall' },
      value: 47
    },
  ];

  gardenOptions = [
    {
      title: { ar: 'مسطح مائي فقط', en: 'Flat water only' },
      value: 48
    },
    {
      title: {
        ar: ' درج خارجي للقبو',
        en: '  External staircase to the cellar',
      },
      value: 49
    },
    {
      title: { ar: ' منطقة للعب الأطفال', en: '  Kids play area' },
      value: 50
    },
    {
      title: { ar: ' جلسة خارجية', en: '  external session' },
      value: 51
    },
    {
      title: { ar: ' مسبح', en: '  swimming pool' },
      value: 52
    },
  ];

  externalSupplementOptions = [
    {
      title: { ar: 'مجلس', en: 'council' },
      value: 53
    },
    {
      title: { ar: ' صالة متعددة الإستخدامات', en: '  Multi-use hall' },
      value: 54
    },
    {
      title: { ar: ' دورة مياه', en: '  toilet' },
      value: 55
    },
  ];

  ParkingOptions = [
    {
      title: { ar: 'سياره واحده ', en: 'one car' },
      value: 56
    },
    {
      title: { ar: ' سيارتان ', en: '  two cars' },
      value: 57
    },
    {
      title: { ar: '  أكثر', en: '  more' },
      value: 58
    },
  ];

  driverRoomOptions = [
    {
      title: { ar: 'غرفة سائق + دورة مياه ', en: 'Driver room + bathroom' },
      value: 59
    },
    {
      title: {
        ar: ' غرفة سائقين مع دورات المياه ',
        en: '  Drivers room with toilets',
      },
      value: 60
    },
    {
      title: { ar: ' أكثر ', en: '  more' },
      value: 61
    },
  ];



  constructor(private _formBuilder: FormBuilder
    ,private authenticationService: AuthenticationService
    ,private api: RestApiService
    ,private translate: TranslateService
    ,private toast: ToastrService) {
      this.authenticationService.allowWithoutToken = "allowWithoutToken";
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
    this.qrCodeCheckValue2 = Math.floor(1000 + Math.random() * 9000).toString();
  }

  OrganizationData :any;
  environmentPho: any;
  ngOnInit(): void {
  this.resetDataObj();
  this.FillProjectTypeSelect();
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

  refreshQrCode(type?: any) {
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
    if (type) {
      this.qrCodeCheckValue2 = Math.floor(
        1000 + Math.random() * 9000
      ).toString();
    }
  }

  requestGeneralPrice() {
    console.log(
      this.contactFormGroup.value,
      this.earthInfoFormGroup.value,
      this.requestServiceFormGroup.value
    );
  }

  requestDesginPrice() {
    console.log(
      this.contactFormGroup.value,
      this.earthInfoFormGroup.value,
      this.serviceDetailsFormGroup.value
    );
  }

  CheckValueSelected(List:any,val:any)
  {
    if(List!=null)
    {
      return (List.indexOf(val) > -1);
    }
    else
    {
      return false;
    }
  }
  CheckValueSelected2(value:any,val:any)
  {
    if(value!=null)
    {
      return (value==val);
    }
    else
    {
      return false;
    }
  }
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('stepper2') stepper2: MatStepper;

  FormTypeGlobal=1;
  disableButtonSave_req = false;

  requestPrice(type:any){
    // debugger
    // console.log(
    //   this.contactFormGroup.value,
    //   this.earthInfoFormGroup.value,
    //   this.requestServiceFormGroup.value,
    //   this.serviceDetailsFormGroup.value
    // );
    var FormObj:any = {};
    FormObj.FormId = 0
    FormObj.Name = this.contactFormGroup.controls['user_name'].value;
    FormObj.Email = this.contactFormGroup.controls['email'].value;
    FormObj.BranchId = this.contactFormGroup.controls['branchid'].value;
    FormObj.Mobile = this.contactFormGroup.controls['phone'].value;
    FormObj.LandArea = this.earthInfoFormGroup.controls['land_area'].value;
    FormObj.NumofStreetsAdjacent = this.earthInfoFormGroup.controls['number_of_streets'].value;
    FormObj.Height = this.earthInfoFormGroup.controls['height'].value;
    FormObj.Width = this.earthInfoFormGroup.controls['width'].value;
    FormObj.FormType = type;
    FormObj.ServiceNotes = this.requestServiceFormGroup.controls['service'].value;

    FormObj.Bas_swimmingPool=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,1);
    FormObj.Bas_board=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,2);
    FormObj.Bas_garden=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,3);
    FormObj.Bas_LaundryRoom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,4);
    FormObj.Bas_storehouse=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,5);
    FormObj.Bas_carparking=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,6);
    FormObj.Bas_Desk=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,7);
    FormObj.Bas_openkitchen=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,8);
    FormObj.Bas_closedkitchen=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,9);
    FormObj.Bas_bedroomonly=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,10);
    FormObj.Bas_Bedandbathroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,11);
    FormObj.Bas_Healthclub=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,12);
    FormObj.Bas_Multipurposehall=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,13);
    FormObj.Bas_Kidsplayroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,14);
    FormObj.Bas_Homecinemahall=this.CheckValueSelected(this.serviceDetailsFormGroup.value.basement,15);
    FormObj.Bas_Notes = this.serviceDetailsFormGroup.controls['basementInfo'].value;

    FormObj.Gro_familyliving=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,16);
    FormObj.Gro_guestdiningroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,17);
    FormObj.Gro_guestcouncil=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,18);
    FormObj.Gro_closedkitchen=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,19);
    FormObj.Gro_Desk=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,20);
    FormObj.Gro_elevator=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,21);
    FormObj.Gro_Store=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,22);
    FormObj.Gro_openkitchen=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,23);
    FormObj.Gro_SubEntrance=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,24);
    FormObj.Gro_MainEntrance=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,25);
    FormObj.Gro_Toilets=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,26);
    FormObj.Gro_Extrabedandbathroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,27);
    FormObj.Gro_servicedrawer=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,28);
    FormObj.Gro_maindrawer=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,29);
    FormObj.Gro_Laundryandironingroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,30);
    FormObj.Gro_Maidsroomandbathroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,31);
    FormObj.Gro_Extrabedroomonly=this.CheckValueSelected(this.serviceDetailsFormGroup.value.Ground_floor,32);
    FormObj.Gro_Numberofguestboards = this.serviceDetailsFormGroup.controls['roomNumbers'].value;
    FormObj.Gro_Numberoftoilets = this.serviceDetailsFormGroup.controls['toiltNumbers'].value;
    FormObj.Gro_Notes = this.serviceDetailsFormGroup.controls['Ground_floor_info'].value;

    FormObj.Firrou_bedroomonly=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,33);
    FormObj.Firrou_bedandbathroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,34);
    FormObj.Firrou_Masterbedroomsuite=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,35);
    FormObj.Firrou_Smallandopenkitchen=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,36);
    FormObj.Firrou_familysitting=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,37);
    FormObj.Firrou_WC=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,38);
    FormObj.Firrou_Gym=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,39);
    FormObj.Firrou_serviceroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,40);
    FormObj.Firrou_Desk=this.CheckValueSelected(this.serviceDetailsFormGroup.value.First_round,41);
    FormObj.Firrou_Numofbednadbathroom = this.serviceDetailsFormGroup.controls['First_round_if_Room_and_bathroom'].value;
    FormObj.Firrou_Numofbedroomonly = this.serviceDetailsFormGroup.controls['First_round_if_oneRoom'].value;
    FormObj.Firrou_Notes = this.serviceDetailsFormGroup.controls['First_round_info'].value;

    FormObj.Sur_storehouse=this.CheckValueSelected(this.serviceDetailsFormGroup.value.surface_extension,42);
    FormObj.Sur_WC=this.CheckValueSelected(this.serviceDetailsFormGroup.value.surface_extension,43);
    FormObj.Sur_surface=this.CheckValueSelected(this.serviceDetailsFormGroup.value.surface_extension,44);
    FormObj.Sur_Maidsbedroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.surface_extension,45);
    FormObj.Sur_Laundryandironingroom=this.CheckValueSelected(this.serviceDetailsFormGroup.value.surface_extension,46);
    FormObj.Sur_multiusehall=this.CheckValueSelected(this.serviceDetailsFormGroup.value.surface_extension,47);
    FormObj.Sur_Notes = this.serviceDetailsFormGroup.controls['surface_extension_info'].value;

    FormObj.Gar_waterbodyonly=this.CheckValueSelected(this.serviceDetailsFormGroup.value.garden,48);
    FormObj.Gar_Externalstaircase=this.CheckValueSelected(this.serviceDetailsFormGroup.value.garden,49);
    FormObj.Gar_Childrensplayarea=this.CheckValueSelected(this.serviceDetailsFormGroup.value.garden,50);
    FormObj.Gar_outdoorsitting=this.CheckValueSelected(this.serviceDetailsFormGroup.value.garden,51);
    FormObj.Gar_swimmingpool=this.CheckValueSelected(this.serviceDetailsFormGroup.value.garden,52);

    FormObj.Ext_Council=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.external_supplement,53);
    FormObj.Ext_Multipurposehall=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.external_supplement,54);
    FormObj.Ext_WC=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.external_supplement,55);

    FormObj.Par_OneCar=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.parking,56);
    FormObj.Par_TwoCar=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.parking,57);
    FormObj.Par_MoreCars=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.parking,58);
    FormObj.Par_NoofCars = this.serviceDetailsFormGroup.controls['parkingInfo'].value;

    FormObj.Dri_OneDriversroomtoilet=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.Driver_room,59);
    FormObj.Dri_TwoDriversroomwithtoilets=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.Driver_room,60);
    FormObj.Dri_MoreDriversroomwithtoilets=this.CheckValueSelected2(this.serviceDetailsFormGroup.value.Driver_room,61);
    FormObj.Dri_NoofDriversroomwithtoilets = this.serviceDetailsFormGroup.controls['Driver_room_info'].value;


    FormObj.AnotherNotes = this.serviceDetailsFormGroup.controls['more_info'].value;
    FormObj.FormStatus = false;
    console.log("FormObj");
    console.log(FormObj);
    this.disableButtonSave_req = true;
    setTimeout(() => {
      this.disableButtonSave_req = false;
    }, 10000);
    //return;
    this.api.SavePricingForm(FormObj).subscribe((result: any)=>{
      if(result.statusCode==200){
        this.stepper.selectedIndex = 0;
        this.stepper2.selectedIndex = 0;
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.resetDataObj();
      }
      else{this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));}
    });
  }

  ServiceBranches: any=[];
  FillProjectTypeSelect() {
    this.api.FillBranchSelect().subscribe((data) => {
      this.ServiceBranches = data;
    });
  }


}
