import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-BookingDetails',
  templateUrl: './BookingDetails.component.html',
  // encapsulation: ViewEncapsulation.None, //add this line
  styleUrls: ['./BookingDetails.component.css'],
})
export class BookingDetailsComponent{
  stepperOrientation: Observable<StepperOrientation>;
  form!: FormGroup;
  submitted = false;
  
  

  dataSource = [
    { theatreName: 'PVR Cinemas:PVR Gold', timings: ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '09:00 PM'] },
    { theatreName: 'Prasads Multiplex', timings: ['11:45 AM', '02:30 PM', '05:15 PM', '08:00 PM', '11:00 PM'] },
    { theatreName: 'PVR Cinemas:PVR 4DX', timings: ['09:00 AM', '12:40 PM', '04:30 PM', '06:15 PM', '10:00 PM'] },
    { theatreName: 'Inox,Dolby Atmos', timings: ['11:00 AM', '02:00 PM', '05:00 PM', '07:20 PM', '10:40 PM'] },

  ];
  selectedTiming: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    
  ) {
    
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    
  }

  
  redirectToPayment(): void {
    if (this.selectedTiming) {
      this.router.navigate(['/payment'])
      console.log('Proceed to payment for timing:', this.selectedTiming);
    } else {
      // Show an error or perform any other action if no timing is selected
      console.log('Please select a timing before proceeding to payment.');
    }
  }
  selectTiming(timing: string): void {
    this.selectedTiming = timing;
  }
  onsubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.router.navigate(['/payment']);
  }
}
