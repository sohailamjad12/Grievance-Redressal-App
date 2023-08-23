import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../modules/user-modules/services/user.service';
import { AuthService } from '../core';
import { ToastrServiceService } from '../shared/services/toastr/toastr.service';
import { getRole } from 'src/app/shared';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  userForm: FormGroup
  isUsertable: boolean = true;
  optionList: any[] = ['Active', 'Inactive']
  roleList: any[] = ['Nodal Officer', 'Secreatory', 'Admin']
  editDataObject: any;
  isEditData:boolean = false;
  userId: string;
  userDetails: any = {};

  constructor(private router: Router,
    private route: ActivatedRoute, private userService: UserService, private authService: AuthService, private toastrService: ToastrServiceService) {
    this.userForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', Validators.required),
      // role: new FormControl('', Validators.required),
      // activeStatus: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    this.userId = userData.userRepresentation.id;
    console.log(this.userId);
    console.log(this.authService.getUserData());
    if(this.userId) {
      this.getUserDetails();
    }
    //Implement logic to fecth user deatils and bind them in UI
  }

  getUserDetails() {
    this.userService.getUserDetails(this.userId).subscribe({
      next: (res) => {
        this.userDetails = res.responseData;
        if(this.userDetails) {
          console.log(this.userDetails);
          this.setUserFormData();
        }
      },
      error: (err)=> {
        this.toastrService.showToastr(err, 'Error', 'error', '');
      }
    })
  }

  setUserFormData() {
    this.userForm.setValue({
      firstName: this.userDetails?.firstName,
      lastName: this.userDetails?.lastName,
      emailId: this.userDetails?.email,
      phoneNumber: this.userDetails?.attributes.phoneNumber[0],
      // role: this.userDetails?.attributes.Role[0],
      // activeStatus: this.userDetails?.enabled === true? 'Active' : 'Inactive'
    })
  }

  get firstName() {
    return this.userForm.get('firstName')
  }
  get lastName() {
    return this.userForm.get('lastName')
  }

  get emailId() {
    return this.userForm.get('emailId')
  }

  get phoneNumber() {
    return this.userForm.get('phoneNumber')
  }


  addUserFn() {
    this.isUsertable = false;
  }
  navigateToHome() {
    this.router.navigate(['home'])
  }

  onClickEdit(){
    this.isEditData = true;
  }

  onClickCancel(){
    this.isEditData = false;
  }

  getUserRole(roleName: string) {
    return getRole(roleName);
   }

  onSubmit() {
    console.log(this.userForm.value);
    const updateUserRequest = {
      userName: this.userDetails.id,
      request: {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.emailId,
      attributes: {
        phoneNumber: this.userForm.value.phoneNumber
      }
      }
    }
    this.userService.updateUser(updateUserRequest).subscribe({
      next:(res) => {
        console.log(res);
        this.toastrService.showToastr('User details updated successfully', 'Success', 'success', '');
        // this.userDetails = res.responseData;
        // getUserDetails(this.userId);
      },
      error: (err) => {
        this.toastrService.showToastr(err, 'Error', 'error', '');
      }
    })
  }

  goToHome() {
    this.router.navigate(['/']);
  }


}
