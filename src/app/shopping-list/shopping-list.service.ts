import { DataStorageService } from './../shared/data-storage.service';
import { OnInit, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShoppingListService {
  startedEditing = new Subject<any>();
  private ingredients: Ingredient[] = [];
  ingredientsChanged = new Subject<Ingredient[]>();

  constructor(private dsService: DataStorageService) {}

  addIngredient(ingredient: Ingredient) {
    this.dsService.upLoadIngredient(ingredient);
  }

  addIngredients(ingredients: Ingredient[]) {
    for (const ingredient of ingredients) {
      this.addIngredient(ingredient);
    }
  }

  updateIngredient(key, newIngredient: Ingredient) {
    this.dsService.updateIngredient(key, newIngredient);
  }

  deleteIngredient(key) {
    this.dsService.deleteIngredient(key);
  }
}
