import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-bus-route',
  templateUrl: './delete-bus-route.component.html',
  styleUrls: ['./delete-bus-route.component.css']
})
export class DeleteBusRouteComponent implements OnInit {
  busRouteNo !: string;
  title !: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef:  MatDialogRef<DeleteBusRouteComponent>

  ) {
    this.busRouteNo = data.busRouteNo;
    this.title= data.title;
  }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }

  delete(){
    const deleteBusRoute = true;
    this.dialogRef.close(deleteBusRoute);
  }
}
