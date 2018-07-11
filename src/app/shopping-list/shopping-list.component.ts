import { Subscription } from 'rxjs/Subscription';
import { DataStorageService } from './../shared/data-storage.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { slideIn } from '../shared/animations';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [
    slideIn
  ]
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  slRef: any;
  ingredients: any = [];
  private subscription: Subscription;

  constructor(private slService: ShoppingListService,
    private dsService: DataStorageService,
    private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      const uid = firebase.auth().currentUser.uid;
      this.slRef = firebase.database().ref('myshoppinglist').child(uid);
      this.slRef.on('child_added', data =>  {
          this.ingredients.push({
            key: data.key,
            name: data.val().name,
            amount: data.val().amount
          });
      });

    this.slRef.on('child_changed', data => {
      this.ingredients.forEach((item, index) => {
        if (item.key === data.key) {
          this.ingredients[index].name = data.val().name;
          this.ingredients[index].amount = data.val().amount;
        }
      });
    });

    this.slRef.on('child_removed', data =>  {
      this.ingredients.forEach((item, index) => {
        if (item.key === data.key) {
          this.ingredients.splice(index, 1);
        }
      });
    });
  }
}

  onEditItem(key) {
    this.slService.startedEditing.next(key);
  }

  ngOnDestroy() {
    if (this.slRef) {
      this.slRef.off();
    }
  }
}
