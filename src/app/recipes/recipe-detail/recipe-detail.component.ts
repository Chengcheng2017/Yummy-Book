import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as firebase from 'firebase';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { AuthGuard } from '../../auth/auth-guard.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeRef: any;
  name: string;
  description: string;
  imagePath: string;
  auth: string;
  creationDate: Date;
  ingredients: any;
  directions: string;
  uploadedBy: any;
  favoriteCount: number;
  key: any;
  status: boolean;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    this.status = false;
    this.route.params
      .subscribe(
        (params: Params) => {
          this.key = params['id'];
          this.recipeRef = this.recipeService.getRecipeRef(this.key);
          this.recipeRef.once('value', data => {
            this.name = data.val().name;
            this.description = data.val().description;
            this.imagePath = data.val().imagePath;
            this.auth = data.val().uploadedBy.name;
            this.creationDate = data.val().creationDate;
            this.ingredients = data.val().ingredients;
            this.directions = data.val().directions;
            this.uploadedBy = data.val().uploadedBy;
            this.favoriteCount = data.val().favoriteCount;
          });
      });
      const user = this.userService.getProfile();
      const ref = firebase.database().ref('myfavorites/' + user.uid);
      ref.once('value').then(data => {
        data.forEach(item => {
          if (item.key === this.key) {
            this.status = true;
            return;
          }
        });
      });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.ingredients);
    window.alert('Successfully Added to Shooping List!');
  }

  onEditRecipe() {
    if (!this.authService.isAuthenticated()) {
      window.alert('Please Login!');
    } else {
      this.recipeService.editRecipe(this.key);
    }
  }

  onDeleteRecipe() {
    if (!this.authService.isAuthenticated()) {
      window.alert('Please Login!');
    } else {
      this.recipeService.deleteRecipe(this.key);
    }
  }

  onFavoritesClicked() {
    this.status = !this.status;
    if (this.status) {
      this.favoriteCount += 1;
      const details = {
        name: this.name,
        description: this.description,
        imagePath: this.imagePath,
        ingredients: this.ingredients,
        directions: this.directions,
        creationDate: this.creationDate,
        uploadedBy: this.uploadedBy,
        favoriteCount: this.favoriteCount
      };
      this.recipeService.addFavoriteRecipe(this.key, details);
    } else {
      this.favoriteCount -= 1;
      this.recipeService.deleteFavoriteRecipe(this.key, this.favoriteCount);
    }
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}
