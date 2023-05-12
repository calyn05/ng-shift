import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: [
    './worker-profile.component.css',
    '../../../user/profile/profile.component.css',
    '../../../register/register.component.css',
  ],
})
export class WorkerProfileComponent {
  workerProfileForm!: FormGroup;
  editables: HTMLInputElement[] = [];

  enableEdit() {
    this.editables = Array.from(
      document.getElementsByClassName('editable')
    ) as HTMLInputElement[];
    this.editables.forEach((input) => {
      input.disabled = false;
    });
  }

  disableEdit() {
    this.editables.forEach((input) => {
      input.value = '';
      input.disabled = true;
    });
    this.editables = [];
  }
}
