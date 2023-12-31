import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css'],
})
export class PaymentMethodComponent implements OnInit {
  stepperOrientation: Observable<StepperOrientation>;
  form: FormGroup;
  submitted = false;
  cartService: CartService;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    cartService: CartService
  ) {
    this.cartService = cartService;
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.form = this.formBuilder.group({
      paymentMethod: ['',Validators.required],
      cardNumber: ['',[Validators.required, Validators.pattern(/^\d{16}$/)]],
      Cvv: ['',[Validators.required, Validators.pattern(/^\d{3,4}$/)] ],
      Expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      Name: ['',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      upiId: ['',[Validators.required, Validators.pattern(/^[\w.@-]+$/)]],
      Giftcard:['',[Validators.required, Validators.pattern(/^d{10}$/)]],
    });
  }

  ngOnInit(): void {
    this.cartService.currentCart.subscribe((x) => {
      this.form.patchValue({ paymentMethod: x.paymentMethod });
    });
  }

  back() {
    this.router.navigate(['/booking']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      return;
    }

    const { paymentMethod } = this.form.controls;
    this.cartService.savePaymentMethod(paymentMethod.value);
    this.router.navigate(['/place-order']);
  }

  goPlaceOrder() {
    if (this.form.invalid) {
      alert('Form is invalid. Please check the fields.');
      return
      ;
    }

    const { paymentMethod } = this.form.controls;
    if (paymentMethod.value === 'Giftcard' || paymentMethod.value === 'CreditDebitCard' || paymentMethod.value === 'UPI') {
      this.router.navigate(['/place-order']);
    } else {
      this.router.navigate(['/booking']);
    }
  }
}
