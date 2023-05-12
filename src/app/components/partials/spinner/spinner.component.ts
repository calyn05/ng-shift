import { Component, inject, ViewEncapsulation } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class SpinnerComponent {
  public loader: LoaderService = inject(LoaderService);
}
