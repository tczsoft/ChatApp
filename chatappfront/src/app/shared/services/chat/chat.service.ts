import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from '../apiurl/apiurl.service';
import { LoginService } from 'src/app/shared/services/authenticate/login.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient,private apiurl:ApiurlService,private login:LoginService) { }
  API_URL:any=this.apiurl.setapiurl();

  async chatsave(e:any){
    return await this.http.post(`${this.API_URL}/api/chatsave`,e,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();
  }

  async deletechat(e:any){
    return await this.http.delete(`${this.API_URL}/api/deletechat?id=${e.id}&&to=${e.to}`,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();
  }

  async getchat(e:any){
    return await this.http.get(`${this.API_URL}/api/getchat?id=${e}`,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();

  }

  async updatecount(e:any){
    return await this.http.get(`${this.API_URL}/api/updatecount?id=${e}`,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();

  }

  async getchatcount(){
    return await this.http.get(`${this.API_URL}/api/getchatcount`,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();
  }

  async sendrequest(e:any){
    return await this.http.post(`${this.API_URL}/api/sendrequest`,e,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();

  }
  async getrequest(){
    return await this.http.get(`${this.API_URL}/api/getrequest`,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();
  }

  async actionrequest(email:any,e:any){
    return await this.http.post(`${this.API_URL}/api/actionrequest`,{Email:email,action:e},{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();

  }
  async getfullchat(){
    return await this.http.get(`${this.API_URL}/api/getfullchat`,{headers: { Authorization: `Bearer ${this.login.getAccessToken()}` },withCredentials: true}).toPromise();
  }



}
