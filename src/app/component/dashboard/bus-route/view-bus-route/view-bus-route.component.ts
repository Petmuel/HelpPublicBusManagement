import { Component, DoCheck, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { BusStop } from 'src/app/shared/model/bus-stop';
@Component({
  selector: 'app-view-bus-route',
  templateUrl: './view-bus-route.component.html',
  styleUrls: ['./view-bus-route.component.css']
})
export class ViewBusRouteComponent implements OnInit, DoCheck {
  id!: any;
  busRouteObj !: any;
  busStop !: any;
  dataSource!: MatTableDataSource<BusStop>;
  displayedColumns: string[] = ['index', 'name', 'address', 'longitude', 'latitude'];
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
    this.getBusStops();
  }
  getBusRouteById(){
    this.dataApi.getBusRouteById(this.id).subscribe(res=>{
      this.busRouteObj=res;
      // console.log(this.busRouteObj)
      console.log(this.id)
    })
  }

  getBusStops(){
      this.dataApi.getBusStopsByRoute(this.id)
      this.dataApi.getBusStopsByRoute(this.id).subscribe(res=>{
        this.busStop=res.map((e:any)=>{
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
      // console.log(this.busStop);
      this.dataSource = new MatTableDataSource(this.busStop);
    })
      //console.log('hi',this.busStop.length());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
