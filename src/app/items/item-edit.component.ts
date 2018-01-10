import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControlName, FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {GenericValidator} from '../shared/generic-validator';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from './item.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  pageTitle = 'Item edit';
  errorMessage: string;
  itemForm: FormGroup;

  private sub: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService) {

    // Defines all messages validation for the form
    this.validationMessages = {
      itemCode: {
        required: 'Item code is required.',
        minlength: 'Item code must be at least three characters.',
        maxlength: 'Item code cannot exceed 50 characters.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

}
