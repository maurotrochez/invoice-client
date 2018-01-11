import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {GenericValidator} from '../shared/generic-validator';
import {FormBuilder, FormControl, FormControlName, FormGroup, Validators} from '@angular/forms';
import {IInvoice} from './invoice';
import {ActivatedRoute, Router} from '@angular/router';
import {InvoiceService} from './invoice.service';
import {Observable} from 'rxjs/Observable';
import {IItem} from '../items/item';
import {HttpErrorResponse} from '@angular/common/http';
import {ItemService} from '../items/item.service';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  pageTitle = 'Invoice edit';
  errorMessage: string;
  invoiceForm: FormGroup;

  invoice: IInvoice;
  items: IItem[] = [];
  private sub: Subscription;

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private invoiceService: InvoiceService,
              private itemService: ItemService) {
    // Defines all messages validation for the form
    this.validationMessages = {
      consecutive: {
        required: 'Consecutive is required.',
        minLength: 'Consecutive must be at least three characters.',
        maxlength: 'Consecutive cannot exceed 50 characters.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.getItems();
    this.invoiceForm = this.fb.group({
      Consecutive: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      Total: ['', [Validators.required]],
      ItemId: new FormControl(this.items)
    });

    this.sub = this.route.params.subscribe(
      params => {
        const id = params['id'];
        this.getInvoice(id);
      }
    );
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.invoiceForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.invoiceForm);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getInvoice(id: string): void {
    this.invoiceService.getInvoice(id).subscribe(
      (invoice: IInvoice) => this.onInvoiceRetrieved(invoice),
      (error: any) => this.errorMessage = <any>error
    );
  }

  private onInvoiceRetrieved(invoice: IInvoice): void {
    if (this.invoiceForm)
      this.invoiceForm.reset();
    this.invoice = invoice;

    if (this.invoice.InvoiceId === '0')
      this.pageTitle = 'Add invoice';
    else
      this.pageTitle = `Edit invoice: ${this.invoice.Consecutive}`;
    this.invoiceForm.patchValue({
      Consecutive: this.invoice.Consecutive,
      Total: this.invoice.Total,
      Items: []
    });
  }

  saveInvoice(): void {
    if (this.invoiceForm.dirty && this.invoiceForm.valid) {
      let t = Object.assign({}, this.invoice, this.invoiceForm.value);

      this.invoiceService.saveInvoice(t)
        .subscribe(
          (data) => {
            this.onSaveComplete();
            console.log(data);
          },
          (error: any) => {
            this.errorMessage = <any>error;
          }
        );
    } else if (!this.invoiceForm.dirty) {
      this.onSaveComplete();
    }
  }

  deleteInvoice(): void {
    if (this.invoice.InvoiceId === '0') {
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the invoice: ${this.invoice.Consecutive}?`)) {
        this.invoiceService.deleteInvoice(this.invoice.InvoiceId)
          .subscribe(
            () => this.onSaveComplete(),
            (error: HttpErrorResponse) => {
              this.errorMessage = <any>error;
            }
          );
      }
    }
  }

  assignValue(value: number) {
    console.log(value);
  }

  private onSaveComplete() {
    this.invoiceForm.reset();
    this.router.navigate(['/invoices']);
  }

  private getItems() {
    this.itemService.getItems().subscribe(
      (data: IItem[]) => this.items = data,
      (error: any) => this.errorMessage = <any>error
    );
  }
}
