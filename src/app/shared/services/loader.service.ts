import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loading: boolean = false;

  constructor() {}

  setLoading(loading: boolean) {
    this._loading = loading;
  }

  getLoading(): boolean {
    return this._loading;
  }
}
