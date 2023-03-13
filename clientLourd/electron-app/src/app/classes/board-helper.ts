import { Injectable } from "@angular/core";
import { Square } from "@app/utils/interfaces/square";

@Injectable({
    providedIn: 'root',
})
export class BoardHelper {
    static createBoard(): Square[][] {
        return [
            [
                { wordMultiplier: 3, letterMultiplier: 1, x: 1, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 2, x: 4, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 1 },
                { wordMultiplier: 3, letterMultiplier: 1, x: 8, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 2, x: 12, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 1 },
                { wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 1 },
                { wordMultiplier: 3, letterMultiplier: 1, x: 15, y: 1 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 2 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 2, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 6, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 10, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 2 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 14, y: 2 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 2 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 3 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 3, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 7, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 9, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 3 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 13, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 3 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 3 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 2, x: 1, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 4 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 4, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 8, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 4 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 12, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 4 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 15, y: 4 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 5 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 5, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 5 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 11, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 5 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 5 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 2, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 6, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 10, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 14, y: 6 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 6 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 3, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 7, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 9, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 13, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 7 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 7 },
            ],
            [
                {  wordMultiplier: 3, letterMultiplier: 1, x: 1, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 4, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 8 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 8, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 12, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 8 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 8 },
                {  wordMultiplier: 3, letterMultiplier: 1, x: 15, y: 8 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 3, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 7, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 9, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 13, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 9 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 9 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 2, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 6, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 10, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 14, y: 10 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 10 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 11 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 5, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 11 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 11, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 11 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 11 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 2, x: 1, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 12 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 4, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 8, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 12 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 12, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 12 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 15, y: 12 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 13 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 3, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 7, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 9, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 13 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 13, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 13 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 13 },
            ],
            [
                {  wordMultiplier: 1, letterMultiplier: 1, x: 1, y: 14 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 2, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 4, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 6, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 8, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 3, x: 10, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 12, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 14 },
                {  wordMultiplier: 2, letterMultiplier: 1, x: 14, y: 14 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 15, y: 14 },
            ],
            [
                {  wordMultiplier: 3, letterMultiplier: 1, x: 1, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 2, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 3, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 4, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 5, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 6, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 7, y: 15 },
                {  wordMultiplier: 3, letterMultiplier: 1, x: 8, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 9, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 10, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 11, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 2, x: 12, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 13, y: 15 },
                {  wordMultiplier: 1, letterMultiplier: 1, x: 14, y: 15 },
                {  wordMultiplier: 3, letterMultiplier: 1, x: 15, y: 15 },
            ]
        ];
    }
}