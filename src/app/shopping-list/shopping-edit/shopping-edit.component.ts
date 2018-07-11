import { UserService } from './../../shared/user.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemKey: any;

  constructor(private slService: ShoppingListService,
  private userService: UserService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing
      .subscribe(
        (key: any) => {
          this.editedItemKey = key;
          this.editMode = true;

          const user = this.userService.getProfile();
          const ref = firebase.database().ref('myshoppinglist/' + user.uid + '/' + key);
          ref.once('value')
            .then(data => {
              this.slForm.setValue({
                name: data.val().name,
                amount: data.val().amount
            });
          });
        }
      );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editedItemKey, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemKey);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
