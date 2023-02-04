import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiurlService {

  constructor() { }
  setapiurl() {
  var url = "http://localhost:2022";
  return url
  }
}
