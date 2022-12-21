import { FormArray } from "@angular/forms";

export interface BusDriver {
  fullname:string,
  email:string,
  password: string,
  phoneNo: number,
  driverNo:string,
  currentLongitude:string,
  currentLatitude: string,
  status: string
}
