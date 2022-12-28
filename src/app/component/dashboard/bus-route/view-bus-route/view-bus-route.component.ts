import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { BusStop } from 'src/app/shared/model/bus-stop';
@Component({
  selector: 'app-view-bus-route',
  templateUrl: './view-bus-route.component.html',
  styleUrls: ['./view-bus-route.component.css']
})
export class ViewBusRouteComponent implements OnInit {
  id!: any;
  busRouteObj !: any;
  busStops !: any;
  dataSource!: MatTableDataSource<BusStop>;
  displayedColumns: string[] = ['index', 'name', 'address', 'longitude', 'latitude'];
  constructor(
    private route: ActivatedRoute,
    private dataApi: DataService,
    private router: Router) {
    this.id =route.snapshot.paramMap.get('id');
    }

  ngOnInit(): void {
    this.getBusRouteData()
    this.getBusStops()
  }
  getBusRouteData(){
    this.dataApi.getBusRouteById(this.id).subscribe(res=>{
      this.busRouteObj=res;
    })

  }

  getBusStops(){
    this.dataApi.getBusStopsByRoute(this.id).subscribe(res=>{
      this.busStops=res.map((e:any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
      console.log('busStopsView')
      this.dataSource = new MatTableDataSource(this.busStops);
    })
      //console.log('hi',this.busStop.length());
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }


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
