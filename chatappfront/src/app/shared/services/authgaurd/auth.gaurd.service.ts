import { Injectable } from '@angular/core';
import { LoginService } from '../authenticate/login.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate{

  constructor(private authService:LoginService,public router: Router) { }

  canActivate(
    route : ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn() !== true) {

      this.router.navigate(['/login'])
    }
  

    return this.CheckLoginAccess(route);
  }

  async CheckLoginAccess(route : any): Promise<boolean>{
    if(this.authService.isLoggedIn()){

    const userRole = this.authService.getUserDetails().role;

   if(route.data['role'] !=undefined){
   
    

    if (route.data['role'] && route.data['role'].indexOf(userRole) === -1){

    
      this.router.navigate(['/research']);
      return false;
    
   



    }
   }

    
    return true
    

    }
    else{
      this.router.navigate(['/login']);
      return false
    }
  }
}
