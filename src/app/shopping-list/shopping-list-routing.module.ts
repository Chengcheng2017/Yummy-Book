import { Routes, RouterModule } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { NgModule } from '@angular/core';

const shoppinglistRoutes: Routes = [
    { path: '', component: ShoppingListComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(shoppinglistRoutes)
    ],
    exports: [RouterModule]
})
export class ShoppingListRoutingModule {}
