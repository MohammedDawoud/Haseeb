import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GroupPrivilegeService } from 'src/app/core/services/group_Services/group-privilege.service';
import { Children, Groups } from 'src/app/shared/models/groups';
import { RestApiService } from 'src/app/shared/services/api.service';
import { TreeMode } from 'tree-ngx';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  title: any = {
    main: {
      name: {
        ar: 'لوحة التحكم',
        en: 'Control Panel',
      },
      link: '/controlpanel',
    },
    sub: {
      ar: 'المجموعات ',
      en: ' Groups',
    },
  };
  options = {
    mode: TreeMode.MultiSelect,
    checkboxes: true,
    alwaysEmitSelected: false,
  };

  groupForm: FormGroup;
  privilegesForm: FormGroup;
  selectedTask1: any = '';

  lang: any = 'ar';
  nodeItems: any = [];

  selectedPermission: any = 1;
  constructor(
    private api: RestApiService,
    private modalService: NgbModal,
    private groupPrivilegeService: GroupPrivilegeService,
    private toast: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.groupForm = new FormGroup({
      GroupId: new FormControl(0),
      NameEn: new FormControl('', [Validators.required]),
      NameAr: new FormControl('', [Validators.required]),
    });
    api.lang.subscribe((res) => {
      this.lang = res;
    });
    this.privilegesForm = new FormGroup({
      groupId: new FormControl(0),
      privilegeIds: new FormControl([[]]),
    });
    this.getData();
  }
  ngOnInit(): void {
    this.loadPrivilegesTree();
    this.getGroups();
  }
  getData() {
    this.api.get('../../../../../../assets/cpanel.json').subscribe({
      next: (data: any) => {
        this.nodeItems = data.tree;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  privilegesTree: any[] = [];
  transformedArray: any[] = [];
  group: Groups[] = [];
  PrivList = [];
  AccountngxTree: any;
  AccountngxTreelist: any;
  loadPrivilegesTree() {
    this.groupPrivilegeService.getPrivilegesTree().subscribe(
      (data) => {
        // data.push(
        //   {id: "150103333553333",parent: "15",text: "المتابعة المشاريع"},
        //   {id: "1501033333333",parent: "15",text: "المتابعة المالية"},
        //   {id: "1501055555555",parent: "15",text: "المتابعة الادارية"},
        //   {id: "1501088888888",parent: "15",text: "المتابعةالاداء"},
        //   )
        // Handle the response data here
        this.privilegesTree = data;

        // Create Groups and Children arrays
        this.group = [];
        // const childrenMap: { [id: string]: Children } = {};

        // // Iterate through the API data to build the groups and children
        // this.privilegesTree.forEach(item => {
        //   if (item.parent === "#") {
        //     // Create a new Group
        //     const group: Groups = {
        //       id: item.id,
        //       name: item.text, // Set the name to the "text" value
        //       parent: item.parent,
        //       children: []
        //     };

        //     this.group.push(group);

        //     // Check if there are any children for this group
        //     if (childrenMap[item.id]) {
        //       group.children.push(childrenMap[item.id]);
        //     }
        //   } else {
        //     // Create a new Child
        //     const child: Children = {
        //       id: item.id,
        //       name: item.text, // Set the name to the "text" value
        //       item: {
        //         phrase: item.text, // Set the phrase to the "text" value
        //         id: item.id // Set the phrase to the "text" value
        //       }
        //     };

        //     // Store the child in the childrenMap for later association with a parent group
        //     childrenMap[item.parent] = child;

        //     // Check if the parent group already exists
        //     if (this.group.some(group => group.id === item.parent)) {
        //       // If it exists, add the child to the parent's children
        //       this.group.find(group => group.id === item.parent)?.children.push(child);
        //     }
        //   }
        // });

        // console.log(this.group);
        this.PrivList = JSON.parse(JSON.stringify(data));

        this.AccountngxTreelist = data;
        this.AccountngxTreelist.forEach((element: any) => {
          element.children = [];
          // if(element.id == 15011){
          //   element.text = " "
          // }
          if (element.text != null) {
            element.name = this.translate.instant(element.text);
          }
          element.item = {
            phrase: element.text,
            id: element.id,
          };
          this.AccountngxTreelist.forEach((ele: any) => {
            if (element.id == ele.parent) {
              element.isparent = true;
              element.children.push(ele);
            }
          });
        });

        const filteraccountTree = [];
        this.AccountngxTreelist.forEach((element: any) => {
          if (element.isparent == true) {
            filteraccountTree.push(element);
          }
        });
        this.AccountngxTree = [];
        this.AccountngxTreelist.forEach((element: any) => {
          if (element.parent == '#') {
            this.AccountngxTree.push(element);
          }
        });

        if (this.AccountngxTree[6].id == '17') {
          this.AccountngxTree.splice(7, 0, this.AccountngxTree.splice(6, 1)[0]);
        }
      },
      (error) => {
        // Handle any errors here
        console.error('Error fetching privileges tree:', error);
      }
    );
  }
  groupOptions: any[] = [];
  getGroups(): void {
    this.groupPrivilegeService.FillGroupsSelect().subscribe(
      (data) => {
        // Assign the API response to the jobOptions property
        this.groupOptions = data; // Replace with the actual property name
      },
      (error) => {
        // Handle any errors here
        console.error(error);
      }
    );
  }
  selectedGroupId: any;
  selectedGroupName: any = '';
  // savePrivileges(): void {
  //   this.groupPrivilegeService.saveGroupPrivileges(this.selectedGroupId, this.selectedIds)
  //     .subscribe(response => {
  //       // Handle the API response here
  //       console.log(response);
  //     }, error => {
  //       // Handle any errors here
  //       console.error(error);
  //     });
  // }

  onOptionClick() {
    // This method is called when an option is clicked
    // Update the selectedGroupId with the clicked group.id
    // this.selectedGroupId = groupId;
    console.log(
      'Setting selected , this.selectedGroupId = ' + this.selectedGroupId
    );
    this.getPrivileges();
  }
  getPrivileges() {
    // Replace 1 with the actual GroupId you want to use in the request
    const groupId = this.selectedGroupId;
    this.groupOptions.forEach((element: any) => {
      if (this.selectedGroupId == element.id) {
        this.selectedGroupName = element.name;
      }
    });
    // Call the service method to make the API request
    this.groupPrivilegeService.getPrivilegesIdsByGroupId(groupId).subscribe(
      (response) => {
        // this.group.forEach((TreeEA: any) => {
        //   if (response == TreeEA.id) {
        //     TreeEA.expanded = true
        //     TreeEA.selected = true
        //     this.selectedTask1.push(TreeEA.item)
        //   }
        // });
        this.groupPrivilegeService.getPrivilegesTree().subscribe((data) => {
          // data.push(
          //   {id: "150103333553333",parent: "15",text: "المتابعة المشاريع"},
          //   {id: "1501033333333",parent: "15",text: "المتابعة المالية"},
          //   {id: "1501055555555",parent: "15",text: "المتابعة الادارية"},
          //   {id: "1501088888888",parent: "15",text: "المتابعةالاداء"},
          //   )
          this.AccountngxTreelist = [];
          this.AccountngxTreelist = data;
          this.AccountngxTreelist.forEach((element: any) => {
            this.selectedTask1.forEach((Task1: any, index: any) => {
              if (element.id == Task1.id) {
                delete this.selectedTask1[index];
              }
            });
          });
          this.AccountngxTreelist.forEach((element: any) => {
            element.children = [];
            // if(element.id == 15011){
            //   element.text = " "
            // }
            if (element.text != null) {
              element.name = this.translate.instant(element.text);
            }
            element.item = {
              phrase: element.text,
              id: element.id,
            };
            element.selected = false;
            this.AccountngxTreelist.forEach((ele: any) => {
              if (element.id == ele.parent) {
                element.isparent = true;
                element.children.push(ele);
              }
            });
            response.forEach((TreeEA: any) => {
              if (element.id == TreeEA) {
                element.expanded = true;
                element.selected = true;
                this.selectedTask1.push(element.item);
              }
            });
          });

          const filteraccountTree = [];
          this.AccountngxTreelist.forEach((element: any) => {
            if (element.isparent == true) {
              filteraccountTree.push(element);
            }
          });
          this.AccountngxTree = [];
          this.AccountngxTreelist.forEach((element: any) => {
            if (element.parent == '#') {
              this.AccountngxTree.push(element);
            }
          });
          if (this.AccountngxTree[6].id == '17') {
            this.AccountngxTree.splice(
              7,
              0,
              this.AccountngxTree.splice(6, 1)[0]
            );
          }
        });
      },
      (error) => {
        // Handle API error here
        console.error('API error:', error);
      }
    );
  }
  getpriv(privilegeIds: any) {
    privilegeIds.forEach((element: any) => {
      this.PrivList.forEach((ngxTree: any) => {
        if (ngxTree.id == element.id) {
          if (ngxTree.parent != '#') {
            var found = [];
            found = privilegeIds.filter((x: any) => x.id == ngxTree.parent);
            if (found.length == 0) {
              privilegeIds.push({ id: ngxTree.parent });
              this.getpriv(privilegeIds);
            }
          }
        }
      });
    });
  }
  async savePrivileges(
    groupId: number = this.selectedGroupId,
    privilegeIds: any[] = this.selectedTask1
  ) {
    await this.getpriv(privilegeIds);

    const AccountTree: any = [];
    privilegeIds.forEach((element: any) => {
      AccountTree.push(Number(element.id));
    });
    this.groupPrivilegeService
      .saveGroupUsersPrivileges(groupId, AccountTree)
      .subscribe((response) => {});
    this.groupPrivilegeService
      .saveGroupPrivileges(groupId, AccountTree)
      .subscribe(
        (response) => {
          if (response.statusCode == 200) {
            this.toast.success(
              this.translate.instant(response.reasonPhrase),
              this.translate.instant('Message')
            );
          } else {
            this.toast.error(
              this.translate.instant(response.reasonPhrase),
              this.translate.instant('Message')
            );
          }
        },
        (error) => {
          // Handle errors
          console.error('API Error:', error);
        }
      );
  }
  /**
   * Calls the saveGroup service to save a group.
   */
  saveGroup(modal: any) {
    const groupData = {
      GroupId: '0',
      NameAr: this.groupForm.get('NameAr')?.value,
      NameEn: this.groupForm.get('NameEn')?.value,
    };

    this.groupPrivilegeService.saveGroup(groupData).subscribe((response) => {
      // Handle the API response here
      this.getGroups();
      modal.dismiss();
    });
  }

  open(content: any, data: any, size: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: size,
        centered: true,
      })
      .result.then(
        (result) => {
          this.groupForm.get('NameAr')?.setValue(null);
          this.groupForm.get('NameEn')?.setValue(null);
          this.groupForm.get('GroupId')?.setValue(null);
        },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  selectedIds: number[] = [];

  selectTask() {
    console.log('this.selectedTask1');
    console.log(this.selectedTask1);

    this.selectedTask1.forEach((item: { id: number }) => {
      this.selectedIds.push(item.id);
    });
    this.privilegesForm.controls['privilegeIds'].setValue(this.selectedIds);
    console.log(this.selectedIds);
  }

  // selectTask(selectedItems: any[]) {
  //   console.log("Selected IDs:");
  //   for (const item of selectedItems) {
  //     console.log(item.id);
  //   }
  // }
}
