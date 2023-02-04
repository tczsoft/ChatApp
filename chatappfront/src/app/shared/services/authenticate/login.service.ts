import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from '../apiurl/apiurl.service';
import { Router } from '@angular/router';
import { ChatComponent } from 'src/app/module/chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient,private apiurl:ApiurlService,private router:Router,) { }
  API_URL:any=this.apiurl.setapiurl();
  async login(e:any){
    return await this.http.post(`${this.API_URL}/api/login`,e).toPromise().then((data:any)=>{
      if (data.msg == "success") {
        localStorage.setItem('chat_token', data.token);
        this.router.navigate(['/apps/chat']);
      }
      else {
       alert("Username or Password Error")
      }
    })
  }

  getAccessToken() {
    return localStorage.getItem('chat_token');
  }
  isLoggedIn(): boolean {
    let authToken = localStorage.getItem('chat_token');
    return (authToken !== null) ? true : false;
  }

  getUserDetails() {
      const token = this.getAccessToken();
  let payload;
  if (token) {
    payload = token.split('.')[1];
    payload = window.atob(payload);
    return JSON.parse(payload);
  } else {
    return null;
  }
  }


  logout() {
    if (localStorage.removeItem('chat_token') == null) {

      console.clear()
      this.router.navigate(['/login']);
    }
  }

}

