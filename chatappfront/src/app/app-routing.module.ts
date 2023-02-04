import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './shared/services/authgaurd/auth.gaurd.service';
import { ChatComponent } from './module/chat/chat.component';
import { LoginComponent } from './module/login/login.component';
import { MainComponent } from './module/main/main.component';
import { RegisterComponent } from './module/register/register.component';

const routes: Routes = [
  {path:'apps',component:MainComponent,canActivate:[AuthGaurdService],
  children:[
    {path:'chat',component:ChatComponent,canActivate:[AuthGaurdService]},
    {path:'',redirectTo:'dashboard',pathMatch:"full"},

  ]},

  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'',redirectTo:'login',pathMatch:"full"},
  { path: '**', redirectTo: 'apps' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true,scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', scrollOffset: [0, 64] })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
