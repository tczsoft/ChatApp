import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import {ScrollingModule} from '@angular/cdk/scrolling';
//primeng
import {FileUploadModule} from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

//components
import { ChatComponent } from './module/chat/chat.component';
import { LoginComponent } from './module/login/login.component';
import { OrderbyPipe } from './shared/pipes/orderby.pipe';
import { MainComponent } from './module/main/main.component';
import { RegisterComponent } from './module/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    OrderbyPipe,
    MainComponent,
    RegisterComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FileUploadModule,
    AvatarModule,
    AvatarGroupModule,
    PickerModule,
    VirtualScrollerModule,
    ScrollingModule,
    ToastModule
  ],
  providers: [ChatComponent, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
