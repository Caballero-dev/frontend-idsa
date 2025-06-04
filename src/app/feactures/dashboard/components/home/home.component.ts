import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FluidModule, ChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  pieData: any;
  barData: any;
  pieOptions: any;
  barOptions: any;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.pieData = {
        labels: ['Baja probabilidad', 'Probable', 'Alta probabilidad'],
        datasets: [
          {
            data: [40, 51, 60],
            backgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-500'),
              documentStyle.getPropertyValue('--p-gray-500'),
              documentStyle.getPropertyValue('--p-orange-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-400'),
              documentStyle.getPropertyValue('--p-gray-400'),
              documentStyle.getPropertyValue('--p-orange-400'),
            ],
          },
        ],
      };

      this.pieOptions = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };

      this.barData = {
        labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
        datasets: [
          {
            type: 'bar',
            label: 'Baja probabilidad',
            backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
            data: [50, 25, 12, 48, 90, 76, 42],
          },
          {
            type: 'bar',
            label: 'Probable',
            backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
            data: [21, 84, 24, 75, 37, 65, 34],
          },
          {
            type: 'bar',
            label: 'Alta probabilidad',
            backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
            data: [41, 52, 24, 74, 23, 21, 32],
          },
        ],
      };

      this.barOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
          y: {
            stacked: true,
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };
    }
  }
}
