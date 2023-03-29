import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { GameService } from "@app/services/game/game.service";
import { StorageService } from "@app/services/storage/storage.service";
import { WebSocketService } from "@app/services/web-socket/web-socket.service";
import { ClientEvent } from "@app/utils/events/client-events";
import { Game } from "@app/utils/interfaces/game/game";
import { JoinGamePayload } from "@app/utils/interfaces/packet";
import { BehaviorSubject } from "rxjs";
import { JoinPrivateGameComponent } from "@app/components/join-private-game/join-private-game.component";

@Component({
    selector: "app-join-game",
    templateUrl: "./join-game.component.html",
    styleUrls: ["./join-game.component.scss"],
})
export class JoinGameComponent implements OnInit {
    gamesNotFull: Game[] = [];
    constructor(public dialogRef: MatDialogRef<JoinGameComponent>, public dialog: MatDialog, private gameService: GameService, private webSocketService: WebSocketService, private storageService: StorageService) {
        
    }

    ngOnInit(): void {
        for (const game of this.gameService.joinableGames.value) {
            if (game.userIds.length < 4) {
                this.gamesNotFull.push(game);
            }
        }

        this.gameService.joinableGames.subscribe(() => {
            this.gamesNotFull = [];
            for (const game of this.gameService.joinableGames.value) {
                if (game.userIds.length < 4) {
                    this.gamesNotFull.push(game);
                }
            }
        });
    }

    getUserNames(ids: string[]): string[] {
        const names = [];
        for (const id of ids) {
            const user = this.storageService.getUserFromId(id);
            if (user) {
                names.push(user.username);
            }
        }
        return names;
    }

    openDialogJoinPrivateGame(game: Game): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        this.dialog.open(JoinPrivateGameComponent, {width: '75%',
            minHeight: '70vh',
            height : '50vh',
            data: {game: game}
        });
    }

    joinGame(game: Game): void {
        //this.stepper.selectedIndex = STEPPER_PAGE_IDX.confirmationPage;
        if (game.isProtected) {
            this.openDialogJoinPrivateGame(game);
            this.close();
        } else {
            const payload: JoinGamePayload = {
                gameId: game.id,
                password: ""
            }
            const event : ClientEvent = "join-game";
            this.webSocketService.send(event, payload);
            this.close();
        }
    }

    close() {
        this.dialogRef.close();
    }
}