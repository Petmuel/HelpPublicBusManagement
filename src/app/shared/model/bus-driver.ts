import { FormArray } from "@angular/forms";

export interface BusDriver {
  id: string,
  fullName:string,
  email:string,
  password: string,
  phoneNo: number,
  driverNo:string,
  status: string,
  cLat: string,
  cLong: string
}
