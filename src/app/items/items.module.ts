import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './item-list.component';
import {RouterModule} from '@angular/router';
import { ItemEditComponent } from './item-edit.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'items', component: ItemListComponent}
    ])
  ],
  declarations: [ItemListComponent, ItemEditComponent]
})
export class ItemsModule { }
