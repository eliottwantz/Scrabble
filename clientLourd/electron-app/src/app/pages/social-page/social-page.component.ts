import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CommunicationService } from "@app/services/communication/communication.service";
import { RoomService } from "@app/services/room/room.service";
import { StorageService } from "@app/services/storage/storage.service";
// import { MessageErrorStateMatcher } from "@app/classes/form-error/error-state-form";
import { UserService } from "@app/services/user/user.service";
import { WebSocketService } from "@app/services/web-socket/web-socket.service";
import { ClientEvent } from "@app/utils/events/client-events";
import { CreateDMRoomPayload } from "@app/utils/interfaces/packet";
import { User } from "@app/utils/interfaces/user";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-social-page",
  templateUrl: "./social-page.component.html",
  styleUrls: ["./social-page.component.scss"],
})
export class SocialPageComponent {
  public user: BehaviorSubject<User>;
  public inDM:boolean;
  chatFriend = false;
  friendUsername = "";
  addFriendErrorMessage = "";
  // messageValidator: MessageErrorStateMatcher = new MessageErrorStateMatcher;
  // friendForm: FormGroup;
  // friendInput!: ElementRef;

  constructor(private fb: FormBuilder, private userService: UserService, private socketService: WebSocketService, private communicationService: CommunicationService, private storageService: StorageService,
    private roomService: RoomService) {
    this.user = this.userService.subjectUser;
    this.inDM = false;
    //this.addFriendPage();
    //document.getElementById("avatar")?.setAttribute("src", this.user.value.avatar.url);
    // this.friendForm = this.fb.group({
    //     input: ["", [Validators.required]],
    //   });
  }

  /*addFriendPage(): void {
    this.chatFriend = false;
    this.addFriend = true;
    document.getElementById('add-friend')?.setAttribute("style", "background-color: #424260; outline-color: #66678e; outline-width: 1px; outline-style: solid;");
    const friends = document.getElementsByClassName('friend');
    for (let i = 0; i < friends.length; i++) {
      friends[i].setAttribute("style", "");
    }
  }*/

  chatFriendPage(index: number): void {
    this.chatFriend = true;
    document.getElementById('add-friend')?.setAttribute("style", "");
    const friends = document.getElementsByClassName('friend');
    for (let i = 0; i < friends.length; i++) {
      if (i != index) {
        friends[i].setAttribute("style", "");
      } else {
        friends[i].setAttribute("style", "background-color: #424260; outline-color: #66678e; outline-width: 1px; outline-style: solid;");
      }
    }

    for (const room of this.roomService.listJoinedChatRooms.value) {
      const usersInRoom = room.name.split("/");
      console.log(usersInRoom);
      if (usersInRoom[0] == this.user.value.username && usersInRoom[1] == this.getUsernameFriend(index) ||
         usersInRoom[0] == this.getUsernameFriend(index) && usersInRoom[1] == this.user.value.username) {
          this.roomService.currentRoomChat.next(room);
          return;
      }
    }

    const friend = this.storageService.getUserFromId(this.user.value.friends[index]);
      if (friend) {
        this.friendUsername = friend.username;
        const payload: CreateDMRoomPayload = {
          username:this.user.value.username,
          toId: friend.id,
          toUsername:friend.username
        }
        const event : ClientEvent = "create-dm-room";
        this.socketService.send(event, payload);
      }
    //this.roomService.currentRoomChat = this.roomService.listChatRooms this.user.value.friends[index];
  }

  // async addFriend(friendName: string): Promise<void> {
  //   if (!friendName || !friendName.replace(/\s/g, '')) return;

  //   // await this.chatService.send(msg, this.roomService.currentRoom.value);
  //   this.friendForm.reset();
  //   this.friendInput.nativeElement.focus();
  //   //console.log(this.messages$);
  // }

  async console():Promise<void>{
    console.log(this.user.value);
  }

  async initFriend():Promise<void>{
    this.user.value.friends = [];
  }

  async addFriendTemp():Promise<void>{
    this.user.value.friends = ["bruh"];
  }

  getUsernameFriend(index: number): string {
    const username = this.storageService.getUserFromId(this.user.value.friends[index]);
    if (username) return username.username;
    return "";
  }
}
