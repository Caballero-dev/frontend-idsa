import { Injectable } from '@angular/core';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportTestService {
  getData(): Report {
    return {
      student: {
        studentId: 7,
        studentCode: 'A20213456',
        name: 'Miguel',
        firstSurname: 'Pérez',
        secondSurname: 'Rivera',
        phoneNumber: '5557890123',
        predictionResult: 72.8,
      },
      reportId: 12345,
      createdAt: '2025-03-12T14:23:45Z',
      images: [
        'https://plus.unsplash.com/premium_photo-1689565611422-b2156cc65e47?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29uYXxlbnwwfHwwfHx8MA%3D%3D',
        'https://img.freepik.com/free-photo/smiley-man-with-arms-crossed-posing_23-2148306586.jpg',
        'https://img.freepik.com/premium-photo/caucasian-man-standing-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-1260.jpg',
        'https://img.freepik.com/free-photo/young-handsome-man-wearing-casual-tshirt-blue-background-happy-face-smiling-with-crossed-arms-looking-camera-positive-person_839833-12963.jpg',
      ],
      temperature: 37.2,
      pupilDilationRight: 4.8,
      pupilDilationLeft: 4.6,
      heartRate: 82.5,
      oxygenLevels: 95.3,
    };
  }
}
