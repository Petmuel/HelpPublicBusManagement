import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-busroute',
  templateUrl: './add-busroute.component.html',
  styleUrls: ['./add-busroute.component.css']
})
export class AddBusrouteComponent implements OnInit {

  form !: FormGroup;
  title!: string;
  routeNo !: string;
  description !: string;
  destination !: string;
  arrival !: string;
  id !: string;
  buttonName!: string;

  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef:  MatDialogRef<AddBusrouteComponent>
    ) {
      this.id = data.id;
      this.title = data.title;
      this.routeNo = data.routeNo;
      this.description = data.description;
      this.destination = data.destination;
      this.arrival = data.arrival;
      this.buttonName = data.buttonName;
    }

  ngOnInit(): void {
    this.form = this.fb.group({
      id:[this.id, []],
      routeNo:[this.routeNo, [Validators.required]],
      description: [this.description, [Validators.required]],
      destination: [this.destination, [Validators.required]],
      arrival: [this.arrival, [Validators.required]]
    })
  }

  cancelRegistration(){
    this.dialogRef.close()
  }

  registerBusRoute(){
    this.dialogRef.close(this.form.value);
  }

}
