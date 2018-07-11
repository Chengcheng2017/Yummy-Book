import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import * as firebase from 'firebase';

import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  name: string = null;

  constructor(private authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.userService.statusChange.subscribe(userData => {
      if (userData) {
        this.name = userData.name;
      } else {
        this.name = null;
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}
