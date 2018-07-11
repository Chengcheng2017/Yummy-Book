import { Router, ActivatedRoute } from '@angular/router';
import { DataStorageService } from './../shared/data-storage.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as firebase from 'firebase';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService,
    private dsService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute) {}

  getRecipeRef(key) {
    return firebase.database().ref('/allrecipes/' + key);
  }

  addIngredientsToShoppingList(ingredients) {
    this.dsService.uploadIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.dsService.upLoadRecipe(recipe);
  }

  updateRecipe(key: any, newRecipe: Recipe, count) {
    this.dsService.updateRecipe(key, newRecipe, count);
  }

  editRecipe(key) {
    const uid = firebase.auth().currentUser.uid;
    const recipeRef = firebase.database().ref('/allrecipes/' + key);
    recipeRef.once('value', data => {
       if (data.val().uploadedBy.uid === uid) {
         this.router.navigate(['/recipes/' + key + '/edit']);
       } else {
         window.alert('You are not authorized');
       }
    });
   }

  deleteRecipe(key) {
   const uid = firebase.auth().currentUser.uid;
   const recipeRef = firebase.database().ref('/allrecipes/' + key);
   recipeRef.once('value', data => {
      if (data.val().uploadedBy.uid === uid) {
        recipeRef.remove();
        firebase.database().ref('/myrecipes/' + uid + '/' + key).remove();
        this.router.navigate(['/recipes']);
      } else {
        window.alert('You are not authorized');
      }
   });
  }

  addFavoriteRecipe(key, details) {
    this.dsService.addFavoriteRecipe(key, details);
  }

  deleteFavoriteRecipe(key, count) {
    this.dsService.deleteFavoriteRecipe(key, count);
  }
}

