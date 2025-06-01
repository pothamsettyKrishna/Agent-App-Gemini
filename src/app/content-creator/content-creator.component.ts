import { Component, resource, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule, FormGroup, Validators } from '@angular/forms';
import { runFlow } from 'genkit/beta/client';
import { ProductDescComponent } from '../product-desc/product-desc.component';
import { CaptionGenComponent } from '../caption-gen/caption-gen.component';

const CONTENT_FLOW = 'contentGenFlow'

@Component({
  selector: 'app-content-creator',
  imports: [ReactiveFormsModule, FormsModule, ProductDescComponent, CaptionGenComponent],
  templateUrl: './content-creator.component.html',
  styleUrl: './content-creator.component.scss'
})
export class ContentCreatorComponent {
  topics = [
    // 'Blog posts',
    'Social media captions',
    'Product descriptions',
    // 'Short stories',
    'Summarize content'
  ]

  topicSelected = ''
  content = signal('')

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    features: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    target: new FormControl(''),
    tone: new FormControl('')
  })


  summarize_content = resource({
        defaultValue: '',
        request: () => this.content(),
        loader: ({request}) => {
          return runFlow({
            url: CONTENT_FLOW,
            input: request
          });
        }
      })

  userInput = ''

  summarize(){
    this.content.set(this.userInput)
  }
}
