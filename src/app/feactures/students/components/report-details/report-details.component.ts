import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReportTestService } from '../../tests/report-test.service';
import { Report } from '../../models/report.model';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-report-details',
  standalone: true,
  imports: [Button, RouterLink, GalleriaModule],
  templateUrl: './report-details.component.html',
  styleUrl: './report-details.component.scss',
})
export class ReportDetailsComponent implements OnInit {
  groupId: string | null = null;
  studentId: string | null = null;
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];
  reportDetails!: Report;

  private routeActivated: ActivatedRoute = inject(ActivatedRoute);
  private reportTestService: ReportTestService = inject(ReportTestService);

  ngOnInit() {
    this.groupId = this.routeActivated.snapshot.paramMap.get('grupoId');
    this.studentId = this.routeActivated.snapshot.paramMap.get('alumnoId');
    this.getReportDetails();
  }

  getReportDetails() {
    if (this.groupId && this.studentId) {
      this.reportDetails = this.reportTestService.getData();
    }
  }
}
