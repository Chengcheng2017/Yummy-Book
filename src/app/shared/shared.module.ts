import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownDirective } from './dropdown.directive';
import { NotificationService } from './notification.service';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    DropdownDirective
  ],
  exports: [
    CommonModule,
    DropdownDirective
  ],
  providers: [
    NotificationService,
    UserService
  ]
})
export class SharedModule {}
