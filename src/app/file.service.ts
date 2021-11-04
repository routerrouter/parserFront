import { environment } from './../environments/environment';
import { Transacao } from './interface/Transacao';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FileService {
  private server = environment.server;

  constructor(private http: HttpClient) {}

  upload(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.server}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


 public  getTransations(loja: any): Observable<Transacao[]> {
    if (loja == '') {
      return this.http.get<any>(`${this.server}`);
    } else {
      return this.http.get<any>(`${this.server}/byLoja?nomeLoja=`+ loja);
    }
  }
  
}
