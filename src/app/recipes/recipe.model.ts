import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public directions: string;
  public ingredients: Ingredient[];

  constructor(name: string, desc: string, imagePath: string, directions: string, ingredients: Ingredient[]) {
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.directions = directions;
    this.ingredients = ingredients;
  }
}
