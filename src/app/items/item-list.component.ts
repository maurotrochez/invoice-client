import {Component, OnInit} from '@angular/core';
import {IItem} from './item';
import {ItemService} from './item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  pageTitle = 'Item list';
  items: IItem[];
  errorMessage: string;

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.getItems().subscribe(
      data => this.items = data,
      error => this.errorMessage = error
    );
  }

}
