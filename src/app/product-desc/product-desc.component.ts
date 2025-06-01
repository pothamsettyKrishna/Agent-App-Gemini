import { Component, resource, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { runFlow } from 'genkit/beta/client';

const DEFAULT_PRODUCT: ProductData = {
  name: '',
  features: '',
  target: '',
  tone: ''
};

const END_URL = 'productDescGenFlow'


@Component({
  selector: 'app-product-desc',
  imports: [ReactiveFormsModule, ReactiveFormsModule],
  templateUrl: './product-desc.component.html',
  styleUrl: './product-desc.component.scss'
})

export class ProductDescComponent {

  productUpdated: any = signal(DEFAULT_PRODUCT)

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    features: new FormControl('', [Validators.required]),
    target: new FormControl(''),
    tone: new FormControl('')
  })

    // A resource that requests story data
  productDescResource = resource({
    defaultValue: DEFAULT_PRODUCT,
    request: () => this.productUpdated(),
    loader: ({request}) => {
      const url = END_URL;
      return runFlow({
        url: END_URL,
        input: {
          userInput: request
        }
      });
    }
  });
  
  submit(){
    console.log(this.productForm)
    this.productUpdated.set(this.productForm.value)
    // this.productDetails.update(a=>{
    //   a.name = value.name
    // })
  }
}


interface ProductData {
  name: string;
  features: string;
  target: string;
  tone: string;
}
