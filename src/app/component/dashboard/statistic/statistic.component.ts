
import {Chart, registerables} from 'node_modules/chart.js'
import {Component, OnInit, Injectable} from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';
import { BusDriver } from 'src/app/shared/model/bus-driver';
import { SevenDayRange } from './datepicker/sevenDayRange.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { Rate } from 'src/app/shared/model/rate';

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
  fromDate : any = 1;
  toDate : any = 1;
  driverId= "";

  highestQuantity={
    quantity: 0,
    rate: ""
  };

  selectedValue: string ="";
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    driver: new FormControl()
  });

  // BusDriver model
  busDriver: BusDriver[] = [];
  queryData: Rate[]=[];
  queryResult: any[] = [];

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

  async weeklyQuery(){
    if(this.fromDate==this.range.value.start
      &&this.toDate== this.range.value.end
      &&this.driverId==this.range.value.driver){
      window.alert("You have selected the same week, please select a different week.");
    }
    else{
      this.fromDate= this.range.value.start;
      this.toDate= this.range.value.end;
      this.driverId = this.range.value.driver;
      if(this.range.value.driver==null
        ||this.range.value.driver==""
        ||this.range.value.start==null
        ||this.range.value.end==null){
        window.alert('Please fill in the form')
      }
      else if(this.range.invalid){
        window.alert('Invalid Query, please try again')
      }
      else{
        if (this.fromDate && this.toDate != null){
          let dates: any[] = [];
          var collect : Rate[]=[];

          while(this.fromDate <= this.toDate){
            var num=0;
            var rateId = 'rate'+num;
            //console.log(this.simpleDate(fromDate))
            // while((await this.dataApi.getRate2((this.simpleDate(this.fromDate)), this.driverId, rateId))!=null){
            //   collect.push(await this.dataApi.getRate2((this.simpleDate(this.fromDate)), this.driverId, rateId))
            //   num++;
            //   rateId='rate'+num;
            // }
            let dataCollection = await this.dataApi.getRate((this.simpleDate(this.fromDate)), this.driverId)
            collect.push(dataCollection)
            dates = [...dates, new Date(this.fromDate)];
            this.fromDate.setDate(this.fromDate.getDate() + 1);
            num++;
          }

          this.queryData=collect;
          this.countRate(this.queryData);
        }
      }
    }
  }

  // add(hi:any){
  //   this.busDriver = hi;
  //   console.log(this.busDriver);
  // }
  simpleDate(date:any){
    return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  }

  countRate(rateList:any){
  console.log(rateList)
  console.log(rateList[1][2])
  var rate1 = 0;
  var rate2 = 0;
  var rate3 = 0;
  var rate4 = 0;
  var rate5 = 0;
  for(var i=0; i<rateList.length; i++){
    for(var obj of rateList[i]){
      if(obj.ratingLevel==1){
        rate1++;
        //specRate1++;
      }
      else if(obj.ratingLevel==2){
        rate2++;
        //specRate2++;
      }
      else if(obj.ratingLevel==3){
        rate3++;
        //specRate3++;
      }
      else if(obj.ratingLevel==4){
        rate4++;
        //specRate4++;
      }
      else if(obj.ratingLevel==5){
        rate5++;
        //specRate5++;
      }
    }
  }
  console.log(this.highQuantity(rate1, rate2, rate3, rate4, rate5))
  var result =[rate1,rate2,rate3,rate4,rate5];
  console.log(result)
}

highQuantity(r1:any, r2:any, r3:any, r4:any, r5:any){

  if(r1>r2 && r1>r3 && r1>r4 && r1>r5){
    this.highestQuantity.quantity=r1;
    this.highestQuantity.rate="1 Star"
  }
  else if(r2>r1 && r2>r3 && r2>r4 && r2>r5){
    this.highestQuantity.quantity=r2;
    this.highestQuantity.rate="2 Star"
  }
  else if(r3>r1 && r3>r2 && r3>r4 && r3>r5){
    this.highestQuantity.quantity=r3;
    this.highestQuantity.rate="3 Star"
  }
  else if(r4>r1 && r4>r2 && r4>r3 && r4>r5){
    this.highestQuantity.quantity=r4;
    this.highestQuantity.rate="4 Star";
  }
  else if(r5>r1 && r5>r2 && r5>r3 && r5>r4){
    this.highestQuantity.quantity=r5;
    this.highestQuantity.rate="5 Star"
  }
  return
}

      // console.log(specificDayRate);

      // ok(){
      //   // if(this.fromDate==this.range.value.start
      //   //   &&this.toDate== this.range.value.end
      //   //   &&this.driverId==this.range.value.driver){
      //   //   window.alert("You have selected the same week, please select a different week.");
      //   // }
      //   // else{
      //     //let queryData: any[] =[]
      //     this.dummyVal=100;
      //     this.fromDate= this.range.value.start;
      //     this.toDate= this.range.value.end;
      //     this.driverId = this.range.value.driver;
      //     if(this.range.value.driver==null
      //       ||this.range.value.driver==""
      //       ||this.range.value.start==null
      //       ||this.range.value.end==null){
      //       window.alert('Please fill in the form')
      //     }
      //     else if(this.range.invalid){
      //       window.alert('Invalid Query, please try again')
      //     }
      //     else{
      //       if (this.fromDate && this.toDate != null){
      //         let dates: any[] = [];
      //         var collect : Rate[]=[];
      //         while(this.fromDate <= this.toDate){
      //           //console.log(this.simpleDate(fromDate))
      //           this.dataApi.queryRate((this.simpleDate(this.fromDate)), this.driverId).subscribe(res=>{
      //             // var collect : Rate[]=[];
      //             res.map((e:any)=>{
      //               const data = e.payload.doc.data();
      //               data.id = e.payload.doc.id;
      //               return collect.push(data);
      //             })
      //             // this.queryData.push(collect);
      //             // console.log(this.queryData[0])
      //           })
      //           dates = [...dates, new Date(this.fromDate)];
      //           this.fromDate.setDate(this.fromDate.getDate() + 1);
      //         }
      //         this.queryData=collect;
      //         this.amount(this.queryData);

      //       }

      //       //console.log(this.simpleDate(this.range.value.start),this.simpleDate(this.range.value.end),this.range.value.driver)
      //       // this.dataApi.queryRate(this.simpleDate(this.range.value.start),this.simpleDate(this.range.value.end),this.range.value.driver)
      //       //console.log(await this.dataApi.getRate())
      //       // console.log(this.queryData);
      //       // console.log(this.queryData.length);


      //       // if(queryData.length>0){
      //       //   setTimeout(this.countRate(queryData),3000);
      //       // }
      //       //this.countRate(this.queryData);
      //   }
      // }

      // countRate(rateList:any){
      //   // console.log(rateList)
      //   // console.log(rateList.length)
      //   // console.log("length"+ rateList.length);

      //   var rate1 = 0;
      //   var rate2 = 0;
      //   var rate3 = 0;
      //   var rate4 = 0;
      //   var rate5 = 0;
      //   var specificDayRate: any[] = [];

      //   // if(typeof rateList == "undefined"
      //   // || rateList == null
      //   // || rateList.length == null
      //   // || rateList.length > 0) {
      //   //   window.alert("You have selected the same week, please select a different week.");
      //   // }
      //   // else {



      //     for(var i=0; i<rateList.length; i++){
      //       // var specRate1=0;
      //       // var specRate2=0;
      //       // var specRate3=0;
      //       // var specRate4=0;
      //       // var specRate5=0;
      //       //console.log(rateList.length)
      //       for(var j=0; j<rateList[i].length; j++) {
      //         console.log(rateList[i][j].ratingLevel)
      //         if(rateList[i][j].ratingLevel==1){
      //           rate1++;
      //           //specRate1++;
      //         }
      //         else if(rateList[i][j].ratingLevel==2){
      //           rate2++;
      //           //specRate2++;
      //         }
      //         else if(rateList[i][j].ratingLevel==3){
      //           rate3++;
      //           //specRate3++;
      //         }
      //         else if(rateList[i][j].ratingLevel==4){
      //           rate4++;
      //           //specRate4++;
      //         }
      //         else if(rateList[i][j].ratingLevel==5){
      //           rate5++;
      //           //specRate5++;
      //         }

      //       }
      //       // var dayRate ={
      //       //   ratingDate:rate.ratingDate,
      //       //   rate1:specRate1,
      //       //   rate2:specRate2,
      //       //   rate3:specRate3,
      //       //   rate4:specRate4,
      //       //   rate5:specRate5
      //       // }
      //       // specificDayRate.push(dayRate);
      //     }
      //     this.queryResult=[rate1,rate2,rate3,rate4,rate5];
      //     console.log(rateList)
      //   }
}
