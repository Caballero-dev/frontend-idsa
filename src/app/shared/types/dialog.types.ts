export interface DialogState<T> {
  isOpen: boolean;
  message: DialogMessage;
  data: T | null;
}

export type DialogMessage = 'save' | 'edit' | 'close';
