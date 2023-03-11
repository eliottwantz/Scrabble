import { Injectable } from "@angular/core";
import { BoardHelper } from "@app/classes/board-helper";
import { Game } from "@app/utils/interfaces/game/game";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class GameService {
    game!: BehaviorSubject<Game>;
    constructor() {
        this.game = new BehaviorSubject<Game>({
            id: "",
            players: [
                {
                    id: "0",
                    username: "Olivier",
                    rack: [
                        {
                            letter: "a",
                            value: 1
                        },
                        {
                            letter: "e",
                            value: 1
                        } 
                    ],
                    score: 0,
                    consecutiveExchanges: 0,
                    isBot: false
                }
            ],
            board: BoardHelper.createBoard(),
            bag: [],
            finished: false,
            numPassMoves: 0,
            turn: ""
        });
    }

    updateGame(game: Game): void {
        this.game.next(game);
    }
}