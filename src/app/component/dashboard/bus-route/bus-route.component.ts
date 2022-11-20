import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BusRoute } from 'src/app/shared/model/bus-route';
import { DataService } from 'src/app/shared/service/data.service';
import { AddBusrouteComponent } from './add-busroute/add-busroute.component';
import { DeleteBusRouteComponent } from './delete-bus-route/delete-bus-route.component';

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
    private _snackBar: MatSnackBar) { }

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
        this.dataApi.addBusRoute(data);
        this.openSnackBar("Registration of bus route is successful.", "OK")
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
        this.openSnackBar("Bus route is udpated successfully.", "OK")
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
        this.openSnackBar("Bus route deleted successfully.", "OK")
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
    })
  }

  viewBusRoute(row:any){
    window.open('/dashboard/busRoute/'+row.id, '_blank');
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