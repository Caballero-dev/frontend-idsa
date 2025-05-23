import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email-change',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './confirm-email-change.component.html',
  styleUrl: './confirm-email-change.component.scss'
})
export class ConfirmEmailChangeComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  
  token: string | null = null;
  isTokenValid = false;

  ngOnInit(): void {
    this.getTokenFromUrlParams();

    if (!this.token) {
      this.isTokenValid = false;
      return;
    }

    // Validar el token (en una aplicación real, harías una llamada a la API para verificar el token)
    // Aquí simulamos que el token es válido si existe
    this.isTokenValid = true;
    
    // En un caso real, llamarías a un servicio para confirmar el cambio de correo electrónico
    // Ejemplo:
    // this.authService.confirmEmailChange(this.token).subscribe({
    //   next: (response) => {
    //     this.isTokenValid = true;
    //     // Guardar información del usuario actualizada si es necesario
    //   },
    //   error: (error) => {
    //     this.isTokenValid = false;
    //     console.error('Error al confirmar cambio de correo:', error);
    //   }
    // });
  }

  getTokenFromUrlParams(): void {
    // Obtener el token de los parámetros de la URL
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');
    });
  }

  requestNewVerificationEmail(): void {
    // En una aplicación real, harías una llamada a la API para solicitar un nuevo correo de verificación
    console.log('Solicitando nuevo correo de verificación para cambio de email');
    
    // Ejemplo de llamada a servicio:
    // this.authService.requestEmailChangeVerification(this.token).subscribe({
    //   next: () => {
    //     // Mostrar mensaje de éxito
    //     console.log('Correo de verificación enviado');
    //   },
    //   error: (error) => {
    //     console.error('Error al solicitar nuevo correo:', error);
    //   }
    // });
    
    // Puedes mostrar un mensaje de éxito al usuario
    alert('Se ha enviado un nuevo correo de verificación a tu dirección de correo electrónico.');
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
