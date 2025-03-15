import { Injectable } from '@angular/core';
import { GroupConfiguration } from '../models/group-configuration.model';

@Injectable({
  providedIn: 'root',
})
export class GroupConfigurationService {
  getData(): GroupConfiguration[] {
    return [
      {
        groupConfigurationId: 1,
        tutor: {
          tutorId: 101,
          name: 'María',
          firstSurname: 'González',
          secondSurname: 'Pérez',
          employeeCode: 'EMP0123456789',
          phoneNumber: '5551234567',
          email: 'maria.gonzalez@escuela.edu',
        },
        campus: {
          campusId: 1,
          name: 'Campus Norte',
        },
        specialty: {
          specialtyId: 1,
          name: 'Ingeniería de Software',
          shortName: 'ISW',
        },
        modality: {
          modalityId: 1,
          name: 'Presencial',
        },
        grade: {
          gradeId: 1,
          name: 'Primer Semestre',
        },
        group: {
          groupId: 101,
          name: 'A',
        },
        generation: {
          generationId: 2023,
          yearStart: '2023-01-01',
          yearEnd: '2023-12-31',
        },
      },
      {
        groupConfigurationId: 2,
        tutor: {
          tutorId: 102,
          name: 'Juan',
          firstSurname: 'Martínez',
          secondSurname: 'Gómez',
          employeeCode: 'EMP0234567890',
          phoneNumber: '5552345678',
          email: 'juan.martinez@escuela.edu',
        },
        campus: {
          campusId: 1,
          name: 'Campus Norte',
        },
        specialty: {
          specialtyId: 2,
          name: 'Ciencias de la Computación',
          shortName: 'CC',
        },
        modality: {
          modalityId: 1,
          name: 'Presencial',
        },
        grade: {
          gradeId: 3,
          name: 'Tercer Semestre',
        },
        group: {
          groupId: 102,
          name: 'B',
        },
        generation: {
          generationId: 2022,
          yearStart: '2022-01-01',
          yearEnd: '2022-12-31',
        },
      },
      {
        groupConfigurationId: 3,
        tutor: {
          tutorId: 103,
          name: 'Luisa',
          firstSurname: 'Sánchez',
          secondSurname: 'Rodríguez',
          employeeCode: 'EMP0345678901',
          phoneNumber: '5553456789',
          email: 'luisa.sanchez@escuela.edu',
        },
        campus: {
          campusId: 2,
          name: 'Campus Sur',
        },
        specialty: {
          specialtyId: 3,
          name: 'Inteligencia Artificial',
          shortName: 'IA',
        },
        modality: {
          modalityId: 2,
          name: 'En línea',
        },
        grade: {
          gradeId: 5,
          name: 'Quinto Semestre',
        },
        group: {
          groupId: 103,
          name: 'C',
        },
        generation: {
          generationId: 2021,
          yearStart: '2021-01-01',
          yearEnd: '2021-12-31',
        },
      },
      {
        groupConfigurationId: 4,
        tutor: {
          tutorId: 104,
          name: 'Roberto',
          firstSurname: 'López',
          secondSurname: 'Fernández',
          employeeCode: 'EMP0456789012',
          phoneNumber: '5554567890',
          email: 'roberto.lopez@escuela.edu',
        },
        campus: {
          campusId: 3,
          name: 'Campus Este',
        },
        specialty: {
          specialtyId: 4,
          name: 'Redes y Telecomunicaciones',
          shortName: 'RT',
        },
        modality: {
          modalityId: 3,
          name: 'Híbrido',
        },
        grade: {
          gradeId: 7,
          name: 'Séptimo Semestre',
        },
        group: {
          groupId: 104,
          name: 'D',
        },
        generation: {
          generationId: 2020,
          yearStart: '2020-01-01',
          yearEnd: '2020-12-31',
        },
      },
      {
        groupConfigurationId: 5,
        tutor: {
          tutorId: 105,
          name: 'Ana',
          firstSurname: 'Rodríguez',
          secondSurname: 'Morales',
          employeeCode: 'EMP0567890123',
          phoneNumber: '5555678901',
          email: 'ana.rodriguez@escuela.edu',
        },
        campus: {
          campusId: 1,
          name: 'Campus Norte',
        },
        specialty: {
          specialtyId: 5,
          name: 'Seguridad Informática',
          shortName: 'SI',
        },
        modality: {
          modalityId: 1,
          name: 'Presencial',
        },
        grade: {
          gradeId: 1,
          name: 'Primer Semestre',
        },
        group: {
          groupId: 105,
          name: 'E',
        },
        generation: {
          generationId: 2023,
          yearStart: '2023-01-01',
          yearEnd: '2023-12-31',
        },
      },
      {
        groupConfigurationId: 6,
        tutor: {
          tutorId: 106,
          name: 'Carlos',
          firstSurname: 'Hernández',
          secondSurname: 'Díaz',
          employeeCode: 'EMP0678901234',
          phoneNumber: '5556789012',
          email: 'carlos.hernandez@escuela.edu',
        },
        campus: {
          campusId: 2,
          name: 'Campus Sur',
        },
        specialty: {
          specialtyId: 1,
          name: 'Ingeniería de Software',
          shortName: 'ISW',
        },
        modality: {
          modalityId: 2,
          name: 'En línea',
        },
        grade: {
          gradeId: 3,
          name: 'Tercer Semestre',
        },
        group: {
          groupId: 106,
          name: 'A',
        },
        generation: {
          generationId: 2022,
          yearStart: '2022-01-01',
          yearEnd: '2022-12-31',
        },
      },
      {
        groupConfigurationId: 7,
        tutor: {
          tutorId: 107,
          name: 'Elena',
          firstSurname: 'Díaz',
          secondSurname: 'Castro',
          employeeCode: 'EMP0789012345',
          phoneNumber: '5557890123',
          email: 'elena.diaz@escuela.edu',
        },
        campus: {
          campusId: 3,
          name: 'Campus Este',
        },
        specialty: {
          specialtyId: 2,
          name: 'Ciencias de la Computación',
          shortName: 'CC',
        },
        modality: {
          modalityId: 3,
          name: 'Híbrido',
        },
        grade: {
          gradeId: 5,
          name: 'Quinto Semestre',
        },
        group: {
          groupId: 107,
          name: 'B',
        },
        generation: {
          generationId: 2021,
          yearStart: '2021-01-01',
          yearEnd: '2021-12-31',
        },
      },
      {
        groupConfigurationId: 8,
        tutor: {
          tutorId: 108,
          name: 'Miguel',
          firstSurname: 'Torres',
          secondSurname: 'Ramírez',
          employeeCode: 'EMP0890123456',
          phoneNumber: '5558901234',
          email: 'miguel.torres@escuela.edu',
        },
        campus: {
          campusId: 1,
          name: 'Campus Norte',
        },
        specialty: {
          specialtyId: 3,
          name: 'Inteligencia Artificial',
          shortName: 'IA',
        },
        modality: {
          modalityId: 1,
          name: 'Presencial',
        },
        grade: {
          gradeId: 7,
          name: 'Séptimo Semestre',
        },
        group: {
          groupId: 108,
          name: 'C',
        },
        generation: {
          generationId: 2020,
          yearStart: '2020-01-01',
          yearEnd: '2020-12-31',
        },
      },
      {
        groupConfigurationId: 9,
        tutor: {
          tutorId: 109,
          name: 'Patricia',
          firstSurname: 'Gómez',
          secondSurname: 'Jiménez',
          employeeCode: 'EMP0901234567',
          phoneNumber: '5559012345',
          email: 'patricia.gomez@escuela.edu',
        },
        campus: {
          campusId: 2,
          name: 'Campus Sur',
        },
        specialty: {
          specialtyId: 4,
          name: 'Redes y Telecomunicaciones',
          shortName: 'RT',
        },
        modality: {
          modalityId: 2,
          name: 'En línea',
        },
        grade: {
          gradeId: 1,
          name: 'Primer Semestre',
        },
        group: {
          groupId: 109,
          name: 'D',
        },
        generation: {
          generationId: 2023,
          yearStart: '2023-01-01',
          yearEnd: '2023-12-31',
        },
      },
      {
        groupConfigurationId: 10,
        tutor: {
          tutorId: 110,
          name: 'Fernando',
          firstSurname: 'Vargas',
          secondSurname: 'Ortiz',
          employeeCode: 'EMP0012345678',
          phoneNumber: '5550123456',
          email: 'fernando.vargas@escuela.edu',
        },
        campus: {
          campusId: 3,
          name: 'Campus Este',
        },
        specialty: {
          specialtyId: 5,
          name: 'Seguridad Informática',
          shortName: 'SI',
        },
        modality: {
          modalityId: 3,
          name: 'Híbrido',
        },
        grade: {
          gradeId: 3,
          name: 'Tercer Semestre',
        },
        group: {
          groupId: 110,
          name: 'E',
        },
        generation: {
          generationId: 2022,
          yearStart: '2022-01-01',
          yearEnd: '2022-12-31',
        },
      },
      {
        groupConfigurationId: 87878,
        tutor: {
          tutorId: 101,
          name: 'María',
          firstSurname: 'González',
          secondSurname: 'Pérez',
          employeeCode: 'EMP0123456789',
          phoneNumber: '5551234567',
          email: 'maria.gonzalez@escuela.edu',
        },
        campus: {
          campusId: 2,
          name: 'Campus NorteSJG',
        },
        specialty: {
          specialtyId: 1,
          name: 'Ingeniería de Software',
          shortName: 'ISW',
        },
        modality: {
          modalityId: 1,
          name: 'Presencial',
        },
        grade: {
          gradeId: 1,
          name: 'Primer Semestre',
        },
        group: {
          groupId: 101,
          name: 'A',
        },
        generation: {
          generationId: 2023,
          yearStart: '2023-01-01',
          yearEnd: '2023-12-31',
        },
      },
    ];
  }
}
