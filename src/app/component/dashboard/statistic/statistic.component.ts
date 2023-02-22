
import {Chart, registerables} from 'node_modules/chart.js'
import {Component, OnInit, Injectable} from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';
import { BusDriver } from 'src/app/shared/model/bus-driver';
import { SevenDayRange } from './datepicker/sevenDayRange.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';

Chart.register(...registerables)

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SevenDayRange
    },
  ],
})
export class StatisticComponent implements OnInit {
  minDate: Date;
  maxDate: Date;

  selectedValue: string ="";
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    driver: new FormControl()
  });

  // BusDriver model
  busDriver: BusDriver[] = [
    // {
    //   "id": "hfRK37clJ8MEc0sPgyW01YyptVg2",
    //   "cLat": "",
    //   "email": "asd@gmail.com",
    //   "fullName": "Hazel Ponet",
    //   "password": "asdasd",
    //   "status": "",
    //   "driverNo": "asd123",
    //   "phoneNo": 123123,
    //   "cLong": ""
    // }
  ];


  constructor(private dataApi: DataService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();
   }

  ngOnInit(): void {
    this.RenderChart()

    this.getAllBusDrivers()
    // console.log(this.busDriver)
    // console.log(this.busDriver);
  }

  RenderChart(){
    console.log("Chart")
    new Chart("piechart", {
    type: 'pie',
    data: {
      labels: ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  new Chart("linechart", {
    type: 'line',
    data: {
      labels: ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'],
      datasets: [{
        label: '# of Rates',
        data: [12, 19, 3, 5, 23],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  new Chart("barchart", {
    type: 'bar',
    data: {
      labels: ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'],
      datasets: [{
        label: '# of Rates',
        data: [12, 19, 3, 5, 23],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  }

  //hardcoded the rating list on bus driver
  // lol(){
  //   var date = new Date()
  //   // var yesterday = new Date(date.getTime());
  //   //   yesterday.setDate(date.getDate() - 1);
  //   // console.log(yesterday.getDate()+"/"+yesterday.getDay()+"/"+yesterday.getFullYear())
  //   for(var l=1; l<31; l++){
  //     var yesterday = new Date(date.getTime());
  //     yesterday.setDate(date.getDate() - l);
  //     var currDay = yesterday.getDate()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getFullYear();
  //     var currDat2 = yesterday.getTime();
  //     var ran = Math.random() * 10;
  //     for(var i=0; i<ran; i++){
  //       var date = new Date();
  //       var num = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  //       var busDriverRate = {
  //         ratingId:"rate"+i,
  //         ratingDate: currDay,
  //         ratingLevel: num,
  //         comment: "I have added " + num+" Stars to this driver on "+currDay,
  //         busDriverId:'hfRK37clJ8MEc0sPgyW01YyptVg2'
  //       };
  //       this.dataApi.hi(currDay, busDriverRate, currDat2);
  //     }
  //   }
  // }

  getAllBusDrivers(){
    this.dataApi.getAllBusDrivers().subscribe(res=>{
      var collect : BusDriver[]=[];
      res.map((e:any)=>{
        const data = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return collect.push(data);
      })
      this.busDriver=collect;
    })
  }

  // add(hi:any){
  //   this.busDriver = hi;
  //   console.log(this.busDriver);
  // }
  async ok(){
    if(this.range.value.driver==null||this.range.value.driver==""||this.range.value.start==null){
      window.alert('Please fill in the form')
    }
    else{
      console.log(this.simpleDate(this.range.value.start),this.simpleDate(this.range.value.end),this.range.value.driver)
      this.dataApi.queryRate(this.simpleDate(this.range.value.start),this.simpleDate(this.range.value.end),this.range.value.driver)
      console.log(await this.dataApi.getRate())
    }

  }

  simpleDate(date:any){
    return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  }
}
