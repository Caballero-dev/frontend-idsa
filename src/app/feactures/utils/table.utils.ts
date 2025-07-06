export class TableUtils {
  static getNestedValue(obj: any, field: string): string {
    return field.split('.').reduce((prev: any, curr: string) => prev?.[curr], obj);
  }
}
