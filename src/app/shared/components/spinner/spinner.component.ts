import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'idsa-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="spinner-container">
      <p-progressSpinner
        strokeWidth="2"
        fill="transparent"
        animationDuration=".5s"
      ></p-progressSpinner>
    </div>
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(201, 198, 198, 0.5);
        z-index: 1000;
      }
    `,
  ],
})
export class SpinnerComponent {}
