import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  type: string = null;
  message: string = null;

  constructor(
    private authService: AuthService,
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

  ngOnInit() {}

  onSignup(form: NgForm) {
    const userName = form.value.userName;
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signupUser(email, password, userName);
  }
}
