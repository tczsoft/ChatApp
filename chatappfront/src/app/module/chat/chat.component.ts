import { Component, HostListener, OnInit, ViewChild,  ChangeDetectorRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';

import { io, Socket } from "socket.io-client";
import { ApiurlService } from 'src/app/shared/services/apiurl/apiurl.service';
import { LoginService } from 'src/app/shared/services/authenticate/login.service';
import { ChatService } from 'src/app/shared/services/chat/chat.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CompressimageService } from 'src/app/shared/services/imgcompressor/compressimage.service';
import { MessageService } from 'primeng/api';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';
import { Router } from '@angular/router';
declare var bootstrap: any;
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import * as moment from 'moment';
//import { ActionPerformed, PushNotificationSchema, PushNotifications, Token} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { LocalNotificationActionPerformed } from '@capacitor/local-notifications/dist/esm/definitions';
import { Toast } from '@capacitor/toast';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],

})
export class ChatComponent implements OnInit {
  private socket: Socket;

  username: string = this.login.getUserDetails().data.Name
  avatar: string = this.login.getUserDetails().data.Name.charAt(0)
  Users: any[] = [];
  Messagedata: any[] = [];
  requsetlist: any[] = [];
  uploadedFiles: any[] = [];
  typing: boolean = false;
  usernametitle: any;
  checkwidth : any
  toggled: boolean = false;
  Message : String;
  messagecount : any;

  @ViewChild('scroll') private myScrollContainer: any;
  @ViewChild(CdkVirtualScrollViewport) _vsList: CdkVirtualScrollViewport;
  @ViewChild('Message') messageform: NgForm;

  constructor(
    private apiurl: ApiurlService,
    public login: LoginService,
    private chat: ChatService,
    private cdr:ChangeDetectorRef,
    public imagecom : CompressimageService,
    private messageService: MessageService,
    private scrollService: ScrollService,
    private router : Router

  ) { }
  API_URL: any = this.apiurl.setapiurl();

  ngOnInit(): void {

    var socketInit = false;
    if (!socketInit) {
      this.socket = io(`${this.API_URL}`, {
        transports: ['websocket'],
      });
      socketInit = true;
      this.socket.on('connect', () => {
        console.log("connect");
        this.socket.emit("join-user", this.login.getUserDetails().data.Email);
        this.socket.on("users", async (data) => {
          var dd: any = await this.getrequest();
          this.requsetlist = dd.Requests;
          var obj = dd.Accepted.flat().map((p: any) => Object.assign(p, { status: "Online" }));
          this.getchatcount();
          this.Users = obj;
          const found = this.Users.map((f: any) => data.users.findIndex((e: any) => e.username == f.Email));
          for (var i = 0; i < found.length; i++) {
            if (found[i] == -1) {
              this.Users[i] = { ...this.Users[i], ...{ status: "Offline" } };
            }

          }
          this.Users.sort((a, b) => a.count > b.count ? -1 : 1);

        })
        this.socket.on('user disconnected', (data) => {

          var status = this.Users.findIndex(d => d.Email == data);
          this.Users[status] = { ...this.Users[status], ...{ status: "Offline" } }

        })


      });

      this.socket.on('connect_error', () => {
        console.log("connect_error");
        this.ngOnDestroy()

      })
      this.socket.on('connect_failed', () => {
        console.log("connect_failed");
        this.ngOnDestroy()
      })

      this.socket.on('reconnect', () => {
        console.log("reconnect")
        this.socket.emit("join-user", this.login.getUserDetails().data.Email)

      });
    }
    else {
      console.log("reconnect else")
      this.socket.connect();
    }

    this.privatemessage();
    this.socketgetrequest();
    this.socketdeletechat();
    this.initialmessage();

    this.checkwidth = document.body.clientWidth;
    this.scrollheight = this.checkwidth >992? "calc(100vh - 174px)" : "calc(100vh - 127px)";
  }


  scrollheight: any
  @HostListener('window:resize', ['$event'])
  onResize(event : any) {
    this.checkwidth = event.target.innerWidth;
    this.scrollheight = this.checkwidth >992? "calc(100vh - 174px)" : "calc(100vh - 127px)";
  }

  isValidHttpUrl(data : string) {
    let url;
    try {
      url = new URL(data);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  tagmessageid : any
  replay(data : any){
    this.tagmessageid = data
    console.log(this.tagmessageid)
    this.backTobottom()
  }


  async messagesend(e: any, usernametitle: any) {
    console.log(this.isValidHttpUrl(e.value.Message))
    var obj = { ...e.value, ...{ Email: usernametitle,Tagedmessageid : this.tagmessageid} };

    this.chat.chatsave(obj).then(data => {

      this.Messagedata.push(data);
      this.Messagedata = [...this.Messagedata];
      this.scrollHeight();
      this.toggled = false;
      this.tagmessageid = undefined;
      e.reset();


    });

  }

  deletemessage(data : any){
    this.chat.deletechat({id :data._id,to : data.to}).then(data => {

    })
  }

  socketdeletechat(){
    this.socket.on('delete message', (data) =>{
      var removed = this.Messagedata.filter(res => res._id != data);
      this.Messagedata = removed;
    })
  }


  scrolltoindex(id : any){

    if(id != undefined){
      var totalheight = document.getElementsByClassName('cdk-virtual-scroll-viewport')[0]
      let el : any = document.getElementById(id);
      document.getElementById(id)?.firstElementChild?.classList.add('tag-highlight')
      totalheight.scrollTo(totalheight.scrollHeight,(el.scrollHeight-el.offsetTop))

      setTimeout(() => {
        document.getElementById(id)?.firstElementChild?.classList.remove('tag-highlight');
      }, 5000);
    }

  }

  disconnectSocket() {
    this.socket.disconnect()
  }

  trackByForm(index:any, obj:any){
    return index
  }

  initialmessage(){
    this.socket.on("initial message", (data) => {

      this.socket.emit("join-user", this.login.getUserDetails().data.Email);
      this.socket.on("users", async (data) => {
        var dd: any = await this.getrequest();
        this.requsetlist = dd.Requests;
        var obj = dd.Accepted.flat().map((p: any) => Object.assign(p, { status: "Online" }));
        this.getchatcount();
        this.Users = obj;
        const found = this.Users.map((f: any) => data.users.findIndex((e: any) => e.username == f.Email));
        for (var i = 0; i < found.length; i++) {
          if (found[i] == -1) {
            this.Users[i] = { ...this.Users[i], ...{ status: "Offline" } };
          }

        }
        this.Users.sort((a, b) => a.count > b.count ? -1 : 1);

      })
      this.socket.on('user disconnected', (data) => {

        var status = this.Users.findIndex(d => d.Email == data);
        this.Users[status] = { ...this.Users[status], ...{ status: "Offline" } }

      })

    })
  }

  hasperrmission : boolean;
  privatemessage() {

    this.socket.on("private message", async (data) => {
      console.log('hi',data)

      if (data.from == this.usernametitle) {
        this.Messagedata.push(data);
        this.Messagedata=[...this.Messagedata];

      }

      const permission : any = LocalNotifications.requestPermissions()
        this.hasperrmission = permission

        LocalNotifications.registerActionTypes({
          types: [
            {
              id: 'reply',
              actions: [
                {
                  id: 'reply',
                  title: 'reply',
                  input: true,
                },
                {
                  id: 'yes',
                  title: 'yes!',
                },{
                  id: "no",
                  title: 'no.',
                }
              ]
            }]
          })



        LocalNotifications.addListener('localNotificationActionPerformed',
        (notification : LocalNotificationActionPerformed) =>{
          console.log(notification);
          if(notification.notification.actionTypeId == 'replay'){
            notification.inputValue || notification.actionId
          }
        })

        if(this.hasperrmission){
          const randomId = Math.floor(Math.random() * 10000) + 1;

          LocalNotifications. schedule({
            notifications: [
               {
                 title: 'New Message from '+data.Email,
                body: data.Messagetype == 'text'? data.Message : 'New Photo',
                id: randomId,
                sound: "beep.wav",
                extra: null,
              }]
            })
        }
      this.getchatcount();
    })

  }

  async getmessage(e: any, mform: any) {
    if (mform != undefined) {
      mform.resetForm();
    }
    this.usernametitle = e.Email;
    e.count = null
    this.chat.getchat(e.Email).then((data: any) => {
      this.Messagedata = [...data];
      this.scrollHeight()
    });

    if (window.innerWidth < 768) {
      document.getElementById('profile-panel')?.classList.add('d-none')
    }

  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  backtoprofile(){
    this.usernametitle = null
    document.getElementById('profile-panel')?.classList.remove("d-none")
  }

  async getchatcount() {
    this.chat.getchatcount().then((data: any) => {
      for (var i = 0; i < data.length; i++) {
        var findex = this.Users.findIndex(a => a.Email == data[i].From)
        this.Users[findex].count = data[i].n
      }
      this.Users.sort((a, b) => a.count > b.count ? -1 : 1);
    });
  }

  messagestatus : any;
  messagecontent : any;
  bgcolor : any
  sendrequest(e: any, click: any) {
    click.click()
    if (e.value.Email.trim() == this.login.getUserDetails().data.Email) {
     // alert("Self request not allowed")
     // this.messageService.add({severity:'warn', summary: 'Warn',life : 30000, detail: 'Self request not allowed'});
     this.bgcolor = 'bg-secondary';
      this.messagestatus = 'Warning';
      this.messagecontent = "Self request not allowed";
      const toastLiveExample = document.getElementById('liveToast');
      const toast = new bootstrap.Toast(toastLiveExample);

      toast.show();


    }
    else {
      this.chat.sendrequest(e.value).then((data: any) => {

        if (data['msg'] == "Already sent") {
         // alert("Already request send! or Already in your chatlist")
        }
        else {
          e.reset();
        //  alert("Successfully request send")
        }
      });
    }
  }

  async getrequest() {
    return await this.chat.getrequest().then((data: any) => data);
  }

  socketgetrequest(){
    this.socket.on('request list', (data) =>{
      this.requsetlist = data['Requests']
    })
  }

  //accept or reject request
  actionrequest(email: any, e: any) {
    this.chat.actionrequest(email, e).then((data: any) => {
      this.requsetlist = data['Requests']
    });
  }

  searchdata: any;
  filterdata: any;
  somethingChanged(e: any) {
    var expr = new RegExp(e, "gi");
    var data = this.Users.filter((elem: any) => expr.test(elem['Email']));
    this.filterdata = data;
  }

  transform(bytes: any) {
    const sizes = ["Bytes", "KB", "MB"];
      if (bytes == 0) {
        return "0 Byte";
      }
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
    }

 onUpload(event: any, receiver: any, uploadedFiles: any) {

    const toDataURL = (url: RequestInfo | URL) => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }))

    toDataURL(event.files[0].objectURL.changingThisBreaksApplicationSecurity).then(async dataUrl => {

      var data = await this.imagecom.compressFile(dataUrl);

      var obj: any = {...{},...{ Email: receiver, Message: data, Messagetype: "image",Tagedmessageid : this.tagmessageid}};
      this.chat.chatsave(obj).then((data: any) => {
        this.Messagedata.push(data);
        this.Messagedata=[...this.Messagedata];
        this.scrollHeight();
        this.onScroll();

        let myModalEl = document.getElementById('fileupload');
        let modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
        uploadedFiles.files = [];
        this.tagmessageid = undefined;
      });
    })

  }

  addEmoji(selected: Emoji, Message : any) {
    var emojidata =  Message.value+(selected.emoji as any).native;
    this.Message = emojidata;
  }


  @HostListener('wheel', ['$event'])
  onScroll(){
    if(document.getElementsByClassName('cdk-virtual-scroll-viewport')[0] != undefined){

      var usernametitle = this.usernametitle;
      this.messagecount = this.Users.filter((res : any)=> res.Email == usernametitle)[0].count;

      var height : any = document.getElementsByClassName('cdk-virtual-scroll-viewport');
      var currentheight = height[0]?.scrollTop;
      var totalheight = height[0]?.scrollHeight;
      var difference = height[0]?.offsetHeight;

      if(this.messagecount != null && currentheight+difference == totalheight){
        this.chat.updatecount(usernametitle).then((data: any) => {
          if(data.message == "update successfully"){
            this.Users.filter((res : any)=> {res.Email == usernametitle ? res.count = null : false})
          }
        });
      }
      else{
        return true;
      }
      return true;
    }
    else{
      return true;
    }
  }

  scrollHeight() {
    try{
   /*  const el = this.myScrollContainer.elementRef.nativeElement;
      el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);*/

      this._vsList.scrollToIndex(this.Messagedata.length -1);

      setTimeout(() => {
        var list = document.getElementsByClassName('message-items')
        list[list.length -1].scrollIntoView();
      }, 50);


    }
    catch(err){
      console.log(err);
    }

  }

  backTobottom(){
    this.scrollHeight()
    if(document.getElementsByClassName('cdk-virtual-scroll-viewport')[0] != undefined){

      var usernametitle = this.usernametitle;
      this.messagecount = this.Users.filter((res : any)=> res.Email == usernametitle)[0].count;

      if(this.messagecount != null){
        this.chat.updatecount(usernametitle).then((data: any) => {
          if(data.message == "update successfully"){
            this.Users.filter((res : any)=> {res.Email == usernametitle ? res.count = null : false})
          }
        });
      }
      else{
        return true;
      }
      return true;
    }
    else{
      return true;
    }

  }

async downloadimg(data : any){

  var date= moment(new Date()).format('DDMMyyy')
  var id = Math.floor(100000 + Math.random() * 900)

  await Filesystem.writeFile({
    path: "chatapp_"+date+"_"+id+".jpg",
    data: data,
    directory: Directory.Documents,
  }).then(c=>{
    Toast.show({
      text: 'Image Saved',
    })
  });
}

}
