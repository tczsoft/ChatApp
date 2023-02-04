import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/authenticate/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private login:LoginService,private router: Router) {
    
   }

  ngOnInit(): void {
    if(this.login.isLoggedIn() == true){
      this.router.navigate(['/apps/chat']);
    }
   
  }
  async submit(e:any){
    return await this.login.login(e.value)
  }
}
