import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiurlService {

  constructor() { }
  setapiurl() {
  var url = "http://localhost:2022";
 // var url ="http://13.215.196.150:2022";
  return url
  }
}
