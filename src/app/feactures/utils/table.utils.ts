import { Table } from 'primeng/table';

// FIXME: Eliminar esta interfaz y usar el de shared
export interface Column {
  field: string;
  header: string;
  sortable: boolean;
}

export class TableUtils {
  static getGlobalFilterFields(cols: Column[]): string[] {
    return cols.map((col: Column) => col.field);
  }

  static onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  static getNestedValue(obj: any, field: string): string {
    return field.split('.').reduce((prev: any, curr: string) => prev?.[curr], obj);
  }
}
