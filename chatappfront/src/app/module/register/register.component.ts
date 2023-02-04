import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiurlService } from 'src/app/shared/services/apiurl/apiurl.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  status: any;
  email : any;
  display : any;
  resentOTP : boolean = false;
  constructor(private http : HttpClient, private api : ApiurlService, private router : Router){ }

  api_url : string = this.api.setapiurl();

  async submit(f : any){

    await this.http.post(`${this.api_url}/api/getotp`, f.value).toPromise().then((res : any) => {

      this.status = res.status;
      this.status == 'verify OTP'? this.startTimer(1): false ;
      this.email = f.value.Email;
    })
  }

  async verifyotp(f : any){

    var data = {...f.value, ...{Email : this.email}};
    await this.http.post(`${this.api_url}/api/verifyotp`,data).toPromise().then((res : any) => {

      this.status = res.status;
      this.email = this.email;
      console.log(res);
    })
  }

  async finalstep(data : any,email : any){
    console.log(email)
    await this.http.put(`${this.api_url}/api/register`,{query : this.email, data : data.value}).toPromise().then((res : any) => {
      this.status = res.status;
      console.log(this.status);
      this.status == 'register successfully'? this.router.navigate(['/login']) : this.status = null;
    })
  }

  async resentotp(){
    console.log(this.email);
    await this.http.post(`${this.api_url}/api/getotp`,{Email : this.email}).toPromise().then((res : any) => {

      this.status = res.status;
      this.status == 'verify OTP'? this.startTimer(1): false ;
    })
  }

  resetotp(){
    this.http.put(`${this.api_url}/api/resetotp`,{Email : this.email}).toPromise().then(res =>{
      console.log(res)
    })
  }

 startTimer(minute : any) {
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

   /* var current_time : any = moment(new Date()).format('hh:mm:ss a') ;
    localStorage.setItem('send_time',current_time)

    var send_time : any = localStorage.getItem('send_time')
    var duration = moment.duration(current_time.diff(send_time));
    var hours = duration.asHours();
    console.log(hours)*/

    const timer = setInterval(async () => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      }
      else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log("finished");
        this.resetotp();
        this.resentOTP = true;
        clearInterval(timer);
      }else{
        this.resentOTP = false;
      }
    }, 1000);
  }
}
