import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/shared/service/data.service';
@Component({
  selector: 'app-multiforms',
  templateUrl: './multiforms.component.html',
  styleUrls: ['./multiforms.component.css']
})
export class MultiformsComponent implements OnInit {

  constructor(
    private builder:FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private dataApi: DataService
    ) { }
  isLinear=true;
  ngOnInit(): void {
  }

  routeRegister= this.builder.group({
    route:this.builder.group({
      routeNo:this.builder.control('', Validators.required),
      description:this.builder.control('', Validators.required),
      destination:this.builder.control('', Validators.required),
      arrival:this.builder.control('', Validators.required)
    }),
    busStop:this.builder.group({
      name:this.builder.control('', Validators.required),
      address:this.builder.control('', Validators.required),
      longitude:this.builder.control('', Validators.required),
      latitude:this.builder.control('', Validators.required)
    })
  })

  get busRouteInfoForm(){
    return this.routeRegister.get("route") as FormGroup;
  }

  get busStopInfoForm(){
    return this.routeRegister.get("busStop") as FormGroup;
  }

  HandleSubmit(){
    if(this.routeRegister.valid){
      console.log(this.busRouteInfoForm.value)
      this.dataApi.addBusRoute(this.busRouteInfoForm.value);
      this.router.navigateByUrl('/dashboard/busRoute');
    }
  }

  back(){
    this.snackBar.open('Bus route is registered successfully.','OK',{
      duration: 2000
    });
  }

  exit(){
    this.router.navigateByUrl('/dashboard/busRoute');
  }
}
// <mat-step>
//       <ng-template matStepLabel>Done</ng-template>
//       <p>The bus route registration is completed</p>
//       <div>
//         <button mat-raised-button color="primary" (click)="back()">Back to bus routes</button>
//         <!-- <button mat-button (click)="stepper.reset()">Reset</button> -->
//       </div>
//     </mat-step>
