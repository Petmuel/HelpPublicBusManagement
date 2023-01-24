import {Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
@Component({
  selector: 'login',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.css']
})

export class LoginComponent{
  hide = true;
  constructor(private authService: AuthService){}

  login(form: NgForm){
    if(form.invalid)
      return;

    this.authService.login(form.value.email, form.value.password);
  }
}
