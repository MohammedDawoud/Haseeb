import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { loadModules } from 'esri-loader';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AttendenceLocationService } from 'src/app/core/services/Employees-Services/attendence-location.service';

@Component({
  selector: 'app-attendencelocationnew',
  templateUrl: './attendencelocationnew.component.html',
  styleUrls: ['./attendencelocationnew.component.scss']
})
export class AttendencelocationnewComponent {
  @ViewChild('latLonForm', { static: true }) latLonForm!: any;
  @ViewChild('lng', { static: true }) lng!: any;
  @ViewChild('lat', { static: true }) lat!: any;
  @ViewChild('form', { static: true }) nameForm!: NgForm;
  userG : any = {};
  checkEditOrSave:number=0;
  constructor(private modalService: NgbModal,private toast: ToastrService,private _attLocation: AttendenceLocationService,
    private translate: TranslateService,private authenticationService: AuthenticationService,  ) {
      this.userG = this.authenticationService.userGlobalObj;
    }
  // attendanceData: {
  //   name: string;
  //   coordinates: {
  //     xmin: number;
  //     ymin: number;
  //     xmax: number;
  //     ymax: number;
  //   };
  //   center: {
  //     lng: number;
  //     lat: number;
  //   };
  // }[] = [];

  locationName!: string;
  coordinates!: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
  center!: {
    lng: number;
    lat: number;
  };
  router = inject(Router);
  actRouter = inject(ActivatedRoute);
  locationData!: {
    attendenceLocationSettingsId:number;
    name: string;
    coordinates: {
      xmin: number;
      ymin: number;
      xmax: number;
      ymax: number;
    };
    center: {
      lng: number;
      lat: number;
    };
  };
  ngOnInit() {

    this.locationName = this.actRouter.snapshot.params['name'];
    // this.locationName = 'new';
    if (this.locationName === 'new') {
      this.locationNameNew="";
      this.checkEditOrSave=0;
      this.locationData = {
        attendenceLocationSettingsId:0,
        name: '',
        coordinates: {
          xmin: 0,
          ymin: 0,
          xmax: 0,
          ymax: 0,
        },
        center: {
          lng: 0,
          lat: 0,
        },
      };
      this.locationData.name = this.locationName;
      this.initialMap();
    } else {
      this.GetlAttendencelocationbyId(parseInt(this.locationName));
      this.checkEditOrSave=1;

    }
  }


  Loc_Latitude:any="";
  Loc_Longitude:any="";

  GetlAttendencelocationbyId(id:any){
    this._attLocation.GetlAttendencelocationbyId(id).subscribe((data: any) => {
      var Res=data.result;
      this.locationData = {
        attendenceLocationSettingsId:Res.attendenceLocationSettingsId,
        name: Res.name,
        coordinates: {
          xmin: Res.xmin,
          ymin: Res.ymin,
          xmax: Res.xmax,
          ymax: Res.ymax,
        },
        center: {
          lng: Res.longitude,
          lat: Res.latitude,
        },
      };
      // this.locationData.name = Res.name;
      this.locationName=Res.name;
      this.locationNameNew=Res.name;
      this.Loc_Latitude=Res.latitude;
      this.Loc_Longitude=Res.longitude;
      this.initialMap();
    });
  }

  initialMap() {
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Sketch',
      'esri/layers/GraphicsLayer',
      'esri/Graphic',
      'esri/widgets/Search',
      'esri/geometry/Extent',
      'esri/geometry/support/webMercatorUtils',
      'esri/intl',
    ])
      .then(
        ([
          Map,
          MapView,
          Sketch,
          GraphicsLayer,
          Graphic,
          Search,
          Extent,
          webMercatorUtils,
          intl,
        ]) => {
          intl.setLocale('ar');
          const map = new Map({
            basemap: 'hybrid',
          });

          const view = new MapView({
            container: 'viewDiv',
            map: map,
            center: [46.7115, 24.7253],
            zoom: 12,
          });
          const drawRectangleFromExtent = (
            xmin: number,
            ymin: number,
            xmax: number,
            ymax: number
          ) => {
            graphicsLayer.removeAll();
            const lowerLeft = webMercatorUtils.webMercatorToGeographic(
              new Extent({
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax,
                spatialReference: { wkid: 3857 },
              })
            );
            const rectangle = new Graphic({
              geometry: new Extent({
                xmin: lowerLeft.xmin,
                ymin: lowerLeft.ymin,
                xmax: lowerLeft.xmax,
                ymax: lowerLeft.ymax,
                spatialReference: { wkid: 4326 },
              }),
              symbol: {
                type: 'simple-fill',
                color: [0, 0, 255, 0.3],
                outline: {
                  color: [0, 0, 255, 1],
                  width: 2,
                },
              },
            });
            this.coordinates = {
              xmin: xmin,
              ymin: ymin,
              xmax: xmax,
              ymax: ymax,
            };
            this.center = {
              lng: rectangle.geometry.center.longitude,
              lat: rectangle.geometry.center.latitude,
            };
            graphicsLayer.add(rectangle);
          };

          const graphicsLayer = new GraphicsLayer();
          map.add(graphicsLayer);
          const drawRectangle = (lng: number, lat: number, size = 0.01) => {
            graphicsLayer.removeAll();
            const rectangle = new Graphic({
              geometry: new Extent({
                xmin: lng - size,
                ymin: lat - size,
                xmax: lng + size,
                ymax: lat + size,
                spatialReference: { wkid: 4326 },
              }),
              symbol: {
                type: 'simple-fill',
                color: [0, 0, 255, 0.3],
                outline: {
                  color: [0, 0, 255, 1],
                  width: 2,
                },
              },
            });
            graphicsLayer.add(rectangle);

            const lowerLeft = webMercatorUtils.geographicToWebMercator(
              new Extent({
                xmin: lng - size,
                ymin: lat - size,
                xmax: lng + size,
                ymax: lat + size,
                spatialReference: { wkid: 4326 },
              })
            );
            this.coordinates = {
              xmin: lowerLeft.xmin,
              ymin: lowerLeft.ymin,
              xmax: lowerLeft.xmax,
              ymax: lowerLeft.ymax,
            };
            this.center = {
              lng: lowerLeft.center.longitude,
              lat: lowerLeft.center.latitude,
            };
          };

          const searchWidget = new Search({
            view: view,
          });

          view.ui.add(searchWidget, {
            position: 'top-right',
          });

          this.latLonForm.nativeElement.addEventListener('submit', (e: any) => {
            const lng = +this.lng.nativeElement.value,
              lat = +this.lat.nativeElement.value;
            view.graphics.removeAll();
            view.center = [lng, lat];
            drawRectangle(lng, lat);
            e.preventDefault();
          });

          searchWidget.on('search-complete', (event: any) => {
            if (
              event.results.length > 0 &&
              event.results[0].results.length > 0
            ) {
              const searchResult = event.results[0].results[0].feature.geometry;
              drawRectangle(searchResult.longitude, searchResult.latitude);
            }
          });

          const sketch = new Sketch({
            layer: graphicsLayer,
            view: view,
            creationMode: 'update',
          });

          sketch.on('update', (event: any) => {
            if (event.state === 'complete') {
              debugger //height width
              const extent = event.graphics[0].geometry.extent;
              const { xmin, ymin, xmax, ymax } = extent;
              this.coordinates = {
                xmin,
                ymin,
                xmax,
                ymax,
              };
              this.center = {
                lng: extent.center.longitude,
                lat: extent.center.latitude,
              };
            }
          });

          if (this.locationName === 'new') {
            drawRectangle(46.7115, 24.7253);
          } else {
            view.center = [
              this.locationData.center.lng,
              this.locationData.center.lat,
            ];
            drawRectangleFromExtent(
              this.locationData.coordinates.xmin,
              this.locationData.coordinates.ymin,
              this.locationData.coordinates.xmax,
              this.locationData.coordinates.ymax
            );
          }
        }
      )
      .catch((err: any) => {
        console.error('EsriLoader: ', err);
      });
  }


  closeResult = '';
  publicData:any=null;
  open(content: any, data?: any, type?: any,idRow?:any) {
    if(type=="")
    {
     this.publicData= data;
    }
    var sizet="lg";
    sizet=type ? (type == 'delete' ? 'md' : 'xl') : 'lg';
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: sizet,
        centered: type ? (type == 'delete' ? true : false) : false,
        backdrop : 'static',
        keyboard : false
      })
      .result.then(
        (result: any) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
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


  saveLocationNew(){
    if (this.locationNameNew == null || this.locationNameNew == '') {
      this.toast.error('من فضلك أدخل أسم الموقع', 'رسالة');
      return;
    }
    this.locationData.name = this.locationNameNew;
    this.locationData.coordinates = this.coordinates;
    this.locationData.center = this.center;

    var obj :any ={};
    obj.attendenceLocationSettingsId=this.locationData.attendenceLocationSettingsId;
    obj.name=this.locationData.name;
    obj.distance =0;
    obj.latitude=this.locationData.center.lat;
    obj.longitude=this.locationData.center.lng;
    obj.xmax=this.locationData.coordinates.xmax;
    obj.xmin=this.locationData.coordinates.xmin;
    obj.ymax=this.locationData.coordinates.ymax;
    obj.ymin=this.locationData.coordinates.ymin;

    this._attLocation.SaveAttendenceLocation(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
       this.Resetdata();
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.router.navigate(['/employees/attendanceList']);
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });


  }
  locationNameNew:any="";
  saveLocation(form: NgForm) {
    if (form.value.location == null || form.value.location == '') {
      this.toast.error('من فضلك أدخل أسم الموقع', 'رسالة');
      return;
    }
    this.locationData.name = form.value.location;
    this.locationData.coordinates = this.coordinates;
    this.locationData.center = this.center;

    var obj :any ={};
    obj.attendenceLocationSettingsId=this.locationData.attendenceLocationSettingsId;
    obj.name=this.locationData.name;
    obj.distance =0;
    obj.latitude=this.locationData.center.lat;
    obj.longitude=this.locationData.center.lng;
    obj.xmax=this.locationData.coordinates.xmax;
    obj.xmin=this.locationData.coordinates.xmin;
    obj.ymax=this.locationData.coordinates.ymax;
    obj.ymin=this.locationData.coordinates.ymin;

    this._attLocation.SaveAttendenceLocation(obj).subscribe((result: any) => {
      if (result.statusCode == 200) {
       this.Resetdata();
        this.toast.success(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
        this.router.navigate(['/employees/attendanceList']);
      } else {
        this.toast.error(this.translate.instant(result.reasonPhrase),this.translate.instant('Message'));
      }
    });
  }
  Resetdata(){
    this.locationData = {
      attendenceLocationSettingsId:0,
      name: '',
      coordinates: {
        xmin: 0,
        ymin: 0,
        xmax: 0,
        ymax: 0,
      },
      center: {
        lng: 0,
        lat: 0,
      },
    };
    this.locationName="";
    this.Loc_Latitude="";
    this.Loc_Longitude="";
  }


}

