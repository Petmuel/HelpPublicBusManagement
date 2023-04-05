
import {Chart, registerables} from 'node_modules/chart.js'
import {Component, OnInit, Injectable} from '@angular/core';
import { noOfPassengersService } from 'src/app/shared/service/noOfPassengers.service';
import { BusDriver } from 'src/app/shared/model/bus-driver';
import { SevenDayRange } from './datepicker/sevenDayRange.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { Rate } from 'src/app/shared/model/rate';
import { MatRadioChange } from '@angular/material/radio';
import { BusRoute } from 'src/app/shared/model/bus-route';
import { DataService } from 'src/app/shared/service/data.service';
import { NoP } from 'src/app/shared/model/noOfPassenger';
import { workingHoursService } from 'src/app/shared/service/workingHours.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

Chart.register(...registerables)

@Component({
  selector: 'app-workingHours',
  templateUrl: './workingHours.component.html',
  styleUrls: ['./workingHours.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SevenDayRange
    },
  ],
})
export class workingHoursComponent implements OnInit {
  // isProgressBarVisible=false;
  // minDate: Date;
  // maxDate: Date;
  // fromDate:any;
  // toDate:any;
  // driverId= "";

  // //monthly selection data
  // yearList: number[]=[];
  // monthNames = ["January", "February", "March", "April", "March", "June",
  //   "July", "August", "September", "October", "November", "December"];

  // //monthly query data
  // monthYear="";
  // mdriverId= "";
  // selectedYear=0;

  // dateArray:any[]=[];
  // highestQuantity={
  //   quantity: 0,
  //   busStop: "",
  //   busStopID:""
  // };

  // averageDaily={
  //   quantity: "0",
  //   busStop: ""
  // }

  // topDayPassenger={
  //   quantity: 0,
  //   busStop: "",
  //   day: "",
  //   date: ""
  // }

  //  //monthly data result
  //  mHighestQuantity={
  //   quantity: 0,
  //   busStop: "",
  //   busStopID:""
  // };

  // mAverageDaily={
  //   quantity: "0",
  //   busStop: "",
  // }

  // mTopDayRate={
  //   quantity: 0,
  //   busStop: "",
  //   day: "",
  //   date: ""
  // }

  // //type of weekly charts
  // wkHrline:any=null;
  // wkHrbar:any=null;

  // //type of monthly charts
  // wkHrline2:any=null;
  // wkHrbar2:any=null;

  // busDriver: BusDriver[] = [];  // BusDriver model
  // queryData: Rate[]=[]; //weekly rating data
  // queryResult: any[] = []; //ratings quantity

  // mQueryData: Rate[]=[]; //monthly rating data
  // mQueryResult: any[] = []; //monthly ratings quantity

  // barData:any;
  // // datas =
  // // {
  // //   labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
  // //   datasets: [{
  // //     label: '# of Ratings',
  // //     data: [0,0,0,0,0],
  // //     backgroundColor: [
  // //       'rgba(255, 26, 104, 0.6)',
  // //       'rgba(54, 162, 235, 0.6)',
  // //       'rgba(255, 206, 86, 0.6)',
  // //       'rgba(75, 192, 192, 0.6)',
  // //       'rgba(153, 102, 255, 0.6)'
  // //     ],
  // //     borderColor: [
  // //       'rgba(255, 26, 104, 1)',
  // //       'rgba(54, 162, 235, 1)',
  // //       'rgba(255, 206, 86, 1)',
  // //       'rgba(75, 192, 192, 1)',
  // //       'rgba(153, 102, 255, 1)'
  // //     ],
  // //     borderWidth: 2,
  // //     hoverOffset: 4
  // //   }]
  // // }

  // line3Data:any;
  // lineData1:any;

  // selectedValue: string ="";
  // weekHr = new FormGroup({
  //   start: new FormControl<Date | null>(null),
  //   end: new FormControl<Date | null>(null),
  //   driver: new FormControl()
  // })

  // monthHr = new FormGroup({
  //   selectedYear: new FormControl(),
  //   monthYear: new FormControl(),
  //   driver: new FormControl()
  // })

  // constructor(private nopService: noOfPassengersService, private dataApi: DataService,
  //   private wkHrService:workingHoursService) {
  //   const currentYear = new Date().getFullYear();
  //   this.minDate = new Date(currentYear - 20, 0, 1);
  //   this.maxDate = new Date();
  //   this.yearList.push(currentYear);
  //   this.yearList.push(currentYear-1);
  //   this.yearList.push(currentYear-2);
  //  }

  // ngOnInit(): void {
  //   this.RenderChart();
  //   this.getAllBusDrivers();
  // }

  // RenderChart(){
  //   console.log("Chart")
  //   let options={
  //     scales: {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }
  //   }
  //   //weekly chart
  //   this.wkHrline = new Chart("wkHrlinechart", {
  //     type: 'line',
  //     data:this.line3Data,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false
  //         }
  //       },
  //       hover: {
  //         mode: 'index',
  //       },
  //       scales: {
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Day'
  //           }
  //         },
  //         y: {
  //           title: {
  //             display: true,
  //             text: 'Number of Passengers'
  //           }
  //         }
  //       }
  //     }
  //   });

  //   this.wkHrbar = new Chart("wkHrbarchart", {
  //     type: 'bar',
  //     data: this.barData,
  //     options: {
  //       scales: {
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Bus Stops'
  //           }
  //         },
  //         y: {
  //           title: {
  //             display: true,
  //             text: 'Number of Passengers'
  //           }
  //         }
  //       }
  //     }
  //   });

  //   //monthly chart
  //   this.wkHrline2 = new Chart("wkHrlinechart2", {
  //     type: 'line',
  //     data:this.lineData1,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         tooltip: {
  //           mode: 'index',
  //           intersect: false
  //         }
  //       },
  //       hover: {
  //         mode: 'index',
  //       },
  //       scales: {
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Weeks'
  //           }
  //         },
  //         y: {
  //           title: {
  //             display: true,
  //             text: 'Number of Ratings'
  //           }
  //         }
  //       }
  //     }
  //   });

  //   this.wkHrbar2 = new Chart("wkHrbarchart2", {
  //     type: 'bar',
  //     data: this.barData,
  //     options: {
  //       scales: {
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Types of Rating'
  //           }
  //         },
  //         y: {
  //           title: {
  //             display: true,
  //             text: 'Number of Ratings'
  //           }
  //         }
  //       }
  //     }
  //   });
  // }

  // getRandomColor() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

  // updateChart(chartData:any, isMonthly: boolean){
  //   let totalNops =chartData.map((a: { totalNop: any; })=>a.totalNop);//number of passengers
  //   let busStops = chartData.map((a: { name: any; })=>a.name);//bus stop names
  //   let barData:any =
  //   {
  //     labels: [],
  //     datasets: [{
  //       label: '',
  //       data: [],
  //       backgroundColor:[],
  //       borderWidth: 2,
  //       hoverOffset: 4
  //     }]
  //   }

  //   if(isMonthly){
  //     barData.labels=busStops;
  //     busStops.forEach((a:any)=>{
  //       barData.datasets[0].backgroundColor.push(this.getRandomColor());
  //     })
  //     barData.datasets.label='# of Passengers'
  //     console.log(totalNops)
  //     barData.datasets[0].data=totalNops;
  //     console.log(barData)
  //     this.wkHrbar2.data=barData;
  //     this.wkHrbar2.update();
  //   }
  //   else{
  //     barData.labels=busStops;
  //     busStops.forEach((a:any)=>{
  //       barData.datasets[0].backgroundColor.push(this.getRandomColor());
  //     })
  //     barData.datasets.label='# of Passengers'
  //     console.log(totalNops)
  //     barData.datasets[0].data=totalNops;
  //     console.log(barData)
  //     this.wkHrbar.data=barData;
  //     this.wkHrbar.update();
  //   }
  // }

  // updateLineChart(allNops:any, dateArr:any, periodic: string, unique:any){
  //   let weekLabel=[];
  //   let lineDataSets=[];
  //   //weekly line chart as default
  //   var selectedLine = this.wkHrline;
  //   //replace to monthly line chart
  //   if(periodic=="month"){
  //     selectedLine=this.wkHrline2;

  //     for(var i=0;i<allNops.length;i++) {
  //       let dataset:any = {
  //         label: '',
  //         data: [],
  //         color: [],
  //         borderWidth: 2
  //       }
  //       let allWeeksNops=[];
  //       for(var v=0; v<unique.length; v++) {
  //         for(var weekArr of allNops[i]){
  //           let count=0;
  //           switch(weekArr[0].busStopID){
  //             case (unique[v].busStopID):
  //               weekArr.forEach((day: { quantity: number; }) => {
  //                 count+=day.quantity;
  //               });
  //               allWeeksNops.push(count);
  //               break;
  //             default:
  //               break;
  //           }
  //         }

  //       }
  //       dataset.data = allWeeksNops;

  //       dataset.label= allNops[i][0][0].busStop
  //       dataset.color= this.getRandomColor();
  //       lineDataSets.push(dataset)
  //     }
  //     for(var i=0; i<allNops[0].length; i++){
  //       weekLabel.push("Week "+(i+1))
  //     }
  //     selectedLine.data.datasets=lineDataSets;
  //     selectedLine.data.labels=weekLabel;
  //   }
  //   else{

  //     for(var i=0;i<allNops.length;i++) {
  //       let dataset:any = {
  //         label: '',
  //         data: [],
  //         color: [],
  //         borderWidth: 2
  //       }
  //       let starArr=[];
  //       for(var obj of allNops[i]){
  //         starArr.push(obj.quantity)
  //       }
  //       //to update and overwrite each data
  //       dataset.data = starArr;
  //       dataset.label= allNops[i][0].busStop
  //       dataset.color= this.getRandomColor();
  //       lineDataSets.push(dataset)
  //       // selectedLine.data.datasets[i].data=starArr;
  //     }
  //     selectedLine.data.datasets=lineDataSets;
  //     selectedLine.data.labels=dateArr;
  //   }
  //   selectedLine.update()
  //   this.isProgressBarVisible=false;
  // }

  // getAllBusDrivers(){
  //   this.dataApi.getAllBusDrivers().subscribe(res=>{
  //     var collect : BusDriver[]=[];
  //     res.map((e:any)=>{
  //       const data = e.payload.doc.data();
  //       data.id = e.payload.doc.id;
  //       return collect.push(data);
  //     })
  //     this.busDriver=collect;
  //   })
  // }

  // async weeklyQuery(){
  //   if(this.fromDate==this.weekHr.value.start
  //     &&this.toDate== this.weekHr.value.end
  //     &&this.driverId==this.weekHr.value.driver){
  //     window.alert("You have selected the same week, please select a different week.");
  //   }
  //   else{
  //     this.fromDate= this.weekHr.value.start;
  //     this.toDate= this.weekHr.value.end;
  //     this.driverId = this.weekHr.value.driver;
  //     if(this.weekHr.value.driver==null
  //       ||this.weekHr.value.driver==""
  //       ||this.weekHr.value.start==null
  //       ||this.weekHr.value.end==null){
  //       window.alert('Please fill in the form')
  //     }
  //     else if(this.weekHr.invalid){
  //       window.alert('Invalid Query, please try again')
  //     }
  //     else{
  //       this.isProgressBarVisible=true;

  //       if (this.fromDate && this.toDate != null){
  //         var collect : Rate[]=[];
  //         let dateArr:any[]=[];
  //         let simpleDateArr:any[]=[];
  //         let checkData= await this.wkHrService.getAllDriverRecordsAndWorkingHours((this.simpleDate(this.fromDate)), this.driverId);
  //         let checkData2= await this.wkHrService.getAllDriverRecordsAndWorkingHours((this.simpleDate(this.toDate)), this.driverId);
  //         // if(checkData.length==0||checkData2.length==0){
  //         //   this.isProgressBarVisible=false;
  //         //   window.alert("Please select other week as the chosen week's data is incomplete.")
  //         // }
  //         // else{
  //           while(this.fromDate <= this.toDate){
  //             let dataCollection = await this.wkHrService.getAllDriverRecordsAndWorkingHours((this.simpleDate(this.fromDate)), this.driverId)
  //             collect.push(dataCollection);
  //             dateArr.push(this.properDateformat(this.fromDate));
  //             this.fromDate.setDate(this.fromDate.getDate() + 1);
  //           }
  //           this.queryData=collect;
  //           console.log(this.queryData)
  //           // let uniqueArr = this.getUniqueNopArr(this.queryData)
  //           // this.countNop(this.queryData, uniqueArr);
  //           // this.countPerDay(this.queryData, dateArr, uniqueArr);
  //         }
  //       }

  //   }
  // }

  // async monthlyQuery(){
  //   if(this.selectedYear==this.monthHr.value.selectedYear
  //     &&this.monthYear== this.monthHr.value.monthYear
  //     &&this.mdriverId==this.monthHr.value.driver){
  //     window.alert("You have selected the same week, please select a different week.");
  //   }
  //   else{
  //     this.selectedYear= this.monthHr.value.selectedYear;
  //     this.monthYear= this.monthHr.value.monthYear;
  //     this.mdriverId = this.monthHr.value.driver;
  //     console.log(this.monthHr.value)
  //     if(this.monthHr.value.driver==null
  //       ||this.monthHr.value.driver==""
  //       ||this.monthHr.value.selectedYear==null
  //       ||this.monthHr.value.monthYear==null){
  //       window.alert('Please fill in the form')
  //     }
  //     else if(this.monthHr.invalid){
  //       window.alert('Invalid Query, please try again')
  //     }
  //     else{
  //       this.isProgressBarVisible=true;

  //       if (this.selectedYear && this.monthYear != null){
  //         let dates: any[] = [];
  //         var collect : Rate[]=[];
  //         let dateArr:any[]=[];
  //         let simpleDateArr:any[]=[];
  //         const fromDate = new Date(this.selectedYear, this.monthNames.indexOf(this.monthYear),1);
  //         const toDate = new Date(this.selectedYear, this.monthNames.indexOf(this.monthYear)+1,0);

  //         let checkData= await this.nopService.getNopsFromBusRouteAndDate((this.simpleDate(fromDate)), this.mdriverId)
  //         if(checkData.length==0){
  //           this.isProgressBarVisible=false;
  //           window.alert("Please select another month as the chosen month's data is incomplete.")
  //         }
  //         else{
  //           while(fromDate <= toDate){
  //             var num=0;
  //             let dataCollection = await this.nopService.getNopsFromBusRouteAndDate((this.simpleDate(fromDate)), this.mdriverId)
  //             collect.push(dataCollection);
  //             dateArr.push(this.properDateformat(fromDate));
  //             simpleDateArr.push(this.simpleDate(fromDate));
  //             dates = [...dates, new Date(fromDate)];
  //             fromDate.setDate(fromDate.getDate() + 1);
  //             num++;
  //           }
  //           this.mQueryData=collect;
  //           let uniqueArr = this.getUniqueNopArr(this.mQueryData)
  //           this.countNop(this.mQueryData, uniqueArr);
  //           this.countPerWeek(this.mQueryData, dateArr, simpleDateArr, uniqueArr);
  //         }
  //       }
  //     }
  //   }
  // }

  // //count passenger quantity per week for each rate star
  // async countPerWeek(nopList:any, dateArr:any, simpleDateArr:any, unique:any){
  //   console.log(nopList, dateArr, unique)
  //   let week=7;
  //   let monthEachStarRate:any[]=[];
  //   let nopListPerDay:any[]=[];
  //   for(var i=0; i<unique.length;i++){
  //     let weeklyNops:any[]=[];
  //     let countingNops:any[]=[];

  //     for(var day=0; day<simpleDateArr.length; day++){
  //       let dateNop={
  //         date: "",
  //         busStopID:"",
  //         busStop:"",
  //         quantity: 0
  //       };
  //       //if day has already reached to the end of week
  //       if(day==week){
  //         weeklyNops.push(countingNops);
  //         countingNops=[];  //week1=[day1,day2,dy3,dy4,dy5,dy6,dy7], week2=[],
  //         week+=7
  //       }

  //       for(var k=0; k<nopList.length;k++){
  //         nopList[k].forEach((obj: {countedDateTime: any;numberOfPassenger: number; busStopID: any;}) => {
  //           if(obj.busStopID == unique[i].busStopID&&obj.countedDateTime==simpleDateArr[day]){
  //             dateNop.quantity+=obj.numberOfPassenger;
  //           }
  //         });
  //       }
  //       let busStop= await this.dataApi.getBusStopById(unique[i].busStopID);
  //       dateNop.busStopID=busStop.busStopID;
  //       dateNop.busStop=busStop.name;
  //       dateNop.date=dateArr[day];
  //       countingNops.push(dateNop);

  //       if(dateArr.length-day==1){
  //         weeklyNops.push(countingNops);
  //         countingNops=[];
  //         week=7;
  //       }
  //     }
  //     monthEachStarRate.push(weeklyNops);
  //   }
  //   console.log(monthEachStarRate)

  //   this.updateLineChart(monthEachStarRate, dateArr, "month", unique);

  //   // let week=7;
  //   // let monthEachStarRate:any[]=[];
  //   // for(var v=1; v<6; v++){
  //   //   let weeklyRatings:any[]=[];
  //   //   let countingRates:any[]=[];
  //   //   for(var day=0; day<rateList.length; day++){
  //   //     let ratingPerDay={
  //   //       quantity:0,
  //   //       level:"",
  //   //       date:""
  //   //     }
  //   //     //if day has already reached to the end of week
  //   //     if(day==week){
  //   //       weeklyRatings.push(countingRates);
  //   //       countingRates=[];  //week1=[day1,day2,dy3,dy4,dy5,dy6,dy7], week2=[],
  //   //       week+=7
  //   //     }

  //   //     //each rate object from the same day
  //   //     for(var obj of rateList[day]){
  //   //       //if the rate is same as the selected rate level
  //   //       if(obj.ratingLevel==v){
  //   //         ratingPerDay.quantity++
  //   //       }
  //   //     }
  //   //     ratingPerDay.date=rateList[day][0].ratingDate;
  //   //     ratingPerDay.level= v+" Star";
  //   //     //push the total same rate quantity from the same day into the week arr
  //   //     countingRates.push(ratingPerDay); //week1:day1.quantity, day2.quantity

  //   //     if(rateList.length-day==1){
  //   //       weeklyRatings.push(countingRates);
  //   //       countingRates=[];
  //   //       week=7;
  //   //     }
  //   //   }
  //   //   monthEachStarRate.push(weeklyRatings); //1 Star=[wk1[],wk2[],wk3[],wk4[],wk5[]]
  //   // }
  //   // this.updateLineChart(monthEachStarRate, dateArr, "month");

  // }

  // async countPerDay(nopList:any, dateArr:any, unique:any){
  //   let nopListPerDay:any[]=[];
  //   for(var i=0; i<unique.length;i++){
  //     let nops =[];
  //     for(var k=0; k<nopList.length;k++){
  //       let dateNop={
  //         date: "",
  //         busStop:"",
  //         quantity: 0
  //       };
  //       nopList[k].forEach((obj: {numberOfPassenger: number; busStopID: any;}) => {
  //         if(obj.busStopID == unique[i].busStopID){
  //           dateNop.quantity+=obj.numberOfPassenger;
  //         }
  //       });
  //       let busStop= await this.dataApi.getBusStopById(unique[i].busStopID);
  //       dateNop.busStop=busStop.name;
  //       dateNop.date=nopList[k][0].countedDateTime;
  //       nops.push(dateNop);
  //     }
  //     nopListPerDay.push(nops);
  //   }
  //   console.log(nopListPerDay)

  //   this.updateLineChart(nopListPerDay, dateArr, "week", unique);
  // }

  // //convert data format into a simple string format
  // simpleDate(date:any){
  //   return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  // }

  // getUniqueNopArr(nopList:any){
  //   let findDuplicates = (arr: any[]) => arr.filter((item, index) => arr.indexOf(item.busStopID) !== index)
  //   let unique = [...new Set(findDuplicates(nopList[0]))] // Unique duplicates
  //   return unique;
  // }
  // //count the number of each rating
  // async countNop(nopList:any, unique:any){
  //   console.log(unique)
  //   let allResults:any[]=[];

  //   const busStopNopObjBody = {
  //     name:'',
  //     busStopID: '',
  //     totalNop: 0,
  //   };

  //   let busStopNopArr:any[] = [];
  //   for (let i = 0; i <unique.length; i++) {
  //     let busStopObj = await this.dataApi.getBusStopById(unique[i].busStopID);
  //     busStopNopArr.push({ ...busStopNopObjBody  });
  //     busStopNopArr[i].busStopID = unique[i].busStopID;
  //     busStopNopArr[i].name = busStopObj.name;
  //   }


  //   for(var u of unique){
  //     let result =[];

  //     for(var k of nopList){
  //       result.push(k.find((x: { busStopID: any; }) => x.busStopID===u.busStopID))
  //     }
  //     switch(result.length){
  //       case (0):{
  //         break;
  //       }
  //       default:
  //         var index = busStopNopArr.findIndex((x: { busStopID: any; }) => x.busStopID===u.busStopID)
  //         result.forEach(obj=>{
  //           busStopNopArr[index].totalNop+=obj.numberOfPassenger;
  //         });
  //         allResults.push(result);
  //         break;
  //     }
  //   }
  //   var isMonthly = true;
  //   if(nopList.length>7){
  //     this.highQuantity(busStopNopArr, isMonthly, nopList.length, allResults);
  //     this.mQueryResult =busStopNopArr.map(a=>a.totalNop);
  //     this.updateChart(busStopNopArr, isMonthly);
  //   }
  //   else{
  //     this.highQuantity(busStopNopArr, !isMonthly, 7, allResults);
  //     this.updateChart(busStopNopArr, !isMonthly)
  //   }
  // }

  // //find the highest quantity of nop
  // async highQuantity(nopObjs:any[], isMonthly: boolean, days: number, busStops:any[]){
  //   const maxRate = nopObjs.reduce(function(prev, current) {
  //     return (prev.totalNop > current.totalNop) ? prev : current
  //   });
  //   let busStop = await this.dataApi.getBusStopById(maxRate.busStopID);
  //   if(isMonthly) {
  //     this.mHighestQuantity.quantity=maxRate.totalNop;
  //     this.mHighestQuantity.busStop=maxRate.name;
  //     this.mHighestQuantity.busStopID=busStop.busStopID;
  //     //find the day with top ratings
  //     var max = this.dayTopRate(this.mHighestQuantity, busStops);
  //     this.mTopDayRate= this.getHighestRateObj(max);
  //     //get average daily amount of the highest rating quantity
  //     this.mAverageDaily.busStop=maxRate.name;
  //     this.mAverageDaily.quantity=(maxRate.totalNop/days).toPrecision(3);
  //   }
  //   else{
  //     this.highestQuantity.quantity=maxRate.totalNop;
  //     this.highestQuantity.busStop=busStop.name;
  //     this.highestQuantity.busStopID=busStop.busStopID;
  //     //find the day with top ratings
  //     var max=this.dayTopRate(this.highestQuantity, busStops);
  //     this.topDayPassenger= this.getHighestRateObj(max);
  //     //get average daily amount of the highest rating quantity
  //     this.averageDaily.busStop=this.highestQuantity.busStop;
  //     this.averageDaily.quantity=(this.highestQuantity.quantity/days).toPrecision(3);
  //   }
  // }

  // //find the day with the most amount of the highest passengers quantity
  // dayTopRate(highQuantity: any, nopList:any[]){
  //   let result:any[]=[];
  //   for(var k of nopList){
  //     if((k.find((x: { busStopID: String; }) => x.busStopID===highQuantity.busStopID))!=null){
  //       k.forEach((a: {busStopID:String, countedDateTime: String; numberOfPassenger: Number; })=>{
  //         result.push({date:a.countedDateTime, quantity: a.numberOfPassenger, busStop:highQuantity.busStop});
  //       })
  //     }
  //   }
  //   const max = result.reduce(function(prev, current) {
  //     return (prev.quantity > current.quantity) ? prev : current
  //   })
  //   return max;
  // }

  // getHighestRateObj(maxNopObj: any){
  //   var days = [' (Sunday)', ' (Monday)', ' (Tuesday)', ' (Wednesday)', ' (Thursday)', ' (Friday)', ' (Saturday)'];
  //   const str = maxNopObj.date;
  //   const [day, month, year] = str.split('-');
  //   const date = new Date(+year, +month - 1, +day);
  //   var topDayPassenger ={
  //     day: days[date.getDay()],
  //     busStop: "("+maxNopObj.busStop+")",
  //     quantity: maxNopObj.quantity,
  //     date: this.properDateformat(date)
  //   }
  //   return topDayPassenger;
  // }

  // properDateformat(date:any){
  //   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  //   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   const m = monthNames[date.getMonth()]
  //   return date.getDate()+" "+m+" "+date.getFullYear();
  // }

  // //update month select dropdown list values
  // updateMonthList(yearRadio: MatRadioChange){
  //   let monthArr=[];
  //   if(yearRadio.value == new Date().getFullYear()){
  //     var i=0;
  //     while(i!=new Date().getMonth()){
  //       monthArr.push(this.monthNames[i]);
  //       i++;
  //     }
  //   }
  //   else{
  //     monthArr=["January", "February", "March", "April", "March", "June",
  //     "July", "August", "September", "October", "November", "December"];
  //   }
  //   this.monthNames=monthArr;
  // }

  //   //hardcoded the rating list on bus driver
  // // async lol(){
  // //   // this.nopService.hi();
  // //   var date = new Date()
  // //   var stops= await this.dataApi.getBusStopsByRoute("BusRoute1680460045688")
  // //   // var yesterday = new Date(date.getTime());
  // //   //   yesterday.setDate(date.getDate() - 1);
  // //   // console.log(yesterday.getDate()+"/"+yesterday.getDay()+"/"+yesterday.getFullYear())
  // //   for(var stop of stops) {

  // //     // for(var l=0; l<14; l++){
  // //     //   var yesterday = new Date(date.getTime());
  // //     //   yesterday.setDate(date.getDate() + l );
  // //     //   var currDay = yesterday.getDate()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getFullYear();
  // //     //   var currDat2 = yesterday.getTime();
  // //     //   var ran = Math.floor(Math.random() * 100);

  // //     //     var date = new Date();
  // //     //     var num = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  // //     //     var noOfP = {
  // //     //       busDriverId:"hfRK37clJ8MEc0sPgyW01YyptVg2",
  // //     //       busRouteId: "NMQlnUla3nfKcRiyZZyi",
  // //     //       recordDate: currDay
  // //     //     };
  // //     //     this.wkHrService.hi(currDay, noOfP, ran);

  // //     //   }

  // //     for(var l=0; l<35; l++){
  // //       var yesterday = new Date(date.getTime());
  // //       yesterday.setDate(date.getDate() - l );
  // //       var currDay = yesterday.getDate()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getFullYear();
  // //       var currDat2 = yesterday.getTime();
  // //       var ran = Math.floor(Math.random() * 100);

  // //         var date = new Date();
  // //         var num = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  // //         var noOfP = {
  // //           busDriverId:"hfRK37clJ8MEc0sPgyW01YyptVg2",
  // //           busRouteId: "NMQlnUla3nfKcRiyZZyi",
  // //           recordDate: currDay
  // //         };
  // //         this.wkHrService.hi(currDay, noOfP, ran);

  // //       }
  // //     }
  // //   }
  isProgressBarVisible=false;
  minDate: Date;
  maxDate: Date;
  fromDate : any = 1;
  toDate : any = 1;
  driverId= "";
  isDailyWorkingHourFatch = false;
  isMonthlyWorkingHourFetch = false;

  //monthly selection data
  yearList: number[]=[];
  monthNames = ["January", "February", "March", "April", "March", "June",
    "July", "August", "September", "October", "November", "December"];

  //monthly query data
  monthYear="";
  mDriverId= "";
  selectedYear=0;

  dateArray:any[]=[];
  highestQuantity={
    quantity: 0,
    rate: ""
  };

  averageDaily={
    quantity: "0",
    rate: ""
  }

  topDayRate={
    quantity: 0,
    rate: "",
    day: "",
    date: ""
  }

   //monthly data result
   mHighestQuantity={
    quantity: 0,
    rate: ""
  };

  mAverageDaily={
    quantity: "0",
    rate: ""
  }

  mTopDayRate={
    quantity: 0,
    rate: "",
    day: "",
    date: ""
  }

  //type of weekly charts
  pie:any=null;
  linee:any=null;
  bar:any=null;

  //type of monthly charts
  pie2:any=null;
  linee2:any=null;
  bar2:any=null;

  busDriver: BusDriver[] = [];  // BusDriver model
  queryData: Rate[]=[]; //weekly rating data
  queryResult: any[] = []; //ratings quantity

  mQueryData: Rate[]=[]; //monthly rating data
  mQueryResult: any[] = []; //monthly ratings quantity

  datas =
  {
    labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
    datasets: [{
      label: '# of Ratings',
      data: [0,0,0,0,0],
      backgroundColor: [
        'rgba(255, 26, 104, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(255, 26, 104, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 4
    }]
  }

  lineData =
  {
    labels: [],
    datasets: [{
      label: 'Morning',
      data: [],
      backgroundColor: [
        'rgba(255, 26, 104, 0.6)'
      ],
      borderColor: [
        'rgba(255, 26, 104, 1)'
      ],
      borderWidth: 2
    },
    {
      label: 'Night',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2
    }]
  }

  lineData2 =
  {
    labels: [],
    datasets: [{
      label: 'Morning',
      data: [],
      backgroundColor: [
        'rgba(255, 26, 104, 0.6)'
      ],
      borderColor: [
        'rgba(255, 26, 104, 1)'
      ],
      borderWidth: 2
    },
    {
      label: 'Night',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2
    }]
  }

  selectedValue: string ="";
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    driver: new FormControl()
  })

  monthRange = new FormGroup({
    selectedYear: new FormControl(),
    monthYear: new FormControl(),
    driver: new FormControl()
  })

  wkData:number[]=[];
  wkData2:number[]=[];
  monthData:number[]=[];
  monthData2:number[]=[];
  constructor(private dataApi: DataService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();
    this.yearList.push(currentYear);
    this.yearList.push(currentYear-1);
    this.yearList.push(currentYear-2);
   }

  ngOnInit(): void {
    this.RenderChart();
    this.getAllBusDrivers();
    this.j();
    this.k();
  }

  j(){
    for(var i =1; i<8; i++){
      this.wkData.push(this.getRandomInt(30, 45))
      this.wkData2.push(this.getRandomInt(30, 37))
    }
  }

  k(){
    for(var i =1; i<6; i++){
      this.monthData.push(this.getRandomInt(60, 83))
      this.monthData2.push(this.getRandomInt(60, 80))
    }
  }

  RenderChart(){
    console.log("Chart")
    let options={
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    //weekly chart
    this.linee = new Chart("linechartt", {
      type: 'line',
      data:this.lineData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        hover: {
          mode: 'index',
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Day'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Ratings'
            }
          }
        }
      }
    });


    //monthly chart
    this.linee2 = new Chart("linechartt2", {
      type: 'line',
      data:this.lineData2,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        hover: {
          mode: 'index',
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Number of Ratings'
            }
          }
        }
      }
    });

  }

  updateLineChart(morningData:any, nightData:any, dateArr:any, periodic: string){
    let weekLabel=[];

    //weekly line chart as default
    var selectedLine = this.linee;
    //replace to monthly line chart
    if(periodic=="month"){
      selectedLine=this.linee2;
      selectedLine.data.datasets[0].data=this.monthData
      selectedLine.data.datasets[1].data=this.monthData2;
      for(var i=0; i<5; i++){
        weekLabel.push("Week "+(i+1))
      }
      selectedLine.data.labels=weekLabel;
    }
    else{
      selectedLine.data.datasets[0].data=this.wkData;
      selectedLine.data.datasets[1].data=this.wkData2;
      selectedLine.data.labels=dateArr;
    }
    selectedLine.update()
    this.isProgressBarVisible=false;
  }

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
        this.isProgressBarVisible=true;

        if (this.fromDate && this.toDate != null){
          var collect : Rate[]=[];
          let dateArr:any[]=[];
          let checkData= await this.dataApi.getRate((this.simpleDate(this.fromDate)), this.driverId);
          let checkData2= await this.dataApi.getRate((this.simpleDate(this.toDate)), this.driverId);
          if(checkData.length==0||checkData2.length==0){
            this.isProgressBarVisible=false;
            window.alert("Please select other week as the chosen week's data is incomplete.")
          }
          else{
            while(this.fromDate <= this.toDate){
              let dataCollection = await this.dataApi.getRate((this.simpleDate(this.fromDate)), this.driverId)
              collect.push(dataCollection);
              dateArr.push(this.properDateformat(this.fromDate));
              this.fromDate.setDate(this.fromDate.getDate() + 1);
            }
            this.queryData=collect;
            this.countRate(this.queryData);
            this.countPerDay(this.queryData, dateArr);
          }
        }
      }
    }
  }

  async monthlyQuery(){
    if(this.monthYear==this.monthRange.value.monthYear
      &&this.mDriverId==this.monthRange.value.driver
      &&this.selectedYear==this.monthRange.value.selectedYear){
      window.alert("You have selected the same month and year, please enter a different month.");
    }
    else{
      this.monthYear= this.monthRange.value.monthYear;
      this.mDriverId=this.monthRange.value.driver;
      this.selectedYear=this.monthRange.value.selectedYear;
      if(this.monthYear==null
        ||this.monthYear==""
        ||this.mDriverId==null
        ||this.mDriverId==""
        ||this.selectedYear==0
        ||this.selectedYear==null){
        window.alert('Please fill in the form')
      }
      else if(this.monthRange.invalid){
        window.alert('Invalid Query, please try again')
      }
      else{
        this.isProgressBarVisible=true;
        let dates: any[] = [];
        var collect : Rate[]=[];
        let dateArr:any[]=[];
        const fromDate = new Date(this.selectedYear, this.monthNames.indexOf(this.monthYear),1);
        const toDate = new Date(this.selectedYear, this.monthNames.indexOf(this.monthYear)+1,0);

        let checkData= await this.dataApi.getRate((this.simpleDate(fromDate)), this.mDriverId)
        if(checkData.length==0){
          this.isProgressBarVisible=false;
          window.alert("Please select another month as the chosen month's data is incomplete.")
        }
        else{
          while(fromDate <= toDate){
            var num=0;
            let dataCollection = await this.dataApi.getRate((this.simpleDate(fromDate)), this.mDriverId)
            collect.push(dataCollection)
            ;
            dateArr.push(this.properDateformat(fromDate))
            dates = [...dates, new Date(fromDate)];
            fromDate.setDate(fromDate.getDate() + 1);
            num++;
          }
          this.mQueryData=collect;
          this.countRate(this.mQueryData);
          this.countPerWeek(this.mQueryData, dateArr);
        }
      }
    }
  }
  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  //count ratings quantity per week for each rate star
  countPerWeek(rateList:any, dateArr:any){


    this.updateLineChart(this.monthData, this.monthData2, dateArr, "month");
  }

  countPerDay(rateList:any, dateArr:any){

    this.isDailyWorkingHourFatch = true;
    this.updateLineChart(this.wkData, this.wkData2, dateArr, "week");
  }

  //convert data format into a simple string format
  simpleDate(date:any){
    return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  }

  //count the number of each rating
  countRate(rateList:any){
    let rate1Obj={
      rate:"1 Star",
      rateQuantity:0
    }
    let rate2Obj={
      rate:"2 Star",
      rateQuantity:0
    }
    let rate3Obj={
      rate:"3 Star",
      rateQuantity:0
    }
    let rate4Obj={
      rate:"4 Star",
      rateQuantity:0
    }
    let rate5Obj={
      rate:"5 Star",
      rateQuantity:0
    }
    for(var i=0; i<rateList.length; i++){
      rateList[i].forEach((obj:any) => {
        switch(obj.ratingLevel){
          case 1:
            rate1Obj.rateQuantity++;
            break;
          case 2:
            rate2Obj.rateQuantity++;
            break;
          case 3:
            rate3Obj.rateQuantity++;
            break;
          case 4:
            rate4Obj.rateQuantity++;
            break;
          case 5:
            rate5Obj.rateQuantity++;
            break
          default:
            break;
        }
      });
    }
    var isMonthly = true;
    if(rateList.length>7){
      this.highQuantity([rate1Obj, rate2Obj, rate3Obj, rate4Obj, rate5Obj], isMonthly, rateList.length);
      this.mQueryResult =[rate1Obj.rateQuantity,rate2Obj.rateQuantity,rate3Obj.rateQuantity,
        rate4Obj.rateQuantity,rate5Obj.rateQuantity];
      //this.updateChart(this.mQueryResult, isMonthly);
    }
    else{
      this.highQuantity([rate1Obj, rate2Obj, rate3Obj, rate4Obj, rate5Obj], !isMonthly, 7);
      this.queryResult =[rate1Obj.rateQuantity,rate2Obj.rateQuantity,rate3Obj.rateQuantity,
        rate4Obj.rateQuantity,rate5Obj.rateQuantity];
      //this.updateChart(this.queryResult, !isMonthly)
    }

  }

  //find the highest quantity of rating
  highQuantity(rateObjs:any[], isMonthly: boolean, days: number){
    let total=0;
    console.log(this.busDriver, this.wkData)
    if(isMonthly) {
      for(var d of this.busDriver){
        if(d.id == this.driverId){
          this.mHighestQuantity.rate=d.fullName
        }
      }
      console.log(this.monthData)
      for(var i=0; i< this.monthData.length; i++){
        total += this.monthData[i];
      }
      for(var i=0; i< this.monthData2.length; i++){
        total += this.monthData2[i];
      }
      this.mHighestQuantity.quantity=total;
      //find the day with top ratings

      //get average daily amount of the highest rating quantity
      this.mAverageDaily.rate=this.mHighestQuantity.rate;
      this.mAverageDaily.quantity=(this.mHighestQuantity.quantity/days).toPrecision(3);
    }
    else{
      for(var d of this.busDriver){
        if(d.id == this.driverId){
          this.highestQuantity.rate=d.fullName
        }
      }

      for(var i=0; i< this.wkData.length; i++){

        total += this.wkData[i];

      }
      for(var i=0; i< this.wkData2.length; i++){
        total += this.wkData[i];
      }
      this.highestQuantity.quantity=total;
      //find the day with top ratings
      //get average daily amount of the highest rating quantity
      this.averageDaily.rate=this.highestQuantity.rate;
      this.averageDaily.quantity=(this.highestQuantity.quantity/days).toPrecision(3);
    }
  }

  //find the day with the most amount of the highest ratings quantity
  dayTopRate(rate: any, rateList:any[]){
    let specificDayRate:any[]=[];
    for(var v=1; v<6; v++){
      let ratenum=v+" Star"
      if(rate.rate==ratenum){
        for(var i=0; i<rateList.length; i++){
          let dateRate={
            date: "",
            rate:"",
            quantity: 0
          };
          for(var obj of rateList[i]){
            if(obj.ratingLevel==v){
              dateRate.quantity++
            }
          }
          dateRate.date=rateList[i][0].ratingDate;
          dateRate.rate= ratenum;
          specificDayRate.push(dateRate)
        }
      }
    }
    //Find the day object whose property "rate" has the greatest value in the array specificDayRate
    const max = specificDayRate.reduce(function(prev, current) {
      return (prev.quantity > current.quantity) ? prev : current
    }) //returns object

    return max;
  }

  getHighestRateObj(maxRateObj: any){
    var days = [' (Sunday)', ' (Monday)', ' (Tuesday)', ' (Wednesday)', ' (Thursday)', ' (Friday)', ' (Saturday)'];
    const str = maxRateObj.date;
    const [day, month, year] = str.split('-');
    const date = new Date(+year, +month - 1, +day);
    var topDayRate ={
      day: days[date.getDay()],
      rate: "("+maxRateObj.rate+")",
      quantity: maxRateObj.quantity,
      date: this.properDateformat(date)
    }
    return topDayRate;
  }

  properDateformat(date:any){
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const m = monthNames[date.getMonth()]
    return date.getDate()+" "+m+" "+date.getFullYear();
  }

  //update month select dropdown list values
  updateMonthList(yearRadio: MatRadioChange){
    let monthArr=[];
    if(yearRadio.value == new Date().getFullYear()){
      var i=0;
      while(i!=new Date().getMonth()){
        monthArr.push(this.monthNames[i]);
        i++;
      }
    }
    else{
      monthArr=["January", "February", "March", "April", "March", "June",
      "July", "August", "September", "October", "November", "December"];
    }
    this.monthNames=monthArr;
    this.isMonthlyWorkingHourFetch = true;
  }

    async genrateReport(){

    if(!this.isDailyWorkingHourFatch && !this.isMonthlyWorkingHourFetch){
      window.alert("Pleace query the informaton");
      return;
    }

    var doc = new jsPDF();
    var canvas;
    const pageWidth = doc.internal.pageSize.getWidth();
    const padding = 10;

    if(this.isDailyWorkingHourFatch){

      //Title
      doc.setFontSize(26);
      doc.text('Weekly Working Hours Report', 10, 20);

      //Quantity
      doc.setFontSize(12);
      doc.text('Total Working Hours', 10, 30);
      doc.setFontSize(10);
      doc.text('Bus Driver : ' + this.highestQuantity.rate, 10, 35);
      doc.text('Quantity : ' + this.highestQuantity.quantity, 10, 40);

      doc.setFontSize(12);
      doc.text('Average Daily Working Hours', 70, 30);
      doc.setFontSize(10);
      doc.text('Bus Driver : ' + this.averageDaily.rate, 70, 35);
      doc.text('Averrage : ' + this.averageDaily.quantity, 70, 40);

      // doc.setFontSize(12);
      // doc.text('Daily with Most Passengers '+this.topDayPassenger.busStop, 140, 30);
      // doc.setFontSize(10);
      // doc.text('Date : ' + this.topDayPassenger.date + this.topDayPassenger.day, 140, 35);
      // doc.text('Quantity : ' + this.topDayPassenger.quantity, 140, 40);



      //chart
      canvas = await html2canvas(document.querySelector("#linechartt")!);

      var imgData  = canvas.toDataURL("image/jpeg");

      if (canvas.width > pageWidth) {
        const ratio = pageWidth / canvas.width;
        canvas.height = canvas.height * ratio - padding;
        canvas.width = canvas.width * ratio - padding;
      }

      doc.setFontSize(20);
      doc.text('Working Hours Per Day', 10, 60)
      doc.addImage(imgData,padding,65,canvas.width, canvas.height);

      //bar
    //   canvas = await html2canvas(document.querySelector("#nopbarchart")!);
    //   var imgData  = canvas.toDataURL("image/jpeg");
    //   if (canvas.width > pageWidth) {
    //     const ratio = pageWidth / canvas.width;
    //     canvas.height = canvas.height * ratio - padding;
    //     canvas.width = canvas.width * ratio - padding;
    //   }

    //   doc.setFontSize(20);
    //   doc.text('Total No. Of Passengers From Each Bus Stop', 10, 170)
    //   doc.addImage(imgData,padding,175,canvas.width, canvas.height);
    // }

    if(this.isMonthlyWorkingHourFetch){
      //monthly
      if(this.isDailyWorkingHourFatch){
        doc.addPage();
      }

      //Title
      doc.setFontSize(26);
      doc.text('Monthly Working Hours Report', 10, 20);

      //Quantity
      doc.setFontSize(12);
      doc.text('Total Working Hours', 10, 30);
      doc.setFontSize(10);
      doc.text('Bus Driver : ' + this.mHighestQuantity.rate, 10, 35);
      doc.text('Quantity : ' + this.mHighestQuantity.quantity, 10, 40);

      doc.setFontSize(12);
      doc.text('Average Daily Working Hours', 70, 30);
      doc.setFontSize(10);
      doc.text('Bus Driver : ' + this.mAverageDaily.rate, 70, 35);
      doc.text('Averrage : ' + this.mAverageDaily.quantity, 70, 40);

      // doc.setFontSize(12);
      // doc.text('Day with Most Passengers '+this.mTopDayRate.busStop, 140, 30);
      // doc.setFontSize(10);
      // doc.text('Date : ' + this.mTopDayRate.date + this.mTopDayRate.day, 140, 35);
      // doc.text('Quantity : ' + this.mTopDayRate.quantity, 140, 40);

      //chart
      canvas = await html2canvas(document.querySelector("#linechartt2")!);
      var imgData  = canvas.toDataURL("image/jpeg");
      if (canvas.width > pageWidth) {
          const ratio = pageWidth / canvas.width;
          canvas.height = canvas.height * ratio - padding;
          canvas.width = canvas.width * ratio - padding;
      }

      doc.setFontSize(20);
      doc.text('Working Hours Per Week', 10, 60)
      doc.addImage(imgData,padding,65,canvas.width, canvas.height);

      //bar
      // canvas = await html2canvas(document.querySelector("#nopbarchart2")!);
      // var imgData  = canvas.toDataURL("image/jpeg");
      // if (canvas.width > pageWidth) {
      //   const ratio = pageWidth / canvas.width;
      //   canvas.height = canvas.height * ratio - padding;
      //   canvas.width = canvas.width * ratio - padding;
      // }

      // doc.setFontSize(20);
      // doc.text('Total No. Of Passengers From Each Bus Stop', 10, 170)
      // doc.addImage(imgData,padding,175,canvas.width, canvas.height);

    }

    doc.save('working_hour_report.pdf');
  }
}

    //hardcoded the rating list on bus driver
  // lol(){
  //   var date = new Date()
  //   // var yesterday = new Date(date.getTime());
  //   //   yesterday.setDate(date.getDate() - 1);
  //   // console.log(yesterday.getDate()+"/"+yesterday.getDay()+"/"+yesterday.getFullYear())
  //   for(var l=1; l<60; l++){
  //     var yesterday = new Date(date.getTime());
  //     yesterday.setDate(date.getDate() + l );
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
}
