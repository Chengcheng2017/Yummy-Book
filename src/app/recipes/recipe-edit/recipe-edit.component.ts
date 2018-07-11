import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import * as firebase from 'firebase';

import { RecipeService } from '../recipe.service';
import { slideIn } from '../../shared/animations';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
  animations: [
    slideIn
  ]
})
export class RecipeEditComponent implements OnInit {
  key: any;
  editMode = false;
  recipeForm: FormGroup;
  favoriteCount: number;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.key = params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.key, this.recipeForm.value, this.favoriteCount);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm() {
    if (!this.editMode) {
      const recipeIngredients = new FormArray([]);
      this.recipeForm = new FormGroup({
        name: new FormControl('', Validators.required),
        imagePath: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        directions: new FormControl('', Validators.required),
        ingredients: recipeIngredients
      });
    } else {
      const ref = firebase.database().ref('/allrecipes/' + this.key);
      ref.once('value').then(data => {
        const recipeName = data.val().name;
        const recipeDescription = data.val().description;
        const recipeImagePath = data.val().imagePath;
        const recipeDirections = data.val().directions;
        const recipeIngredients = new FormArray([]);
        this.favoriteCount = data.val().favoriteCount;

        if (data.val().ingredients) {
          for (const ingredient of data.val().ingredients) {
            recipeIngredients.push(
              new FormGroup({
                name: new FormControl(ingredient.name, Validators.required),
                amount: new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            );
          }
        }

        this.recipeForm = new FormGroup({
          name: new FormControl(recipeName, Validators.required),
          imagePath: new FormControl(recipeImagePath, Validators.required),
          description: new FormControl(recipeDescription, Validators.required),
          directions: new FormControl(recipeDirections, Validators.required),
          ingredients: recipeIngredients
        });
      });
    }
  }

}
