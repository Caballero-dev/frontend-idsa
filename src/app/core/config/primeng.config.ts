import { providePrimeNG } from 'primeng/config';
import { EnvironmentProviders } from '@angular/core';
import { BlueAuraPreset } from '../../../assets/themes/blue-aura-theme';

export function providePrimeNGConfig(): EnvironmentProviders {
  return providePrimeNG({
    theme: {
      preset: BlueAuraPreset,
      options: {
        darkModeSelector: false,
      },
    },
    ripple: true,
    translation: {
      emptyMessage: 'No se encontraron registros',
      firstDayOfWeek: 1,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
      monthNames: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      clear: 'Limpiar',
    },
  });
}
