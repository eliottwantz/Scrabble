import { AfterViewInit, Component } from "@angular/core";
import { CommunicationService } from "@app/services/communication/communication.service";
import { RoomService } from "@app/services/room/room.service";
import { SocialService } from "@app/services/social/social.service";
import { StorageService } from "@app/services/storage/storage.service";
import { UserService } from "@app/services/user/user.service";
import { WebSocketService } from "@app/services/web-socket/web-socket.service";
import { User } from "@app/utils/interfaces/user";
import { BehaviorSubject } from "rxjs";

@Component({
    selector: "app-social",
    templateUrl: "./social.component.html",
    styleUrls: ["./social.component.scss"],
})
export class SocialComponent implements AfterViewInit {
  onlineFriendUserNameSearch = "";
  addFriendUserName = "";
  allFriendUserNameSearch = "";
  user: BehaviorSubject<User>;
  listUserDisplay: User[];
  listUsers: BehaviorSubject<User[]>;
  listFriends: User[];
  listFriendsDisplay: User[];
  usernameInput: any;

  constructor(private userService: UserService, private websocketService: WebSocketService, private communicationService: CommunicationService,
      private storageService: StorageService, private socialService: SocialService, private roomService: RoomService) {
    this.user = this.userService.subjectUser;
    //this.listUsers = this.storageService.listUsers;
    this.listUsers = new BehaviorSubject<User[]>([]);
    this.listUserDisplay = [];
    this.listFriendsDisplay = [];
    this.listFriends = [];
    this.storageService.listUsers.subscribe((users) => {
      const usersWithoutSelf = [];
      const friendsWithoutSelf = [];
      for (const user of users) {
        if (user.id != this.user.value.id) {
          usersWithoutSelf.push(user);
          if (this.user.value.friends.includes(user.id)) {
            friendsWithoutSelf.push(user);
          }
        }
      }
      this.listUsers.next(usersWithoutSelf);
      this.listUserDisplay = usersWithoutSelf;
      this.listFriendsDisplay = friendsWithoutSelf;
      this.listFriends = friendsWithoutSelf;
    });

    /*for (let i = 0; i < navButtons.length; i++) {
      if (i != index) {
        navButtons[i].setAttribute("style", "");
      } else {
        navButtons[i].setAttribute("style", "background-color: #424260; outline-color: #66678e; outline-width: 1px; outline-style: solid;");
      }
    }*/
  }

  ngAfterViewInit(): void {
    const index = this.socialService.screens.indexOf(this.socialService.activeScreen);
    const navButtons = document.getElementsByClassName('nav-text');
    navButtons[index].setAttribute("style", "background-color: #424260; outline-color: #66678e; outline-width: 1px; outline-style: solid;");
  }

  /*filterOnlineFriends(): string[] {
    return this.userService.currentUserValue.
  }*/

  sendFriendRequest(id: string): void {
    this.communicationService.sendFriendRequest(this.userService.currentUserValue.id, id);
    //this.websocketService.send()
  }

  selectNavButton(index: number): void {
    this.socialService.activeScreen = this.socialService.screens[index];
    const navButtons = document.getElementsByClassName('nav-text');
    for (let i = 0; i < navButtons.length; i++) {
      if (i != index) {
        navButtons[i].setAttribute("style", "");
      } else {
        navButtons[i].setAttribute("style", "background-color: #424260; outline-color: #66678e; outline-width: 1px; outline-style: solid;");
      }
    }
    this.listUserDisplay = this.listUsers.value;
    this.listFriendsDisplay = this.listFriends;
  }

  getScreen(): string {
    return this.socialService.activeScreen;
  }

  getUserAvatarUrl(id: string): string {
    const requestUser = this.storageService.getUserFromId(id);
    if (requestUser) {
      return requestUser.avatar.url;
    }
    return "";
  }

  getUserUsername(id: string): string {
    const requestUser = this.storageService.getUserFromId(id);
    if (requestUser) {
      return requestUser.username;
    }
    return "";
  }

  onSearchChange(input: string): void {
    this.listUserDisplay = this.listUsers.value.filter((user) => { return user.username.toLowerCase().includes(input.toLowerCase())});
  }

  onSearChangeFriend(input: string): void {
    this.listFriendsDisplay = this.listFriends.filter((user) => { return user.username.toLowerCase().includes(input.toLowerCase())})
  }

  async acceptFriendRequest(id: string): Promise<void> {
    await this.communicationService.acceptFriendRequest(this.userService.currentUserValue.id, id).then((res) => {
      console.log(res);
      const pendingRequests = this.userService.currentUserValue.pendingRequests;
      const index = pendingRequests.indexOf(id);
      if (index > -1) {
        pendingRequests.splice(index, 1);
      }
      this.userService.subjectUser.next({...this.userService.currentUserValue, pendingRequests: pendingRequests});
      this.userService.subjectUser.next({...this.userService.currentUserValue, friends: [...this.userService.currentUserValue.friends, id]});
    })
    .catch((err) => {
      console.log(err);
    });

    const pendingRequests = this.userService.currentUserValue.pendingRequests;
      const index = pendingRequests.indexOf(id);
      if (index > -1) {
        pendingRequests.splice(index, 1);
      }
      this.userService.subjectUser.next({...this.userService.currentUserValue, pendingRequests: pendingRequests});
      this.userService.subjectUser.next({...this.userService.currentUserValue, friends: [...this.userService.currentUserValue.friends, id]});
  }

  denyFriendRequest(id: string): void {
    this.communicationService.declineFriendRequest(this.userService.currentUserValue.id, id);
    const pendingRequests = this.userService.currentUserValue.pendingRequests;
    const index = pendingRequests.indexOf(id);
    if (index > -1) {
      pendingRequests.splice(index, 1);
    }
    this.userService.subjectUser.next({...this.userService.currentUserValue, pendingRequests: pendingRequests});
  }

  checkIfOnline(id: string): boolean {
    return this.roomService.listJoinedChatRooms.value[0].userIds.includes(id);
  }
}