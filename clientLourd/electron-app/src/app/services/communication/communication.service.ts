import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { User } from "@app/utils/interfaces/user";
import { Room } from "@app/utils/interfaces/room";
import { catchError, lastValueFrom, Observable, throwError } from "rxjs";
import { Game } from "@app/utils/interfaces/game/game";

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    async login(username: string, password: string): Promise<{user: User, token: string}> {
        const res: any = (await lastValueFrom(this.requestLogin(username, password)));
        return res;
    }

    async register(username: string, password: string, email: string, avatarURL: string, fileID: string): Promise<{user: User, token: string}> {
        const res: any = (await lastValueFrom(this.requestRegister(username, password, email, avatarURL, fileID)));
        return res;
    }

    private requestLogin(username: string, password: string): Observable<{user: User}> {
        return this.http.post<{user: User}>(`${this.baseUrl}/login`, { username, password }).pipe(catchError(this.handleError));
    }

    private requestRegister(username: string, password: string, email: string, avatarURL: string, fileID: string): Observable<{user: User}> {
        return this.http.post<{user: User}>(`${this.baseUrl}/signup`, { username, password, email, avatarURL, fileID }).pipe(catchError(this.handleError));
    }

    async uploadAvatar(file: File, user: User): Promise<{url: string, fileId: string}> {
        const res: any = (await lastValueFrom(this.requestUploadAvatar(file, user)));
        return res;
    }

    private requestUploadAvatar(file: File, user: User): Observable<{url: string, fileId: string}> {
        /*return this.http.post<{URL: string, fileId: string}>(`${this.baseUrl}/avatar/${user.id}`, file, {
            headers: {"Authorization": `Bearer ${this.storageService.getUserToken()!}`}
        }).pipe(catchError(this.handleError));*/
        const formData = new FormData();
        formData.append("avatar", file);
        return this.http.post<{url: string, fileId: string}>(`${this.baseUrl}/avatar/${user.id}`, formData).pipe(catchError(this.handleError))
    }

    async getDefaultAvatars(): Promise<{avatars: [{url: string, fileId: string}]}> {
        const res: any = (await lastValueFrom(this.requestGetDefaultAvatars()));
        return res;
    }

    private requestGetDefaultAvatars(): Observable<{avatars: [{url: string, fileId: string}]}> {
        return this.http.get<{avatars: [{url: string, fileId: string}]}>(`${this.baseUrl}/avatar/defaults`).pipe(catchError(this.handleError));
    }

    async createGame(roomId: string): Promise<{game: Game}> {
        const res: any = (await lastValueFrom(this.requestCreateGame(roomId)));
        return res;
    }

    private requestCreateGame(roomId: string): Observable<{game: Game}> {
        return this.http.post<{game: Game}>(`${this.baseUrl}/game`, roomId).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong.
          console.error(
            `Backend returned code ${error.status}, body was: `, error.error);
        }
        // Return an observable with a user-facing error message.
        return throwError(() => new Error('Something bad happened; please try again later.'));
      }
}