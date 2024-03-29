import { Injectable } from '@angular/core';
import { Tile } from '@app/utils/interfaces/game/tile';
import { MoveService } from '@app/services/game/move.service';
import { GameService } from '@app/services/game/game.service';
import { Player } from '@app/utils/interfaces/game/player';
import { UserService } from '@app/services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  tileElems: HTMLElement[] = [];
  constructor(
    private gameService: GameService,
    private userService: UserService
  ) {}

  /*place(row: number, col: number): void {
    if (
      this.tileElems.length == 1 &&
      this.gameService.selectedTiles.length == 1
    ) {
      this.tileElems[0].style.outlineColor = '#e6d9b7';
      this.tileElems = [];
        if (this.gameService.scrabbleGame.value) {
          const newPlayers: Player[] = this.gameService.scrabbleGame.value.players;
          let deleted = false;
          for (let i = 0; i < this.gameService.scrabbleGame.value.players.length; i++) {
            if (this.gameService.scrabbleGame.value.players[i].id == this.userService.currentUserValue.id && !deleted) {
              for (let j = 0; j < this.gameService.scrabbleGame.value.players[i].rack.tiles.length; j++) {
                if (this.gameService.scrabbleGame.value.players[i].rack.tiles[j].letter == this.gameService.selectedTiles[0].letter && !deleted) {
                  newPlayers[i].rack.tiles.splice(j, 1);
                  deleted = true;
                }
              }
            }
          }
          this.gameService.scrabbleGame.next({...this.gameService.scrabbleGame.value, players: newPlayers});
        }
      }

      if (this.gameService.selectedTiles[0].letter < 97) {
        this.gameService.specialLetter( col, row);
      }

      
      if (this.gameService.scrabbleGame.value) {
        const newBoard = this.gameService.scrabbleGame.value.board;
        newBoard[row][col].tile = {
          ...this.gameService.selectedTiles[0],
          x: col,
          y: row,
          disabled: false
        };
        this.gameService.scrabbleGame.next({...this.gameService.scrabbleGame.value, board: newBoard});
        this.gameService.placedTiles++;
      }  

      this.gameService.selectedTiles.splice(0, 1);
    }*/
  

  place_drag_drop(
    row: number,
    col: number,
    tile: Tile
  ): void {
        if (tile.letter < 97) {
          this.gameService.specialLetter( col, row);
        } 
        if (this.gameService.scrabbleGame.value) {
          const newBoard = this.gameService.scrabbleGame.value?.board;
          newBoard[row][col].tile = {letter: tile.letter, value: tile.value, x: col, y: row, disabled: false};
          this.gameService.scrabbleGame.next({...this.gameService.scrabbleGame.value, board: newBoard});
          this.gameService.placedTiles++;
        }
  }

  resetColor(): void {
    for (const elem of this.tileElems) {
      elem.style.outlineColor = '#e6d9b7';
    }
    this.tileElems = [];
  }
}
