import { Component, inject, resource, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgentService } from '../agent.service';
import { MatIconModule } from '@angular/material/icon';

const API = 'imageCaptionGen'
const DEFAULT_RES : ResponseObj = {
  message: {
    options: []
  },
}

@Component({
  selector: 'app-caption-gen',
  imports: [ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './caption-gen.component.html',
  styleUrl: './caption-gen.component.scss'
})
export class CaptionGenComponent {

  private agentService = inject(AgentService);

  file : any = ''
  imageUrl: any = ''
  uploadedFile:any = signal('')
  fd = new FormData();

  imageChecked = true
  textChecked = false
  errorMessage : string = ''
  isVlaid : boolean = false
  isLoading: boolean = false

  imageDesc: ResponseObj = DEFAULT_RES

  onFileSelected(event:any){
    let reader = new FileReader();
    this.fd = new FormData()
    if(event.target.files && event.target.files.length > 0) {
      console.log(event.target.files)

      const mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
          this.errorMessage = "Only images are supported.";
          return;
      }

      // to display image in UI
      reader.readAsDataURL(event.target.files[0]); 
      reader.onload = (_event) => { 
          this.imageUrl = reader.result; 
      }
      
      this.uploadedFile.set(<File>event.target.files[0])
      this.fd.append('file', this.uploadedFile(), this.uploadedFile().name);
      this.isVlaid = true
      console.log(this.fd)
      console.log(this.uploadedFile())
    }
  }

  generate(){
    this.isLoading = true
    this.agentService.genImageCaption(API, this.fd).subscribe(res=>{
      console.log(res)
      this.imageDesc = res;
      this.isLoading = false
    });
  }

  optionSelected(event: any){
    if(event.target.name == 'imageGen'){
      this.imageChecked = true
      this.textChecked = false
    }else{
      this.imageChecked = false
      this.textChecked = true
    }
  }

}

export interface ResponseObj {
    message: {
      options: []
    }
}