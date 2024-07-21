import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { RestApiService } from 'src/app/shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-electronic-services',
  templateUrl: './electronic-services.component.html',
  styleUrls: ['./electronic-services.component.scss'],
})
export class ElectronicServicesComponent implements OnInit {
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId!: string;
  public errors: WebcamInitError[] = [];

  public webcamImage: WebcamImage | any;

  private trigger: Subject<void> = new Subject<void>();

  private nextWebcam: Subject<any> = new Subject<any>();

  qrCodeCheckValue: string;

  constructor(private translate: TranslateService
    ,private authenticationService: AuthenticationService
    ,private api: RestApiService
    ) {
    this.authenticationService.allowWithoutToken = "allowWithoutToken";
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
  }
  OrganizationData :any;
  environmentPho: any;
  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
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
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  refreshQrCode() {
    this.qrCodeCheckValue = Math.floor(1000 + Math.random() * 9000).toString();
  }

  check(data: any) {
    console.log(data);
  }

  share(data: any) {
    console.log(data);
  }
}
