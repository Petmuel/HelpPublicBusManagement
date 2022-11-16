import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'HELP Public Bus Management';
  user: any;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.getUser().subscribe((user: any) => {
      this.user = user;
    });
  }
}
