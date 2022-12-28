import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BusRoute } from 'src/app/shared/model/bus-route';
import { DataService } from 'src/app/shared/service/data.service';
import { updateBusrouteComponent } from './update-busroute/update-busroute.component';
import { DeleteBusRouteComponent } from './delete-bus-route/delete-bus-route.component';
import { Router } from '@angular/router';
import { AddRouteComponent } from './add-route/add-route.component';
@Component({
  selector: 'app-bus-route',
  templateUrl: './bus-route.component.html',
  styleUrls: ['./bus-route.component.css']
})
export class BusRouteComponent implements OnInit {
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

  ngOnInit(): void {
    this.getAllBusRoutes();
  }

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
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
        // console.log('add', busRouteObj.id, data.busStops);
            //add bus stops in the bus route
        this.dataApi.addBusStop( busRouteObj.id, data.busStops);
        this.snackBar.open('Bus route saved successfully.','OK',{
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
    dialogConfig.data= row;
    dialogConfig.data.title="Edit Bus Route";
    dialogConfig.data.buttonName="Update";
    const dialogRef = this.dialog.open(updateBusrouteComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data)=>{
      if(data){
        this.dataApi.deleteBusStop(data);
        this.dataApi.addBusRoute(data);
        this.dataApi.updateBusStop(data);
        this.snackBar.open('Bus route updated successfully.','OK',{
          duration: 2000
        });
      }
    })
  }
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

  // addBusRoute(){
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {
  //     title: 'Register Bus Route',
  //     buttonName: 'Register'
  //   }

  //   const dialogRef = this.dialog.open(AddBusrouteComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(data=>{
  //     if(data){
  //       // console.log(data);
  //       this.dataApi.addBusRoute(data); //data service
  //       this.snackBar.open('Bus route saved successfully.','OK',{
  //         duration: 2000
  //       });
  //     }
  //   })

  // }

  // editBusRoute(row:any){
  //   if (row.id == null){
  //     return;
  //   }

  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data= row;
  //   dialogConfig.data.title="Edit Bus Route";
  //   dialogConfig.data.buttonName="Update";

  //   const dialogRef = this.dialog.open(AddBusrouteComponent, dialogConfig);
  //   dialogRef.afterClosed().subscribe(data=>{
  //     if(data){
  //       this.dataApi.updateBusRoute(data);
  //       this.snackBar.open('Bus route is updated successfully.','OK',{
  //         duration: 2000
  //       });
  //     }
  //   })

  // }

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
      console.log('busRoutes');
      this.dataSource = new MatTableDataSource(this.busRoutesArr);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    // if(this.dataApi.hasData()){
    //   // this will get the data which was previously stored in the memory
    //   // and there will be no HTTP request
    //   this.busRoutesArr = this.dataApi.getData();
    //   this.dataSource = new MatTableDataSource(this.busRoutesArr);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    //   console.log(this.busRoutesArr);
    // }
    // else{
    //   // old code
    //   this.dataApi.getAllBusRoutes().subscribe(res=>{
    //     this.dataApi.setData(res.map((e:any)=>{
    //       const data = e.payload.doc.data();
    //       data.id = e.payload.doc.id;
    //       return data;
    //     }))
    //   }),
    //   (error: any) => {
    //     console.log(error)
    //   }
    // }
  }

  viewBusRoute(row:any){
    this.router.navigate(['/dashboard/busRoute/'+row.id]);
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
