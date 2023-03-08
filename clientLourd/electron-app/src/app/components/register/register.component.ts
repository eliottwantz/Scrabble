import { Component, ElementRef, OnInit } from "@angular/core";
//import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "@app/services/authentication/authentication.service";
import { Router } from "@angular/router"
import { CommunicationService } from "@app/services/communication/communication.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
    username: string = "";
    password: string = "";
    email: string = "";
    avatar: string = "";
    isRegisterFailed = false;
    selectedFile: any = null;
    defaultAvatars: {URL: string, FileId: string}[];
    
    constructor(private authService: AuthenticationService, private router: Router, private commService: CommunicationService) { 
        this.defaultAvatars = [];
    }
    
    ngOnInit(): void {
        this.commService.getDefaultAvatars().then((res) => {
            this.defaultAvatars = res;
        });
    }
    
    async onSubmit() {
        if (this.username == "" || this.password == "" || this.email =="" || this.avatar == "")
            return;
        const isLoggedIn = await this.authService.register(this.username, this.password, this.email, this.avatar);

        if (isLoggedIn) {
            this.router.navigate(['/home']);
        } else {
            this.isRegisterFailed = true;
        }
    }

    selectAvatar(num: number): void {
        let src;
        for(let i = 0; i < document.getElementsByClassName("avatar").length; i++) {
            if (i != num) {
                document.getElementsByClassName("avatar")[i].setAttribute("style", "");
                this.selectedFile = null;
            } else {
                src = document.getElementsByClassName("avatar")[i].getAttribute("src");
                document.getElementsByClassName("avatar")[i].setAttribute("style", "background: -webkit-linear-gradient(left top, crimson 0%, #f90 100%);");
            }
        }
        if (src)
            this.avatar = src;
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0] ?? null;
        this.selectAvatar(-1);
    }
}