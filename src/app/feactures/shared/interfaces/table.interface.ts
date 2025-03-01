import { Table } from 'primeng/table';

export interface Column {
  field: string;
  header: string;
  sortable: boolean;
}

export function getGlobalFilterFields(cols: Column[]): string[] {
  return cols.map((col: Column) => col.field);
}

export function onGlobalFilter(table: Table, event: Event) {
  table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}
