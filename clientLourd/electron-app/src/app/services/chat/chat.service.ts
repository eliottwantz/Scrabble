import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '@app/utils/interfaces/room';
import { ChatMessage } from '@app/utils/interfaces/chat-message';
import { UserService } from '@app/services/user/user.service';
import { WebSocketService } from '@app/services/web-socket/web-socket.service';
import { User } from '@app/utils/interfaces/user';
import { RoomService } from '@app/services/room/room.service';
const electron = (window as any).require('electron');
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  globalRoomId!: string;
  user: BehaviorSubject<User>;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private socketService: WebSocketService
  ) {
    this.user = this.userService.subjectUser;
    if (this.user.value.id === '0') {
      electron.ipcRenderer.send('request-user-data');
      electron.ipcRenderer.on(
        'user-data',
        async (_: string, data: { user: User, room: Room }) => {
          this.userService.setUser(data.user);
          this.user.next(data.user);
          if (this.user.value.id !== '0') {
            await this.socketService.connect();
          }
        }
      );
    }
  }

  send(msg: string, room: Room): void {
    if (
      this.userService.isLoggedIn &&
      this.roomService.findRoom(room.id) !== undefined
    ) {
      const payload: ChatMessage = {
        roomId: room.id,
        from: this.user.value.username,
        fromId: this.user.value.id,
        message: msg,
      };
      this.socketService.send('chat-message', payload);
    } else {
      console.log('Not logged in');
    }
  }

  openChat(room: Room): any {
    const text = 'Hello World';
    const user = this.userService.currentUserValue;
    electron.ipcRenderer.send('open-chat', { text, user, room });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electron.ipcRenderer.on('open-chat', (_: any, arg: any) => {
      electron.ipcRenderer.send('get-room');
      console.log(arg);
    });
  }
  closeChat(): any {
    const text = 'Hello World';
    electron.ipcRenderer.send('close-chat', text);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    electron.ipcRenderer.on('close-chat-reply', (_: any, arg: any) => {
      console.log(arg);
    });
  }
}
