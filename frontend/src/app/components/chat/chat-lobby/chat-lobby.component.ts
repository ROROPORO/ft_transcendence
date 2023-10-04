import { Component } from '@angular/core';
// import {HttpClient} from "@angular/common/http";
// import {Socket} from 'ngx-socket-io';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateRoomComponent } from "../room_service/create-room/create-room.component";
import { JoinRoomComponent } from "../room_service/join-room/join-room.component";
import { ChatService } from '../../../services/chat.service';
import { HttpService } from '../../../http.service';

@Component({
  selector: 'app-chat-lobby',
  templateUrl: './chat-lobby.component.html',
  styleUrls: ['./chat-lobby.component.css']
})
export class ChatLobbyComponent {
  
  myUserId: number = 0;
  
  constructor(private chatService: ChatService, private httpService: HttpService, private dialog: MatDialog, private router: Router) {}

  ngOnInit() {

    var ok: boolean = false;

    this.httpService.getUserId().subscribe((response: any) => {
      if (response) {
        this.myUserId = response.UserId;
      }
    });

    this.chatService.getAllRoom().subscribe((Response) => {
      if (Response) {
        var i = 0;
        while (Response[i]) {
          var j = 0;
          while (Response[i].participants[j]) {
            if (Response[i].participants[j] == this.myUserId) {
              ok = true;
            }
            j++;
          }
          i++;
        }
        if (ok) {
          window.location.href = 'chat';
        }
      } else {
        console.error("Error while retreiving all Rooms");
      }
    });
  }

  openDataJoinRoom() {
    const dialogRef = this.dialog.open(JoinRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        const name = result.name;
        const password = result.password;
        this.chatService.joinRoom(name, password).subscribe(result2 => {
          if (result2) {
            window.location.href = 'chat';
          } else {
            // Opération échouée
          }
        });
      }
    });
  }

  openDataCreateRoom() {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      /*Ouvre le dialog et definit la taille*/
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.name) {
        const name = result.name;
        const password = result.password;
        this.chatService.createRoom(name, password);
        window.location.href = 'chat';
       
      }
      else
        alert("Channel can't be NULL");
    });
  }
}
