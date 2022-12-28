import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddRouteComponent } from '../../bus-route/add-route/add-route.component';

@Component({
  selector: 'app-add-bus-driver',
  templateUrl: './add-bus-driver.component.html',
  styleUrls: ['./add-bus-driver.component.css']
})
export class AddBusDriverComponent implements OnInit {
  busDriverRegister !: FormGroup;
  title!: string;
  fullName !: string;
  email !: string;
  password !: string;
  driverNo !: string;
  id !: string;
  buttonName!: string;
  phoneNo!: string;

  constructor(
    private fb : FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef:  MatDialogRef<AddRouteComponent>,
    private route:ActivatedRoute
    ) {
      this.id = data.id;
      this.title = data.title;
      this.fullName = data.fullName;
      this.email = data.email;
      this.password = data.password;
      this.driverNo = data.driverNo;
      this.phoneNo = data.phoneNo;
      this.buttonName = data.buttonName;

    }

  ngOnInit(): void {
    this.busDriverRegister = this.fb.group({
      id:[this.id, []],
      fullName:[this.fullName, [Validators.required]],
      email: [this.email, [Validators.required, Validators.email]],
      password: [this.password, [Validators.required, Validators.minLength(6)]],
      driverNo: [this.driverNo, [Validators.required]],
      phoneNo:[this.phoneNo, [Validators.required]],
      cLong:[''],
      cLat:[''],
      status:['']
    })
  }

  hide = true;

  cancelRegistration(){
    this.dialogRef.close()
  }

  registerBusDriver(){
    this.dialogRef.close(this.busDriverRegister.value);
  }

}
