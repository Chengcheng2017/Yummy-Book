import { NotificationService } from './../../shared/notification.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  type: string = null;
  message: string = null;

  constructor(private authService: AuthService,
    private notificationService: NotificationService) {
    notificationService.emmitter.subscribe(data => {
      this.type = data.type;
      this.message = data.message;
      this.reset();
    });
  }

  reset() {
    setTimeout(() => {
      this.type = null;
      this.message = null;
    }, 6000);
   }

  ngOnInit() {
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signinUser(email, password);
  }

}
