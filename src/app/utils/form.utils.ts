import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern: RegExp = /^[a-zA-Z0-9.]+@[a-z0-9.]+\.[a-z]{2,4}$/;
  static passwordPattern: RegExp = /^[a-zA-Z0-9ñÑ!@#$%^&*()_+\-=\[\]{}|;:'"\\,.<>\/?~`]+$/;
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
   * @param formControl Campo a validar
   * @returns true si el campo es inválido, false si es válido
   * */
  static isValidField(formControl: FormControl): boolean | null {
    return !!formControl.errors && formControl.touched;
  }

  /**
   * @param formControl Campo a validar
   * @returns Mensaje de error del campo
   * */
  static getFieldError(formControl: FormControl): string | null {
    if (!formControl) return null;

    const errors: ValidationErrors = formControl.errors ?? {};

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

  /**
   * @param event Evento de teclado
   * @returns true si el caracter es válido, false si no lo es
   * */
  static isValidEmailCharacters(event: KeyboardEvent): boolean {
   const allowedCharacters:RegExp = /^[a-zA-Z0-9@.]+$/;
   const key: string = event.key;

    return allowedCharacters.test(key);
  }

  /**
   * @param event Evento de pegado
   * @returns true si el pegado es válido, false si no lo es
   * */
  static isValidEmailPaste(event: ClipboardEvent): boolean {
    if (event.clipboardData) {
      const clipboardData: string = event.clipboardData.getData('text');
      const allowedCharacters: RegExp = FormUtils.emailPattern;

      return allowedCharacters.test(clipboardData);
    }
    return false;
  }

  /**
   * @param event Evento de teclado
   * @returns true si el caracter es válido, false si no lo es
   * */
  static isValidPasswordCharacters(event: KeyboardEvent): boolean {
    const allowedCharacters: RegExp = FormUtils.passwordPattern;
    const key: string = event.key;

    return allowedCharacters.test(key);
  }

  /**
   * @param event Evento de pegado
   * @returns true si el pegado es válido, false si no lo es
   * */
  static isValidPasswordPaste(event: ClipboardEvent): boolean {
    if (event.clipboardData) {
      const clipboardData: string = event.clipboardData.getData('text');
      const allowedCharacters: RegExp = FormUtils.passwordPattern;

      return allowedCharacters.test(clipboardData);
    }
    return false;
  }

}
