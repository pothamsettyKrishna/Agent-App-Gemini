import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router)

  itemsList = [
      {
        "title" : "Image Gen",
        "asset" : "assets/home.png",
        "route" : "imagegen",
        "des" : "Generate desired images using AI"
      },
      {
        "title" : "Smart Content Creator",
        "asset" : "assets/image.png",
        "route" : "smartgen",
        "des" : "Flows to generate content using AI."
      }
    ]

  navigate(value: string){
    console.log(value)
    this.router.navigate([value])
  }
}
