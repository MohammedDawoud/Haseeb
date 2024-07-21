import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminProfileService } from 'src/app/core/services/admin_profile_Services/admin-profile.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { emailMatchValidator } from 'src/app/core/services/shared.service';
import { environment } from 'src/environments/environment';
import { RestApiService } from 'src/app/shared/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
})
export class AdminProfileComponent implements OnInit {
  fileName = '';
  file: any;
  userValue: string = '';
  userInfo: any;
  closeResult: any;
  userG: any = {};
  imageQrUrl: string;
  userData: any; // Define a variable to store user data
  userForm: FormGroup;
  lang: any = 'ar';
  constructor(private modalService: NgbModal, private authenticationService: AuthenticationService, private adminProfileService: AdminProfileService,
    private toast: ToastrService,
    private api: RestApiService,
    private translate: TranslateService,
    private fb: FormBuilder) {
    this.userValue = 'Initial Value';
    this.userG = this.authenticationService.userGlobalObj;
    console.log(this.userG);
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.userForm = new FormGroup({
      UserId: new FormControl(0),
      FullName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      FullNameAr: new FormControl('', [Validators.required, Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$')]),
      FullNameEn: new FormControl(''),
      jobName: new FormControl(''),
      JobId: new FormControl([null, Validators.required]),
      DepartmentId: new FormControl([null, Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Mobile: new FormControl('', [
        Validators.required
      ]),
      GroupId: new FormControl([null, Validators.required]),
      BranchId: new FormControl([null, Validators.required]),
      EmpId: new FormControl(0),
      UserName: new FormControl('', [Validators.required]),
      Password: new FormControl(['']),
      Session: new FormControl(['', [Validators.required, Validators.min(1), Validators.max(20)]]),
      ImgUrl: new FormControl(''),
      StampUrl: new FormControl(''),
      qrCodeUrl: new FormControl(''),
      SupEngineerName: new FormControl('', [Validators.required, Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]+$')]),
      SupEngineerCert: new FormControl(['']),
      SupEngineerNationalId: new FormControl(['']),
      AppearWelcome: new FormControl(0),
      AppearInInvoicePrint: new FormControl(0),
      Status: new FormControl([1]),
      ExpireDate: new FormControl(['']),
      BranchesList: new FormControl(null),
    },
      { validators: emailMatchValidator }); // Use the custom validator at the form group level
  }
  environmenturl: any;


  ngOnInit(): void {
    this.GenerateUserQR();
    this.getUserById();
    this.environmenturl = environment.PhotoURL;
  }
  updateAppActiveStatus(val: any) {
    // Call the updateAppActiveStatus method from your service
    this.adminProfileService.updateAppActiveStatus(this.userG.userId, val.checked).subscribe(
      (response) => {
        // Handle the API response here
        console.log('User Updated:', response);
      },
      (error) => {
        // Handle any errors here
        console.error('API Error:', error);
      }
    );
  }

  saveUserProfile(): void {
    if (this.userForm.controls['AppearInInvoicePrint'].value == true) { this.userForm.controls['AppearInInvoicePrint'].setValue("1") } else { this.userForm.controls['AppearInInvoicePrint'].setValue("0") }
    if (this.userForm.controls['AppearWelcome'].value == true) { this.userForm.controls['AppearWelcome'].setValue("1") } else { this.userForm.controls['AppearWelcome'].setValue("0") }

    const userData = this.userForm.value;
    delete userData.ImgUrl
    delete userData.StampUrl
    const formData = new FormData();

    formData.append('UserId', this.userForm.controls['UserId'].value);
    formData.append('FullName', this.userForm.controls['FullName'].value);
    formData.append('FullNameAr', this.userForm.controls['FullNameAr'].value);
    formData.append('FullNameEn', this.userForm.controls['FullNameEn'].value);
    formData.append('jobName', this.userForm.controls['jobName'].value);
    formData.append('JobId', this.userForm.controls['JobId'].value);
    formData.append('DepartmentId', this.userForm.controls['DepartmentId'].value);
    formData.append('Email', this.userForm.controls['Email'].value);
    formData.append('Mobile', this.userForm.controls['Mobile'].value);
    formData.append('GroupId', this.userForm.controls['GroupId'].value);
    formData.append('BranchId', this.userForm.controls['BranchId'].value);
    formData.append('EmpId', this.userForm.controls['EmpId'].value ?? 0);
    formData.append('UserName', this.userForm.controls['UserName'].value);
    formData.append('Password', this.userForm.controls['Password'].value);
    formData.append('Session', this.userForm.controls['Session'].value);
    formData.append('qrCodeUrl', this.userForm.controls['qrCodeUrl'].value);
    formData.append('SupEngineerName', this.userForm.controls['SupEngineerName'].value);
    formData.append('SupEngineerCert', this.userForm.controls['SupEngineerCert'].value);
    formData.append('SupEngineerNationalId', this.userForm.controls['SupEngineerNationalId'].value);
    formData.append('AppearWelcome', this.userForm.controls['AppearWelcome'].value);
    formData.append('AppearInInvoicePrint', this.userForm.controls['AppearInInvoicePrint'].value);
    formData.append('Status', this.userForm.controls['Status'].value);
    formData.append('ExpireDate', this.userForm.controls['ExpireDate'].value);
    // formData.append('BranchesList',  this.userForm.controls['BranchesList'].value??[]);

    let url = document.location.href;
    var link = url.replace("dash/admin-profile", "auth/reset-password");
    formData.append('Link', link);

    this.adminProfileService.saveUserProfile(formData)
      .subscribe(
        (response) => {
          console.log('API response:', response);
          // Handle the API response as needed
          this.saveImg()
          this.getUserById();
          this.toast.success(this.translate.instant(response.reasonPhrase), this.translate.instant('Message'));
        },
        (error) => {
          console.error('API error:', error);
          this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
          // Handle errors
        }
      );
  }
  save(form: NgForm): void {
    if (form.valid && form.value.phone === form.value.confirmPhone) {
      // Form is valid, and "Phone" and "Confirm Phone" values match
      // You can handle form submission here, e.g., make an API request
      this.userForm.controls['Mobile'].setValue(form.value.phone);
      console.log('Form submitted', form.value.phone);
    } else {
      // Form is invalid or "Phone" and "Confirm Phone" values don't match
      console.error('Form submission failed');
    }
  }
  saveEmail(form: NgForm): void {
    if (form.valid && form.value.email === form.value.confirmEmail) {
      // Form is valid, and "Email" and "Confirm Email" values match
      // You can handle form submission here, e.g., make an API request
      this.userForm.controls['Email'].setValue(form.value.email);

      console.log('Form submitted', form.value.email);
    } else {
      // Form is invalid or "Email" and "Confirm Email" values don't match
      console.error('Form submission failed');
    }
  }

  savePassword(form: NgForm, modal: any): void {
    if (form.valid && form.value.password === form.value.confirmPassword) {
      // Form is valid, and "Password" and "Confirm Password" values match
      // You can handle form submission here, e.g., make an API request
      this.userForm.controls['Password'].setValue(form.value.password);
      const prames = {
        UserId: this.userForm.controls['UserId'].value,
        FullName: this.userForm.controls['FullName'].value,
        FullNameAr: this.userForm.controls['FullNameAr'].value,
        FullNameEn: this.userForm.controls['FullNameEn'].value,
        jobName: this.userForm.controls['jobName'].value,
        JobId: this.userForm.controls['JobId'].value,
        DepartmentId: this.userForm.controls['DepartmentId'].value,
        Email: this.userForm.controls['Email'].value,
        Mobile: this.userForm.controls['Mobile'].value,
        GroupId: this.userForm.controls['GroupId'].value,
        BranchId: this.userForm.controls['BranchId'].value,
        EmpId: this.userForm.controls['EmpId'].value ?? 0,
        UserName: this.userForm.controls['UserName'].value,
        Password: this.userForm.controls['Password'].value,
        Session: this.userForm.controls['Session'].value,
        qrCodeUrl: this.userForm.controls['qrCodeUrl'].value,
        SupEngineerName: this.userForm.controls['SupEngineerName'].value,
        SupEngineerCert: this.userForm.controls['SupEngineerCert'].value,
        SupEngineerNationalId: this.userForm.controls['SupEngineerNationalId'].value,
        Status: this.userForm.controls['Status'].value,
        ExpireDate: this.userForm.controls['ExpireDate'].value,
      }
      this.adminProfileService.ChangePassword(prames)
        .subscribe(
          (response) => {
            this.saveUserProfile();
            modal.dismiss()
            this.toast.success(this.translate.instant(response.reasonPhrase), this.translate.instant('Message'));
          },
          (error) => {
            console.error('API error:', error);
            this.toast.error(this.translate.instant(error.reasonPhrase), this.translate.instant('Message'));
          }
        );
    } else {
      // Form is invalid or "Password" and "Confirm Password" values don't match
      console.error('Form submission failed');
    }
  }
  GenerateUserQR() {
    this.adminProfileService.GenerateUserQR().subscribe((data) => { });
  }
  getUserById() {// Example: Fetch user data for user ID 7
    this.adminProfileService.getUserById(this.userG.userId).subscribe((data) => {

      this.userData = data.result;
      console.log('User data:', this.userData);

      this.userForm.controls['UserId'].setValue(data?.result?.userId);
      this.userForm.controls['FullNameAr'].setValue(data?.result?.fullNameAr);
      this.userForm.controls['FullNameEn'].setValue(data?.result?.fullNameEn);
      this.userForm.controls['jobName'].setValue(data?.result?.jobName);

      this.userForm.controls['FullName'].setValue(data?.result?.fullNameEn);
      // this.userForm.controls['JobId:'].setValue(data?.result?.jobId);
      this.userForm.get('JobId')?.setValue(1);

      this.userForm.controls['DepartmentId'].setValue(data?.result?.departmentId);
      this.userForm.controls['Email'].setValue(data?.result?.email);
      this.userForm.controls['GroupId'].setValue(data?.result?.groupId);
      // this.userForm.controls['BranchId'].setValue(data?.result?.branchId);
      this.userForm.controls['BranchId'].setValue(data?.result?.branchId);

      this.userForm.controls['EmpId'].setValue(data?.result?.empId);
      this.userForm.controls['Mobile'].setValue(data?.result?.mobile);
      this.userForm.controls['UserName'].setValue(data?.result?.userName);
      // this.userValue = data?.result?.userName;
      this.userForm.controls['Password'].setValue(data?.result?.password);
      this.userForm.get('Session')?.setValue(data?.result?.session);
      this.userForm.controls['SupEngineerName'].setValue(data?.result?.supEngineerName);
      this.userForm.controls['SupEngineerCert'].setValue(data?.result?.supEngineerCert);
      this.userForm.controls['SupEngineerNationalId'].setValue(data?.result?.supEngineerNationalId);
      this.userForm.controls['Status'].setValue(data?.result?.status);
      this.userForm.controls['ExpireDate'].setValue(data?.result?.expireDate);
      if(data?.result?.imgUrl == (null||'')){
        this.userForm.controls['ImgUrl'].setValue('');
      }else{
        this.userForm.controls['ImgUrl'].setValue(this.environmenturl+data?.result?.imgUrl);
      }
      // this.userForm.controls['ImgUrl'].setValue(this.environmenturl+data?.result?.imgUrl);
      if(data?.result?.stampUrl == (null||'')){
        this.userForm.controls['StampUrl'].setValue('');
      }else{
        this.userForm.controls['StampUrl'].setValue(this.environmenturl+data?.result?.stampUrl);
      }
      // this.userForm.controls['StampUrl'].setValue(this.environmenturl+data?.result?.stampUrl);
      if(data?.result?.qrCodeUrl == (null||'')){
        this.userForm.controls['qrCodeUrl'].setValue('');
      }else{
        this.userForm.controls['qrCodeUrl'].setValue(this.environmenturl+data?.result?.qrCodeUrl);
      }
      // this.userForm.controls['qrCodeUrl'].setValue(this.environmenturl+data?.result?.qrCodeUrl);

      this.imageQrUrl = data?.result?.qrCodeUrl;
      if (data?.result?.appearWelcome == 0) { this.userForm.controls['AppearWelcome'].setValue(false) } else { this.userForm.controls['AppearWelcome'].setValue(true) }
      if (data?.result?.appearInInvoicePrint == 0) { this.userForm.controls['AppearInInvoicePrint'].setValue(false) } else { this.userForm.controls['AppearInInvoicePrint'].setValue(true) }

    });
  }

  imagePath: any
  selectedFiles?: FileList;
  currentFile?: File;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.userForm.controls['ImgUrl'].setValue(null)
    }
  }
  imagePathStampUrl: any
  selectedFilesStampUrl?: FileList;
  currentFileStampUrl?: File;
  selectFileStampUrl(event: any): void {
    this.selectedFilesStampUrl = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePathStampUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      this.userForm.controls['StampUrl'].setValue(null)

    }
  }
  saveImg() {
    if (this.selectedFiles) {
      const formData = new FormData();
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;
        formData.append('UploadedFile', this.currentFile);
        formData.append('imgUrl', this.currentFile);
      }
      else {
        this.currentFile = undefined;
      }
      formData.append('UserId', this.userForm.controls['UserId'].value);

      this.adminProfileService.ChangeUserImage(formData).subscribe(
        (response) => {
        },
        (error) => {

        }
      );
    }

    if (this.selectedFilesStampUrl) {
      const formData2 = new FormData();
      const file: File | null = this.selectedFilesStampUrl.item(0);

      if (file) {
        this.currentFileStampUrl = file;
        formData2.append('UploadedFile2', this.currentFileStampUrl);
        formData2.append('StampUrl', this.currentFileStampUrl);
      }
      else {
        this.currentFileStampUrl = undefined;
      }
      formData2.append('UserId', this.userForm.controls['UserId'].value);

      this.adminProfileService.ChangeStampImage(formData2).subscribe(
        (response) => {
        },
        (error) => {

        }
      );
    }
  }
  // updateAppearWelcome(val: any) {
  //   if (val.checked == true) { this.userForm.controls['AppearWelcome'].setValue(true) } else { this.userForm.controls['AppearWelcome'].setValue(false) }
  // }
  // updateAppearInInvoicePrint(val: any) {
  //   if (val.checked == true) { this.userForm.controls['AppearInInvoicePrint'].setValue(true) } else { this.userForm.controls['AppearInInvoicePrint'].setValue(false) }
  // }
  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        animation: true,
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed  `;
        }
      );
  }

  changeInfo(data: any) {
    console.log(data);
  }

  setFile(event: any) {
    this.file = event?.target?.files[0];
    this.fileName = this.file?.name;
    console.log(this.file);
  }

  changeImage() {
    console.log(this.file);
  }
  openModal(content: any, type?: any, size?: any, position?: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size ? size : 'md',
        centered: !position ? true : false,
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
}
