import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BusRoute } from 'src/app/shared/model/bus-route';
import { DataService } from 'src/app/shared/service/data.service';
import { AddBusrouteComponent } from './add-busroute/add-busroute.component';
import { DeleteBusRouteComponent } from './delete-bus-route/delete-bus-route.component';
import { Router } from '@angular/router';
import { AddRouteComponent } from './add-route/add-route.component';
@Component({
  selector: 'app-bus-route',
  templateUrl: './bus-route.component.html',
  styleUrls: ['./bus-route.component.css']
})
export class BusRouteComponent implements OnInit, DoCheck {
  busRoutesArr : BusRoute[] = [];
  displayedColumns: string[] = ['routeNo', 'description', 'destination', 'arrival', 'action'];
  dataSource!: MatTableDataSource<BusRoute>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private dataApi: DataService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public snackBar: MatSnackBar) { }

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
ngDoCheck(): void {
    let currenturl = this.router.url;
    if (currenturl=='/dashboard/busRoute'){
      this.islisting=true;
    }
    else{
      this.islisting=false;
    }
  }
  displayColumns:string[]=["name", "address", "longitude", "latitude", "action"];
  islisting = true;
  routedata!: MatTableDataSource<BusRoute>;
  allIds=[];
  editRoute(row:any){
    if (row.id == null){
      return;
    }
    console.log(row.id)
  }

  registerBusRoute(){
    this.router.navigateByUrl('/dashboard/multiform')
  }

  create(){
    this.router.navigateByUrl('/dashboard/busRoute/create');
  }

  addBusRoute2(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Register Bus Route',
      buttonName: 'Register'
    }

    const dialogRef = this.dialog.open(AddRouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        //add bus route object
        var busRouteObj = {
          id:"BusRoute"+Date.now(),
          routeNo:data.routeNo,
          description: data.description,
          destination: data.destination,
          arrival: data.arrival
        };
        this.dataApi.addBusRoute(busRouteObj);//data service to add bus route
        console.log('add', busRouteObj.id, data.busStops);
            //add bus stops in the bus route
        this.dataApi.addBusStop( busRouteObj.id, data.busStops);
        this.snackBar.open('Bus route is registered successfully.','OK',{
          duration: 2000
        });
      }
    })
  }

  editBusRoute2(row:any){
    if (row.id == null){
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data=row;
    dialogConfig.data.title="Edit Bus Route";
    dialogConfig.data.buttonName="Update";
    const dialogRef = this.dialog.open(AddRouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        //update bus route object
        var busRouteObj = {
          id:data.id,
          routeNo:data.routeNo,
          description: data.description,
          destination: data.destination,
          arrival: data.arrival
       };
        // console.log(this.dataApi.isBusRouteChange(data));
        console.log(busRouteObj);
        this.dataApi.updateBusRoute(busRouteObj);
        this.snackBar.open('Bus route is updated successfully.','OK',{
          duration: 2000
        });
      }
    })

  }
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
  ngOnInit(): void {
    this.getAllBusRoutes();


  }

  addBusRoute(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Register Bus Route',
      buttonName: 'Register'
    }

    const dialogRef = this.dialog.open(AddBusrouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        console.log(data);
        this.dataApi.addBusRoute(data); //data service
        this.snackBar.open('Bus route is registered successfully.','OK',{
          duration: 2000
        });
      }
    })

  }

  editBusRoute(row:any){
    if (row.id == null){
      return;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data= row;
    dialogConfig.data.title="Edit Bus Route";
    dialogConfig.data.buttonName="Update";

    const dialogRef = this.dialog.open(AddBusrouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        this.dataApi.updateBusRoute(data);
        this.snackBar.open('Bus route is updated successfully.','OK',{
          duration: 2000
        });
      }
    })

  }

  deleteBusRoute(row: any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Delete Bus Route',
      busRouteNo: row.routeNo
    }

    const dialogRef = this.dialog.open(DeleteBusRouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data=>{
      if(data){
        this.dataApi.deleteBusRoute(row.id);
        this.snackBar.open('Bus route deleted successfully.','OK',{
          duration: 2000
        });
      }
    })

  }

  getAllBusRoutes(){
    this.dataApi.getAllBusRoutes().subscribe(res=>{
      this.busRoutesArr=res.map((e:any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
      })
      console.log(this.busRoutesArr);
      this.dataSource = new MatTableDataSource(this.busRoutesArr);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // /////////////////////
      // this.routedata = new MatTableDataSource(this.busRoutesArr);
      // this.routedata.paginator = this.paginator;
      // this.routedata.sort = this.sort;
      // ////////////////////
    })
  }

  viewBusRoute(row:any){
    this.router.navigateByUrl('/dashboard/busRoute/'+row.id);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
