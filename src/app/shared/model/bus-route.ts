import { FormArray } from "@angular/forms";

export interface BusRoute {
  routeNo: string;
  id:string;
  description: string;
  destination : string;
  arrival: string;
  busStops: FormArray;
}
