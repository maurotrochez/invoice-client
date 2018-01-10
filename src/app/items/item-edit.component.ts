import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControlName, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {GenericValidator} from '../shared/generic-validator';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemService} from './item.service';
import {IItem} from './item';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import {HttpErrorResponse} from '@angular/common/http';

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

  item: IItem;
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
      code: {
        required: 'Item code is required.',
        minLength: 'Item code must be at least three characters.',
        maxlength: 'Item code cannot exceed 50 characters.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.itemForm = this.fb.group({
      Code: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      Name: ['', [Validators.required]],
      Value: [0, [Validators.required]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        const id = params['id'];
        this.getItem(id);
      }
    );
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.itemForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.itemForm);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getItem(id: string): void {
    this.itemService.getItem(id).subscribe(
      (item: IItem) => this.onItemRetrieved(item),
      (error: any) => this.errorMessage = <any>error
    );
  }

  private onItemRetrieved(item: IItem): void {
    if (this.itemForm)
      this.itemForm.reset();
    this.item = item;

    if (!this.item.ItemId)
      this.pageTitle = 'Add item';
    else
      this.pageTitle = `Edit item: ${this.item.Code} - ${this.item.Name}`;
    this.itemForm.patchValue({
      Code: this.item.Code,
      Name: this.item.Name,
      Value: this.item.Value
    });

  }

  saveItem(): void {
    if (this.itemForm.dirty && this.itemForm.valid) {
      let t = Object.assign({}, this.item, this.itemForm.value);

      this.itemService.saveItem(t)
        .subscribe(
          (data) => {
            this.onSaveComplete();
            console.log(data);
          },
          (error: any) => {
            this.errorMessage = <any>error;
          }
        );
    } else if (!this.itemForm.dirty) {
      this.onSaveComplete();
    }
  }

  deleteItem(): void {
    if (this.item.ItemId === '0') {
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the item: ${this.item.Name}?`)) {
        this.itemService.deleteItem(this.item.ItemId)
          .subscribe(
            () => this.onSaveComplete(),
            (error: HttpErrorResponse) => {
              this.errorMessage = <any>error;
            }
          );
      }
    }
  }

  private onSaveComplete() {
    this.itemForm.reset();
    this.router.navigate(['/items']);
  }
}
