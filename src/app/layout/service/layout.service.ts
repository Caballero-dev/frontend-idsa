import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

interface LayoutState {
  staticMenuDesktopInactive?: boolean;
  staticMenuMobileActive?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  _state: LayoutState = {
    staticMenuDesktopInactive: false,
    staticMenuMobileActive: false,
  };

  layoutState = signal<LayoutState>(this._state);
  private overlayOpen = new Subject<any>();
  overlayOpen$ = this.overlayOpen.asObservable();

  constructor() {}

  onMenuToggle() {
    if (this.isDesktop()) {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive,
      }));
    } else {
      this.layoutState.update((prev) => ({
        ...prev,
        staticMenuMobileActive: !this.layoutState().staticMenuMobileActive,
      }));

      if (this.layoutState().staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }
}
