import { Component, OnInit } from "@angular/core";
import { GameService } from "@app/services/game/game.service";
import { Game, ScrabbleGame } from "@app/utils/interfaces/game/game";
import { BehaviorSubject } from "rxjs";
import { UserService } from "@app/services/user/user.service";
import { MoveService } from "@app/services/game/move.service";
import { MoveInfo } from "@app/utils/interfaces/game/move";
import { StorageService } from "@app/services/storage/storage.service";
import { JoinGameAsObserverPayload, JoinTournamentAsObserverPayload, LeaveGamePayload, LeaveTournamentPayload } from "@app/utils/interfaces/packet";
import { WebSocketService } from "@app/services/web-socket/web-socket.service";
import { Router } from "@angular/router";
import { ThemeService } from "@app/services/theme/theme.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { AdviceComponent } from "@app/components/advice/advice.component";
import { Tournament } from "@app/utils/interfaces/game/tournament";
import { GameOverTournamentComponent } from "@app/components/game-over-tournament/game-over-tournament.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-game-page",
    templateUrl: "./game-page.component.html",
    styleUrls: ["./game-page.component.scss"],
})
export class GamePageComponent implements OnInit {
    game!: BehaviorSubject<ScrabbleGame | undefined>;
    //tournament!:BehaviorSubject<Tournament | undefined>;
    //moves!: BehaviorSubject<MoveInfo[]>
    private darkThemeIcon = 'wb_sunny';
    private lightThemeIcon = 'nightlight_round';
    public lightDarkToggleIcon = this.lightThemeIcon;
    language: BehaviorSubject<string>;
    public gameWinner = '';
    public tournamentWinner = '';
    public isLoser = false;
    
    constructor(private gameService: GameService, private userService: UserService, private moveService: MoveService, private storageService: StorageService,
        private socketService: WebSocketService, private router: Router, private themeService: ThemeService) {
            this.language = this.themeService.language;
        }

    ngOnInit(): void {
        this.game = this.gameService.scrabbleGame;
        this.game.subscribe();
        this.gameService.gameWinner.subscribe((gameWinner) => {
            if(gameWinner==undefined && this.gameService.tournament){return}
            else{
                this.gameWinner = String(gameWinner);
            }
        })
        this.gameService.tournamentWinner.subscribe((tournamentWinner) => {
            if(tournamentWinner==undefined){return}
            else{
                this.tournamentWinner = String(tournamentWinner);
            }
        })
        /*this.gameService.tournament.subscribe((tournament) => {
            if(!tournament){return}
            else if(tournament?.games[0].id===this.gameService.game.value?.id)
            {
                if(tournament?.games[0].winnerId){
                    const loser = tournament?.games[0].userIds.splice(tournament?.games[0].userIds.indexOf(tournament.games[0].winnerId), 1)[0];
                    if(loser === this.userService.subjectUser.value.id)
                    {
                            this.dialog.open(GameOverTournamentComponent, {width: '80%',
                            minHeight: '70vh',
                            height : '50vh',
                            disableClose: true,
                            data: {isWinner: false}});
                        //this.isLoser = true;
                        console.log("bruh");
                    } else if (this.userService.subjectUser.value.id === tournament?.games[0].winnerId) {
                        this.dialog.open(GameOverTournamentComponent, {width: '80%',
                            minHeight: '70vh',
                            height : '50vh',
                            disableClose: true,
                            data: {isWinner: true}});
                    }
                }
            }
            else{
                if(tournament?.games[1].winnerId){
                    const loser = tournament?.games[1].userIds.splice(tournament?.games[1].userIds.indexOf(tournament.games[1].winnerId), 1)[0];
                    if(loser === this.userService.subjectUser.value.id)
                    {
                        this.dialog.open(GameOverTournamentComponent, {width: '80%',
                            minHeight: '70vh',
                            height : '50vh',
                            disableClose: true});
                        //this.isLoser = true;
                        console.log("bruh");
                    }
                }
            }
        })*/
        this.themeService.theme.subscribe((theme) => {
            if (theme == 'dark') {
              this.lightDarkToggleIcon = this.darkThemeIcon;
            } else {
              this.lightDarkToggleIcon = this.lightThemeIcon;
            }
        });
    }

    isTurn(): boolean {
        return this.game.value?.turn == this.userService.currentUserValue.id;
    }

    hasPlacedLetters(): boolean {
        return this.gameService.placedTiles > 0;
    }

    hasSelectedLetters(): boolean {
        return this.gameService.selectedTiles.length != 0;
    }

    submit(): void {
        this.moveService.playTiles();
    }

    pass(): void {
        this.moveService.pass();
    }

    exchange(): void {
        this.moveService.exchange();
    }

    indice(): void {
        this.moveService.indice();
    }

    getPlayerAvatar(id: string): string {
        const avatar = this.storageService.getAvatar(id);
        if (avatar != undefined)
            return avatar;
        return "";
    }

    leave(): void {
        if (this.gameService.tournament.value) {
            this.leaveTournament();
        }
        else{
            this.leaveGame();
        }
    }

    leaveGame(): void {
        if (this.game.value) {
            const payload: LeaveGamePayload = {
                gameId: this.game.value?.id
            };
            this.socketService.send("leave-game", payload);
            this.gameService.game.next(undefined);
            this.gameService.scrabbleGame.next(undefined);
            this.router.navigate(["/home"]);
        }
    }

    leaveTournament(): void {
        if(this.gameService.tournament.value){
            const payload: LeaveTournamentPayload = {
                tournamentId: this.gameService.tournament.value?.id
            };
            this.socketService.send("leave-tournament", payload);
            this.gameService.game.next(undefined);
            this.gameService.tournament.next(undefined);
            this.gameService.scrabbleGame.next(undefined);
            this.router.navigate(["/home"]);
        }
    }

    public doToggleLightDark() {
        this.themeService.switchTheme();
      }
    
      switchLanguage() {
        this.themeService.switchLanguage();
      }

    isDarkTheme(): boolean {
        return this.themeService.theme.value == "dark";
    }

    getCurrentPlayerColor(): string {
        if (this.themeService.theme.value == "light") {
            return "#424260";
        } else {
            return "#3c6d7a";
        }
    }
    
    getTileCount(): number {
        if (this.game.value)
            return this.game.value.tileCount;
        return 0;
    }
}