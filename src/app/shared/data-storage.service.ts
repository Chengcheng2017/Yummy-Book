import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from './ingredient.model';

@Injectable()
export class DataStorageService {
  find: boolean;
  constructor(private userService: UserService,
  ) {
  }

  getUserFromDatabase(uid) {
    const ref = firebase.database().ref('users/' + uid);
    return ref.once('value')
      .then(snapshot => snapshot.val());
  }

  generateRandomName() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  upLoadRecipe(recipe) {
    const user = this.userService.getProfile();

    const newPersonalRecipeKey = firebase.database().ref().child('myrecipes').push().key;

    const details = {
      name: recipe.name,
      description: recipe.description,
      imagePath: recipe.imagePath,
      ingredients: recipe.ingredients,
      directions: recipe.directions,
      creationDate: new Date().toString(),
      uploadedBy: user,
      favoriteCount: 0
    };

    const updates = {};
    updates['/myrecipes/' + user.uid + '/' + newPersonalRecipeKey ] = details;
    updates['/allrecipes/' + newPersonalRecipeKey] = details;

    return firebase.database().ref().update(updates);
  }

  updateRecipe(key, recipe, count) {
    const user = this.userService.getProfile();

    const details = {
      name: recipe.name,
      description: recipe.description,
      imagePath: recipe.imagePath,
      ingredients: recipe.ingredients,
      directions: recipe.directions,
      creationDate: new Date().toString(),
      uploadedBy: user,
      favoriteCount: count
    };

    const updates = {};
    updates['/myrecipes/' + user.uid + '/' + key ] = details;
    updates['/allrecipes/' + key] = details;

    return firebase.database().ref().update(updates);
  }

  addFavoriteRecipe(key, details) {
    const user = this.userService.getProfile();
    const recipeOwner = details.uploadedBy;
    const updates = {};
    updates['/allrecipes/' + key + '/favoriteCount'] = details.favoriteCount;
    updates['/myrecipes/' + recipeOwner.uid + '/' + key + '/favoriteCount'] = details.favoriteCount;
    updates['/myfavorites/' + user.uid + '/' + key ] = details;

    return firebase.database().ref().update(updates);
  }

  deleteFavoriteRecipe(key, count) {
    const user = this.userService.getProfile();
    const favoriteRef = firebase.database().ref('myfavorites/' + user.uid + '/' + key);
    favoriteRef.remove();

    const updates = {};
    updates['/allrecipes/' + key + '/favoriteCount'] = count;
    updates['/myrecipes/' + user.uid + '/' + key + '/favoriteCount'] = count;

    return firebase.database().ref().update(updates);
  }

  upLoadIngredient(ingredient) {
    const user = this.userService.getProfile();

    firebase.database().ref('myshoppinglist/' + user.uid)
    .once('value').then(data => {
      const find = data.forEach(item => {
        if (item.val().name === ingredient.name) {
          const updates = {};
          const details = {
            name: ingredient.name,
            amount: ingredient.amount + item.val().amount
          };
          updates['myshoppinglist/' + user.uid + '/' + item.key] = details;
          firebase.database().ref().update(updates);
          return true;
      }});

      if (!find) {
        const updates = {};
        const details = {
          name: ingredient.name,
          amount: ingredient.amount
        };
        const newIngredientKey = firebase.database().ref().child('myshoppinglist').push().key;
        updates['myshoppinglist/' + user.uid + '/' + newIngredientKey] = details;
        firebase.database().ref().update(updates);
      }
    });
  }

  uploadIngredients(ingredients) {
    for (const ingredient of ingredients) {
      this.upLoadIngredient(ingredient);
    }
  }

  updateIngredient(key, newIngredient) {
    const user = this.userService.getProfile();
    const updates = {};
    const details = {
      name: newIngredient.name,
      amount: newIngredient.amount
    };

    updates['myshoppinglist/' + user.uid + '/' + key] = details;
    return firebase.database().ref().update(updates);
  }

  deleteIngredient(key) {
    const user = this.userService.getProfile();
    const ingredientRef = firebase.database().ref('myshoppinglist/' + user.uid + '/' + key);
    ingredientRef.remove();
  }

  getUserPostsRef(uid) {
    return firebase.database().ref('myrecipes').child(uid);
  }

  getUserFavoritesRef(uid) {
    return firebase.database().ref('myfavorites').child(uid);
  }

  handleFavoriteClicked(imageData) {
    const uid = firebase.auth().currentUser.uid;
    const updates = {};

    updates['/images/' + imageData.name + '/oldFavoriteCount'] = imageData.favoriteCount;
    updates['/images/' + imageData.name + '/favoriteCount'] = imageData.favoriteCount + 1;
    updates['/favorites/' + uid + '/' + imageData.name] = imageData;

    return firebase.database().ref().update(updates);
  }

}

