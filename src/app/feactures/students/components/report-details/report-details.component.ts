import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, isPlatformBrowser } from '@angular/common';

import { catchError, combineLatest, finalize, map, Observable, of } from 'rxjs';

import { Button } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { GalleriaModule } from 'primeng/galleria';
import { MessageService } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { ApiError } from '../../../../core/models/ApiError.model';
import { ApiResponse } from '../../../../core/models/ApiResponse.model';

import { ReportService } from '../../../../shared/reports/services/report.service';
import { ImageService } from '../../services/image.service';
import { ReportResponse } from '../../../../shared/reports/model/report.model';

interface ImageData {
  url: string;
  objectUrl: string;
  loaded: boolean;
}

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [Button, GalleriaModule, ToolbarModule, ToastModule, ChartModule, PaginatorModule],
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss',
  providers: [MessageService],
})
export class ReportDetailsComponent implements OnInit, OnDestroy {
  private reportService: ReportService = inject(ReportService);
  private imageService: ImageService = inject(ImageService);
  private messageService: MessageService = inject(MessageService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private reportCache: Map<number, ReportResponse[]> = new Map<number, ReportResponse[]>();

  groupId: string | null = null;
  studentId: string | null = null;

  isLoading: boolean = false;
  isLoadingImage: boolean = false;

  reportSelected: ReportResponse | null = null;
  reportSelectedImages: ImageData[] = [];
  reports!: ReportResponse[];

  rows: number = 10;
  first: number = 0;
  page: number = 0;
  totalRecords: number = 0;

  chartData: any = {};
  chartOptions: any = {};

  ngOnInit(): void {
    this.getGroupIdFromRoute();
    this.getStudentIdFromRoute();
    this.loadReportDetails();
    this.initChartOptions();
  }

  ngOnDestroy(): void {
    this.cleanupObjectUrls();
  }

  navigateToStudent(): void {
    this.router.navigate(['/panel/alumnos/grupo', this.groupId]);
  }

  selectReport(event: any): void {
    const indexSelected = event.element.index;
    this.cleanupObjectUrls();
    this.reportSelected = this.reports[indexSelected];
    this.loadImages(this.reportSelected.images);
  }

  refreshReportDetails(): void {
    this.cleanupObjectUrls();
    this.reportSelected = null;
    this.isLoadingImage = false;
    this.reportCache.clear();
    this.page = 0;
    this.loadReportDetails();
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;
    const page = this.getCurrentPageIndex();
    if (this.reportCache.has(page)) {
      this.reports = this.reportCache.get(page)!;
      this.updateChartData();
      this.isLoading = false;
    } else {
      this.page = event.pageCount! - (event.page! + 1);
      this.loadReportDetails();
    }
  }

  loadReportDetails(): void {
    if (!this.groupId || !this.studentId) return;

    this.isLoading = true;
    this.reportService.getReportByStudentId(this.studentId, this.page, this.rows).subscribe({
      next: (response: ApiResponse<ReportResponse[]>) => {
        if (response.data.length === 0) {
          this.isLoading = false;
          this.navigateToStudent();
          return;
        }

        this.reports = response.data.reverse();

        if (!this.reportSelected) {
          this.reportSelected = this.reports[this.reports.length - 1];
          this.loadImages(this.reportSelected.images);
        }

        this.first = (response.pageInfo!.totalPages - 1 - response.pageInfo!.page) * this.rows;
        this.page = this.getCurrentPageIndex();
        this.totalRecords = response.pageInfo!.totalElements;
        this.reportCache.set(this.page, this.reports);
        this.isLoading = false;
        this.updateChartData();
      },
      error: (error: ApiError) => {
        if (error.statusCode === 404 && error.message.includes('student_not_found')) {
          this.navigateToStudent();
          return;
        } else if (error.statusCode === 400 && error.message.includes('UUID <<type_mismatch>>')) {
          this.navigateToStudent();
          return;
        } else if (error.status === 'Unknown Error' && error.statusCode === 0) {
          this.showToast('error', 'Error', 'Error de conexión con el servidor, por favor intente más tarde');
        } else {
          this.showToast('error', 'Error', 'Ha ocurrido un error inesperado, por favor intente más tarde');
        }
        this.isLoading = false;
      },
    });
  }

  loadImages(imageUrls: string[]): void {
    if (!imageUrls || imageUrls.length === 0) {
      this.isLoadingImage = false;
      this.reportSelectedImages = [];
      return;
    }

    this.cleanupObjectUrls();
    this.isLoadingImage = true;

    const imageObservables: Observable<ImageData>[] = imageUrls.map((url) =>
      this.imageService.getImage(url).pipe(
        map((blob: Blob) => ({
          url,
          objectUrl: URL.createObjectURL(blob),
          loaded: true,
        })),
        catchError(() => {
          return of({
            url,
            objectUrl: '',
            loaded: false,
          });
        })
      )
    );

    combineLatest(imageObservables)
      .pipe(
        finalize(() => {
          this.isLoadingImage = false;
        })
      )
      .subscribe({
        next: (imageResults: ImageData[]) => {
          this.reportSelectedImages = imageResults;

          const loadedCount: number = imageResults.filter((img: ImageData) => img.loaded).length;
          const totalCount: number = imageResults.length;

          console.log(`Cargadas: ${loadedCount}/${totalCount} imágenes`);
        },
        error: () => {
          this.reportSelectedImages = imageUrls.map((url: string) => ({
            url,
            objectUrl: '',
            loaded: false,
          }));
        },
      });
  }

  updateChartData(): void {
    if (!this.reports || this.reports.length === 0) {
      this.chartData = {};
      return;
    }

    const labels: string[] = this.reports.map((r: ReportResponse) => {
      return formatDate(r.createdAt, 'dd/MM/yyyy hh:mm:ss a', 'en');
    });
    const temperature: number[] = this.reports.map((r: ReportResponse) => r.temperature);
    const heartRate: number[] = this.reports.map((r: ReportResponse) => r.heartRate);
    const systolic: number[] = this.reports.map((r: ReportResponse) => r.systolicBloodPressure);
    const diastolic: number[] = this.reports.map((r: ReportResponse) => r.diastolicBloodPressure);

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Temperatura (°C)',
          data: temperature,
          borderColor: '#FFA500',
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
        {
          label: 'Frecuencia cardiaca (ppm)',
          data: heartRate,
          borderColor: '#B22222',
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
        {
          label: 'Presión arterial sistólica (mmHg)',
          data: systolic,
          borderColor: '#1E90FF',
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
        {
          label: 'Presión arterial diastólica (mmHg)',
          data: diastolic,
          borderColor: '#87CEFA',
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    };
  }

  initChartOptions(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            position: 'nearest',
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
        },
        scales: {
          x: {
            ticks: { color: textColorSecondary },
            grid: { color: surfaceBorder, drawBorder: false },
          },
          y: {
            ticks: { color: textColorSecondary },
            grid: { color: surfaceBorder, drawBorder: false },
          },
        },
      };
    }
  }

  getCurrentPageIndex(): number {
    return this.first / this.rows;
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

  private getGroupIdFromRoute(): void {
    const groupIdParam: string | null = this.activatedRoute.snapshot.paramMap.get('grupoId');
    if (groupIdParam) {
      this.groupId = groupIdParam;
    } else {
      this.router.navigate(['/panel/alumnos']);
    }
  }

  private getStudentIdFromRoute(): void {
    const studentIdParam: string | null = this.activatedRoute.snapshot.paramMap.get('alumnoId');
    if (studentIdParam) {
      this.studentId = studentIdParam;
    } else {
      this.router.navigate(['/panel/alumnos/grupo', this.groupId]);
    }
  }

  private cleanupObjectUrls(): void {
    this.reportSelectedImages.forEach((imageData) => {
      if (imageData.objectUrl) {
        URL.revokeObjectURL(imageData.objectUrl);
      }
    });
    this.reportSelectedImages = [];
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
