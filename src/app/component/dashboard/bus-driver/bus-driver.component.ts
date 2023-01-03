import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BusDriver } from 'src/app/shared/model/bus-driver';
import { DataService } from 'src/app/shared/service/data.service';
import { DeleteBusRouteComponent } from '../bus-route/delete-bus-route/delete-bus-route.component';
import { AddBusDriverComponent } from './add-bus-driver/add-bus-driver.component';

@Component({
  selector: 'app-bus-driver',
  templateUrl: './bus-driver.component.html',
  styleUrls: ['./bus-driver.component.css']
})
export class BusDriverComponent implements OnInit {
  busDriversArr : BusDriver[] = [];
  displayedColumns: string[] = ['fullName', 'email', 'password', 'phoneNo', 'driverNo', 'action'];
  busDrivers: BusDriver[]=[];
  islisting = true;
  dataSource!: MatTableDataSource<BusDriver>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog,
    private dataApi: DataService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public snackBar: MatSnackBar) { }

    ngOnInit(): void {
      this.getAllBusDrivers();
    }
    ngDoCheck(): void {
      let currenturl = this.router.url;
      if (currenturl=='/dashboard/busDriver'){
        this.islisting=true;
      }
      else{
        this.islisting=false;
      }
    }

    addBusDriver(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: 'Register Bus Driver',
        buttonName: 'Register'
      }

      const dialogRef = this.dialog.open(AddBusDriverComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data=>{
        if(data){
          this.dataApi.addBusDriver(data);
        }
      })
    }

    editBusDriver(row:any){
      if (row.id == null){
        return;
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data= row;
      dialogConfig.data.title="Edit Bus Driver";
      dialogConfig.data.buttonName="Update";
      const dialogRef = this.dialog.open(AddBusDriverComponent, dialogConfig);
      dialogRef.afterClosed().subscribe((data)=>{
        if(data){
          this.dataApi.updateBusDriver(data)
          this.snackBar.open('Bus driver updated successfully.','OK',{
            duration: 2000
          });
        }
      })
    }

    deleteBusDriver(row: any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: 'Delete Bus Driver',
        busRouteNo: row.fullName
      }

      const dialogRef = this.dialog.open(DeleteBusRouteComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(data=>{
        if(data){
          this.dataApi.deleteBusDriver(row);
          this.snackBar.open('Bus driver deleted successfully.','OK',{
            duration: 2000
          });
        }
      })

    }

    getAllBusDrivers(){
      this.dataApi.getAllBusDrivers().subscribe(res=>{
        this.busDriversArr=res.map((e:any)=>{
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        })
        console.log(this.busDriversArr);
        this.dataSource = new MatTableDataSource(this.busDriversArr);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
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


