import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern: RegExp = /^[a-zA-Z0-9.]+@[a-z0-9.]+\.[a-z]{2,4}$/;
  static passwordPattern: RegExp = /^[a-zA-Z0-9ñÑ!@#$%^&*()_+\-=\[\]{}|;:'"\\,.<>\/?~`]+$/;
  static onlyLettersPattern: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
  static alphanumericPattern: RegExp = /^[a-zA-Z0-9]+$/;
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
          if (errors['pattern'].requiredPattern === FormUtils.onlyLettersPattern.toString()) {
            return 'El campo solo permite letras';
          }
          if (errors['pattern'].requiredPattern === FormUtils.alphanumericPattern.toString()) {
            return 'El campo solo permite letras y números';
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
   * @returns {boolean} `true` cuando el campo tiene errores y ha sido tocado, `false` en cualquier otro caso
   * */
  static isInvalidValidField(formControl: FormControl): boolean {
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
   * @returns null si los campos son iguales, { passwordsNotEqual: true } si no lo son
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
    const allowedCharacters: RegExp = /^[a-zA-Z0-9@.]+$/;
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

  /**
   * @param event Evento de teclado
   * @returns true si el caracter es válido, false si no lo es
   * */
  static isvalidOnlyLettersCharacters(event: KeyboardEvent): boolean {
    const allowedCharacters: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const key: string = event.key;
    const inputElement = event.target as HTMLInputElement;
    const cursorPosition: number | null = inputElement.selectionStart;

    if (key === ' ' && cursorPosition === 0) {
      return false;
    }

    if ((inputElement.value + key).includes('  ')) {
      return false;
    }

    return allowedCharacters.test(key);
  }

  /**
   * @param event Evento de pegado
   * @returns true si el pegado es válido, false si no lo es
   * */
  static isValidOnlyLettersPaste(event: ClipboardEvent): boolean {
    if (event.clipboardData) {
      const clipboardData: string = event.clipboardData.getData('text');
      const allowedCharacters: RegExp = FormUtils.onlyLettersPattern;

      return allowedCharacters.test(clipboardData) && !clipboardData.includes('  ');
    }
    return false;
  }

  /**
   * @param event Evento de teclado
   * @returns true si el caracter es válido, false si no lo es
   * */
  static isValidAlphanumericCharacters(event: KeyboardEvent): boolean {
    const allowedCharacters: RegExp = FormUtils.alphanumericPattern;
    const key: string = event.key;

    return allowedCharacters.test(key);
  }

  static isValidAlphanumericPaste(event: ClipboardEvent): boolean {
    if (event.clipboardData) {
      const clipboardData: string = event.clipboardData.getData('text');
      const allowedCharacters: RegExp = FormUtils.alphanumericPattern;

      return allowedCharacters.test(clipboardData);
    }
    return false;
  }
}
