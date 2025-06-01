import { Component, computed, input, resource, ResourceStatus } from '@angular/core';
import { runFlow } from 'genkit/beta/client';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';


const IMG_FLOW = 'genImgFlow'
const LOADING_STATUSES = [ResourceStatus.Loading, ResourceStatus.Reloading];

@Component({
  selector: 'app-image',
  imports: [MatProgressSpinnerModule, MatIconModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {

  imageDisc = input<string>('');

  isLoading = computed(() => LOADING_STATUSES.includes(this.imgResource.status()));

  imgResource = resource({
    defaultValue: '',
    request: () => this.imageDisc(),
    loader: ({request}) => {
      return runFlow({
        url: IMG_FLOW,
        input: request
      });
    }
  });
}
