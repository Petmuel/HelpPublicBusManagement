import {Component} from '@angular/core';
export interface PeriodicElement {
  RouteNo: string;
  Description: string;
  Destination: string;
  Arrival: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {RouteNo: 'T802', Description: 'In Subang area', Destination: 'MRT Kwasa Damansara', Arrival: 'Help University'},
  {RouteNo: 'T805', Description: 'Shah Alam area', Destination: 'KTM Shah Alam', Arrival: 'I-City Mall'},
  {RouteNo: 'T707', Description: 'Blah Area', Destination: 'LRT Pasar Seni', Arrival: 'Pavillion Mall'}
];
@Component({
  selector: 'manage',
  templateUrl:'./manage.component.html',
  styleUrls:['./manage.component.css']
})

export class ManageBusRouteComponent{
  displayedColumns: string[] = ['RouteNo', 'Description', 'Destination', 'Arrival'];
  dataSource = ELEMENT_DATA;
}
