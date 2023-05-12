import { TestBed } from '@angular/core/testing';

import { HttpInterceptInterceptor } from './http-intercept.interceptor';

describe('HttpInterceptInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpInterceptInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpInterceptInterceptor = TestBed.inject(HttpInterceptInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
