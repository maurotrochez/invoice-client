import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './item-list.component';
import {RouterModule} from '@angular/router';
import { ItemEditComponent } from './item-edit.component';
import {ItemService} from './item.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'items', component: ItemListComponent},
      {path: 'itemsEdit/:id', component: ItemEditComponent}
    ])
  ],
  declarations: [ItemListComponent, ItemEditComponent],
  providers: [ItemService]
})
export class ItemsModule { }
