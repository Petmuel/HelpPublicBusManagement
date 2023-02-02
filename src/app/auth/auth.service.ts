import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any = null;
  private userDataUpdate = new Subject<any>();

  constructor(
    public angularFireAuth: AngularFireAuth,
    public router: Router,
  ){}

  login(email: string, password: string) {
    this.angularFireAuth
    .signInWithEmailAndPassword(email, password)
    .then(res => {
      this.angularFireAuth.authState.subscribe(user=>{
        if(user){
          this.userData = res;
          this.userDataUpdate.next(this.userData);
          this.router.navigate(["dashboard/statistic"]);
        }
      })
    })
    .catch( error=>{
      setTimeout(()=>{
        window.alert('Invalid password/email, please try again');
      }, 100);
    })
  }

  getUser(){
    return this.userDataUpdate;
  }

  logout(){
    this.router.navigate([''])
  }
}
