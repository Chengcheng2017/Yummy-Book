import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import * as firebase from 'firebase';

import { Ingredient } from './../../shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { AuthService } from './../../auth/auth.service';
import { DataStorageService } from './../../shared/data-storage.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipeRef: any;
  recipes: any = [];

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private dsService: DataStorageService,
              private authService: AuthService) {}

  ngOnInit() {
    this.route.url.subscribe(
      (value: UrlSegment[]) => {
        if (value.toString().indexOf('myrecipes') > -1) {
          const uid = firebase.auth().currentUser.uid;
          this.recipeRef = this.dsService.getUserPostsRef(uid);
        } else if (value.toString().indexOf('myfavorites') > -1) {
          const uid = firebase.auth().currentUser.uid;
          this.recipeRef = this.dsService.getUserFavoritesRef(uid);
        } else {
          this.recipeRef = firebase.database().ref('allrecipes');
        }
        this.recipeRef.on('child_added', data => {
          this.recipes.push({
            key: '/recipes/' + data.key,
            data: data.val()
          });
        });
      });
  }

  onNewRecipe() {
    this.router.navigate(['/recipes/new']);
  }

  onSubmit(form: NgForm) {
    const value = form.value.searchWord.toLowerCase();
    console.log(value);
    console.log(value.name);
    this.recipes = [];
    const ref = firebase.database().ref('allrecipes');
    ref.once('value').then(data => {
      data.forEach(item => {
        const name = item.val().name.toLowerCase();
        const description = item.val().description.toLowerCase();
        if (name.indexOf(value) > -1 || description.indexOf(value) > -1) {
          this.recipes.push({
            key: '/recipes/' + item.key,
            data: item.val()
          });
        }
      });
    });
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    this.recipeRef.off();
  }
}
