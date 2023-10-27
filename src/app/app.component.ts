import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { user } from './user';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  user: user | any;
  users: user[] = [];
  productDialog: boolean | any;
  submitted: boolean | any;
  activeIndex: any;
  roleStatus: any;
  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) { }
  //for dialog
  openNew() {
    this.user = {};
    this.submitted = false;
    this.productDialog = true;
  }

  ngOnInit() {
    this.loadUsersFromLocalStorage();
    this.roleStatus = [
      { label: 'Admin', value: 'admin' },
      { label: 'SuperAdmin', value: 'superadmin' },
      { label: 'User', value: 'user' }
    ];
  }

  // load user data from localStorage
  loadUsersFromLocalStorage() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      this.users = JSON.parse(userData);
    }
  }
  //form Data check
  isFormValid(): boolean {
    return this.user.name && this.user.email && this.user.role && this.isEmailValid(this.user.email);
  }
  // for save
  saveProduct() {
    this.submitted = true;
    if (this.isFormValid()) {
      this.users = JSON.parse(localStorage.getItem('user_data') || '[]');
      if (this.activeIndex > -1) {
        this.users[this.activeIndex] = { ...this.user };
        this.activeIndex = -1;
      } else {
        this.users.push({ ...this.user });
      }
      localStorage.setItem('user_data', JSON.stringify(this.users));
      this.hideDialog();
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Successfully Data save' });
    }
  }
  //edit
  editProduct(user: user, index: any) {
    this.activeIndex = index
    this.user = { ...user };
    this.productDialog = true;
  }
  // hide dialog
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }
  //email validation functions
  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  //delete user Data
  deleteProduct(deleteData: any, index: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + deleteData.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users.splice(index, 1);
        localStorage.setItem('user_data', JSON.stringify(this.users));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });

  }
}
