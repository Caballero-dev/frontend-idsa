export interface ReportSummaryResponse {
  totalStudents: number;
  studentsWithReports: number;
  studentsWithoutReports: number;
  studentsWithLowProbability: number;
  studentsWithMediumProbability: number;
  studentsWithHighProbability: number;
}
