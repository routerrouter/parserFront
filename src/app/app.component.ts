import { Transacao } from './interface/Transacao';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import { FileService } from './file.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };
  file!: File;
  uploadForm!: FormGroup;
  buttonValid = false;

  public pageNumber: number = 0;
  public pages: Array<number> = [];
  public size: number = 0;


  public transations: Transacao[] = [];
  public nomeLoja: string = '';
  public saldoLoja: number = 0;

  

  constructor(
    private fileService: FileService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getTransations(this.nomeLoja);
    this.uploadForm = this.formBuilder.group({
      loja: ['']
    })
  }

  formatToCurrency(amount:any){
    return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  filterLoja() {
    this.nomeLoja = this.uploadForm.get('loja')?.value;
    this.getTransations(this.uploadForm.get('loja')?.value);
  }

  setPage(i: any, event:any) {
    event.preventDefault();
    this.pageNumber = i;
    this.getTransations(this.nomeLoja);
  }

  fileEvent(files: File[]): void {
    this.file = files[0];
    (this.file != null ? this.buttonValid = true : this.buttonValid = false)
  }

  getTransations(loja: any) {
    this.fileService.getTransations(loja).subscribe(
      (response: Transacao[]) => {
      this.transations = (loja =='' ? Object(response).content : Object(response).transacoesLoja);
      this.saldoLoja = (loja =='' ? 0 : Object(response).saldo)
      console.log(this.transations);
      console.log(this.saldoLoja)
      this.pages = new Array((loja == '' ? Object(response).pageable.pageSize : Object(response).length));
    },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }

    )
  }

  parserTransations(): void {
    const formData = new FormData();
    formData.append('file', this.file);
    this.fileService.upload(formData).subscribe(
      event => {
        this.resportProgress(event);
        this.buttonValid = false;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  private resportProgress(httpEvent: HttpEvent<string[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Carregando... ');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total!, 'Baixando... ');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          this.fileStatus.status = 'done';
          for (const filename of httpEvent.body) {
            this.filenames.unshift(filename);
          }
        } else {
        }
        this.fileStatus.status = 'done';
        break;
      default:
        break;

    }
  }

  private updateStatus(loaded: number, total: number, requestType: string): void {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
}
