import { Injectable } from '@angular/core';
import { User } from '@common/user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthentificationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private isConnected: Boolean;
    private readonly baseUrl: string = environment.serverUrl;
    private user: User;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
        this.isConnected = false;
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get getIsConnected(): Boolean {
        return this.isConnected;
    }

    login(username: string, password: string) {
        return this.http.post<User>(`${this.baseUrl}/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                console.log(user);
                this.isConnected = true;
                this.user = user;
                return user;
            }));
    }

    logout() {
        console.log(this.user);
        return this.http.post<any>(`${this.baseUrl}/logout`, this.user.id).pipe(first()).subscribe(() => {
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next({
                id: 0,
                username: ""
            });
            this.isConnected = false;
            this.user = {id: 0, username: ""};
        }, (error: Error) => {
            console.log(error);
        });;
    }
}