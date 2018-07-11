import { OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';

import { UserService } from './../shared/user.service';
import { NotificationService } from '../shared/notification.service';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable()
export class AuthService implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router,
    private notificationService: NotificationService,
    private dataStorageService: DataStorageService,
    private userService: UserService) {}

  ngOnInit() {
    firebase.auth().onAuthStateChanged(userData => {
      if (userData && userData.emailVerified) {
        this.isLoggedIn = true;
        const user = this.userService.getProfile();
      } else {
        this.isLoggedIn = false;
      }
    });
  }


  signupUser(email: string, password: string, userName: string) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {
        userData.sendEmailVerification();

        const message = `A verification email has been sent to ${email}. kindly check your inbox and follow the steps
         in the verification email. Once verification is complete, please login to the application`;
        this.notificationService.display('success', message);

        return firebase
          .database()
          .ref('users/' + userData.uid)
          .set({
            email: email,
            uid: userData.uid,
            registDate: new Date().toString(),
            name: userName
          })
          .then(() => {
            firebase.auth().signOut();
          });
      })
      .catch(error => this.notificationService.display('error', error.message));
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userData => {
        if (userData.emailVerified) {
          return this.dataStorageService.getUserFromDatabase(userData.uid);
        } else {
          const message = 'You email is not yet verified';
          this.notificationService.display('error', message);
          firebase.auth().signOut();
        }
      })
      .then(userDataFromDataBase => {
          if (userDataFromDataBase) {
            this.userService.set(userDataFromDataBase);
            this.router.navigate(['/']);
            this.isLoggedIn = true;
          }
      })
      .catch(error => this.notificationService.display('error', error.message));
  }

  logout() {
    firebase.auth().signOut()
    .then(() => {
      this.userService.destroy();
      this.isLoggedIn = false;
   });
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }
}
