import { FormArray } from "@angular/forms";

export interface BusRoute {
  routeNo: string;
  description: string;
  destination : string;
  arrival: string;
  busStops: FormArray;
}
