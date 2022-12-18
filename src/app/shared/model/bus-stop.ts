import { FormArray } from "@angular/forms";

export interface BusStop {
  routeNo: string;
  name: string;
  address : string;
  longitude: string;
  latitude: FormArray;
}
