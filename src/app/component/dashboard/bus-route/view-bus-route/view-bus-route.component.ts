import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-view-bus-route',
  templateUrl: './view-bus-route.component.html',
  styleUrls: ['./view-bus-route.component.css']
})
export class ViewBusRouteComponent implements OnInit, DoCheck {
  id!: any;
  busRouteObj !: any;
  constructor(
    private route: ActivatedRoute,
    private dataApi: DataService,
    private router: Router) {
    this.id =route.snapshot.paramMap.get('id');
    }
  ngDoCheck(): void {
    let currenturl = this.router.url;
    if (currenturl=='/dashboard/busRoute/create'){
      this.isListing=false;
    }
    else{
      this.isListing=true;
    }
  }
  isListing = true;
  ngOnInit(): void {
    this.getBusRouteById();
  }
  getBusRouteById(){
    this.dataApi.getBusRouteById(this.id).subscribe(res=>{
      this.busRouteObj=res;
      console.log(this.busRouteObj)
      console.log(this.id)
    })
  }
}

/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-view-bus-route',
  templateUrl: './view-bus-route.component.html',
  styleUrls: ['./view-bus-route.component.css']
})
export class ViewBusRouteComponent implements OnInit {
  id!: any;
  busRouteObj !: any;
  constructor(
    private route: ActivatedRoute,
    private dataApi:
    DataService) {
    this.id =route.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.getBusRouteById();
  }
  getBusRouteById(){
    this.dataApi.getBusRouteById(this.id).subscribe(res=>{
      this.busRouteObj=res;
      console.log(this.busRouteObj)
      console.log(this.id)
    })
  }
}
*/
