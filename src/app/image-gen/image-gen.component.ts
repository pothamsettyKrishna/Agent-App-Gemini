import { Component, resource} from '@angular/core';
import { ImageComponent } from '../image/image.component';
import { FormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import { runFlow } from 'genkit/beta/client';

const IMG_FLOW = 'optionGenFlow'

@Component({
  selector: 'app-image-gen',
  imports: [ImageComponent, FormsModule,MatChipsModule],
  templateUrl: './image-gen.component.html',
  styleUrl: './image-gen.component.scss'
})
export class ImageGenComponent{

  userInput = ''
  imagePrompt = ''
  options = resource({
        defaultValue: '',
        request: () => '',
        loader: ({request}) => {
          return runFlow({
            url: IMG_FLOW, 
            input: request
          });
        }
      });

  ngOnInit(): void {
    console.log('In ngOnInit...');
  }

  send(){
    console.log(this.userInput)
    this.imagePrompt = this.userInput
  }

  chipSelect(value:string){
    this.userInput = value
    this.send()
  }
}

