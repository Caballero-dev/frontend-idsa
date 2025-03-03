import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern: RegExp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  static passwordPattern: RegExp = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;:'"\\,.<>\/?~`]+$/;
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  /**
   * @param errors Errores del campo
   * @returns Mensaje de error del campo
   * */
  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern.toString()) {
            return 'El valor ingresado no luce como un correo electrónico';
          }
          if (errors['pattern'].requiredPattern === FormUtils.passwordPattern.toString()) {
            return 'La contraseña contiene caracteres no permitidos';
          }

          return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }

  /**
   * @param form Formulario a validar
   * @param fieldName Nombre del campo a validar
   * @returns true si el campo es válido, false si no lo es
   * */
  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  /**
   * @param form Formulario a validar
   * @param fieldName Nombre del campo a validar
   * @returns Mensaje de error del campo
   * */
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors: ValidationErrors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  /**
   * @param field1 Nombre del primer campo
   * @param field2 Nombre del segundo campo
   * @returns true si los campos son iguales, false si no lo son
   *
   * @example
   * ```typescript
   * this.form = this.fb.group({
   *  password: ['', Validators.required],
   *  confirmPassword: ['', [Validators.required, FormUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')]]
   *  });
   *  ```
   * */
  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }
}
