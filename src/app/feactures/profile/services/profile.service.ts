import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/ApiResponse.model';
import { UserProfileResponse } from '../models/UserProfile.model';
import { UpdatePasswordRequest } from '../models/UpdatePassword.model';

interface State {
  isLoading: boolean;
  profile: UserProfileResponse | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL = `${environment.URL_API}/common/profile`;
  private http: HttpClient = inject(HttpClient);
  #state = signal<State>({
    isLoading: true,
    profile: null,
  });
  public profile = computed(() => this.#state().profile);
  public isLoading = computed(() => this.#state().isLoading);

  getProfileByEmail(email: string): Observable<ApiResponse<UserProfileResponse>> {
    return this.http.get<ApiResponse<UserProfileResponse>>(`${this.API_URL}/${email}`).pipe(
      tap((response: ApiResponse<UserProfileResponse>) => {
        this.setProfile(response.data);
      })
    );
  }

  updatePassword(updatePasswordRequest: UpdatePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.API_URL}/update-password`, updatePasswordRequest);
  }

  setProfile(profile: UserProfileResponse) {
    this.#state.set({
      profile: profile,
      isLoading: false,
    });
  }

  clearProfile() {
    this.#state.set({
      profile: null,
      isLoading: false,
    });
  }
}
