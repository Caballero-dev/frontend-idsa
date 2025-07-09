import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ChartModule } from 'primeng/chart';
import { FluidModule } from 'primeng/fluid';
import { MessageService } from 'primeng/api';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { ReportService } from '../../../../shared/reports/services/report.service';
import { ReportSummaryResponse } from '../../../../shared/reports/model/report-summary.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FluidModule, ChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  private reportService: ReportService = inject(ReportService);
  private messageService: MessageService = inject(MessageService);
  private platformId = inject(PLATFORM_ID);

  isLoading: boolean = false;
  isLoadingPie: boolean = false;

  reportSummary!: ReportSummaryResponse;

  pieData: any;
  pieOptions: any;

  ngOnInit() {
    this.loadReportSummary();
    this.initCharts();
  }

  loadReportSummary() {
    this.isLoading = true;
    this.isLoadingPie = true;
    this.reportService.getReportSummary().subscribe({
      next: (response: ApiResponse<ReportSummaryResponse>) => {
        this.reportSummary = response.data;
        this.isLoading = false;
        this.initPieData();
        this.isLoadingPie = false;
      },
      error: (error: ApiError) => {
        if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.isLoading = false;
        this.isLoadingPie = false;
      },
    });
  }

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      this.initPieOptions();
    }
  }

  initPieData() {
    if (!this.reportSummary) {
      this.pieData = {};
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    this.pieData = {
      labels: ['Probabilidad Baja', 'Probabilidad Media', 'Probabilidad Alta', 'Sin evaluación'],
      datasets: [
        {
          data: [
            this.reportSummary.studentsWithLowProbability,
            this.reportSummary.studentsWithMediumProbability,
            this.reportSummary.studentsWithHighProbability,
            this.reportSummary.studentsWithoutReports,
          ],
          backgroundColor: [
            documentStyle.getPropertyValue('--p-green-500'),
            documentStyle.getPropertyValue('--p-yellow-500'),
            documentStyle.getPropertyValue('--p-red-500'),
            documentStyle.getPropertyValue('--p-gray-300'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-green-400'),
            documentStyle.getPropertyValue('--p-yellow-400'),
            documentStyle.getPropertyValue('--p-red-400'),
            documentStyle.getPropertyValue('--p-gray-200'),
          ],
        },
      ],
    };
  }

  initPieOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.pieOptions = {
      plugins: {
        title: {
          display: true,
          text: 'Distribución de estudiantes por nivel de riesgo',
          font: {
            size: 16,
          },
        },
        legend: {
          labels: {
            font: {
              size: 16,
            },
            usePointStyle: true,
            color: textColor,
          },
        },
      },
    };
  }

  showToast(severity: 'success' | 'error' | 'warn' | 'info', summary: string, detail: string): void {
    this.messageService.add({
      severity,
      icon: this.getToastIcon(severity),
      summary,
      detail,
      life: 5000,
    });
  }

  private getToastIcon(severity: 'success' | 'error' | 'warn' | 'info'): string {
    switch (severity) {
      case 'success':
        return 'pi pi-check-circle';
      case 'error':
        return 'pi pi-times-circle';
      case 'warn':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-info-circle';
    }
  }
}
