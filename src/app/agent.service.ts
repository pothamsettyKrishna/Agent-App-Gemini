import { Injectable, signal, resource, linkedSignal } from '@angular/core';
import { runFlow } from 'genkit/beta/client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  constructor(private http: HttpClient) { }

  genImageCaption(post_url: string, body: any): Observable<ResponseObj> {
    let response:any = this.http.post(post_url, body, {responseType: "json"})
    console.log(response)
    return response;
  }
}

export interface ResponseObj {
    message: {
      options: []
    }
}
