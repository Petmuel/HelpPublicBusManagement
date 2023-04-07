
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
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

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
  isProgressBarVisible=false;
  minDate: Date;
  maxDate: Date;
  fromDate:any;
  toDate:any;
  driverId= "";
  isDailyWorkingHourFatch = false;
  isMonthlyWorkingHourFetch = false;

  //monthly selection data
  yearList: number[]=[];
  monthNames = ["January", "February", "March", "April", "March", "June",
    "July", "August", "September", "October", "November", "December"];

  //monthly query data
  monthYear="";
  mdriverId= "";
  selectedYear=0;

  dateArray:any[]=[];
  totalDuration={
    duration: 0,
    busDriver: "",
    busDriverID:""
  };

  averageDaily={
    duration: 0,
    busDriver: ""
  }

   //monthly data result
   mTotalDuration={
    duration: 0,
    busDriver: "",
    busDriverID:""
  };

  mAverageDaily={
    duration: "0",
    busDriver: "",
  }

  //type of weekly charts
  wkHrline:any=null;

  //type of monthly charts
  wkHrline2:any=null;

  busDriver: BusDriver[] = [];  // BusDriver model
  queryData: any[]=[]; //weekly rating data
  queryResult: any[] = []; //ratings quantity

  mQueryData: any[]=[]; //monthly rating data
  mQueryResult: any[] = []; //monthly ratings quantity
  // datas =
  // {
  //   labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
  //   datasets: [{
  //     label: '# of Ratings',
  //     data: [0,0,0,0,0],
  //     backgroundColor: [
  //       'rgba(255, 26, 104, 0.6)',
  //       'rgba(54, 162, 235, 0.6)',
  //       'rgba(255, 206, 86, 0.6)',
  //       'rgba(75, 192, 192, 0.6)',
  //       'rgba(153, 102, 255, 0.6)'
  //     ],
  //     borderColor: [
  //       'rgba(255, 26, 104, 1)',
  //       'rgba(54, 162, 235, 1)',
  //       'rgba(255, 206, 86, 1)',
  //       'rgba(75, 192, 192, 1)',
  //       'rgba(153, 102, 255, 1)'
  //     ],
  //     borderWidth: 2,
  //     hoverOffset: 4
  //   }]
  // }

  line3Data=
  {
    labels: [],
    datasets: [{
      label: 'Working Hours',
      data: [],
      backgroundColor: [
        'rgba(255, 26, 104, 0.6)'
      ],
      borderColor: [
        'rgba(255, 26, 104, 1)'
      ],
      borderWidth: 2
    }]
  };

  lineData1=
  {
    labels: [],
    datasets: [{
      label: 'Working Hours',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2
    }]
  };

  selectedValue: string ="";
  weekHr = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    driver: new FormControl()
  })

  monthHr = new FormGroup({
    selectedYear: new FormControl(),
    monthYear: new FormControl(),
    driver: new FormControl()
  })

  constructor(private nopService: noOfPassengersService, private dataApi: DataService,
    private wkHrService:workingHoursService) {
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
    this.wkHrline = new Chart("wkHrlinechart", {
      type: 'line',
      data:this.line3Data,
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
              text: 'Working Hours'
            }
          }
        }
      }
    });

    //monthly chart
    this.wkHrline2 = new Chart("wkHrlinechart2", {
      type: 'line',
      data:this.lineData1,
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
              text: 'Working Hours'
            }
          }
        }
      }
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  updateLineChart(allHours:any, dateArr:any, periodic: string){
    let weekLabel=[];
    //weekly line chart as default
    var selectedLine = this.wkHrline;
    //replace to monthly line chart
    if(periodic=="month"){
      selectedLine=this.wkHrline2;
      selectedLine.data.datasets[0].data =allHours;

      for(var i=0; i<allHours.length; i++){
        weekLabel.push("Week "+(i+1))
      }
      selectedLine.data.datasets[0].data = allHours;
      selectedLine.data.labels=weekLabel;
    }
    else{
      let durationArr:any[]=[];
      allHours.forEach((x:any)=>{
        durationArr.push(x.hours)
      })
      selectedLine.data.datasets[0].data=durationArr;
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
    if(this.fromDate==this.weekHr.value.start
      &&this.toDate== this.weekHr.value.end
      &&this.driverId==this.weekHr.value.driver){
      window.alert("You have selected the same week, please select a different week.");
    }
    else{
      this.fromDate= this.weekHr.value.start;
      this.toDate= this.weekHr.value.end;
      this.driverId = this.weekHr.value.driver;
      if(this.weekHr.value.driver==null
        ||this.weekHr.value.driver==""
        ||this.weekHr.value.start==null
        ||this.weekHr.value.end==null){
        window.alert('Please fill in the form')
      }
      else if(this.weekHr.invalid){
        window.alert('Invalid Query, please try again')
      }
      else{
        this.isProgressBarVisible=true;

        if (this.fromDate && this.toDate != null){
          var collect : any[]=[];
          let dateArr:any[]=[];
          let simpleDateArr:any[]=[];
          let checkData= await this.wkHrService.getDriveRecord((this.simpleDate(this.fromDate)), this.driverId);
          let checkData2= await this.wkHrService.getDriveRecord((this.simpleDate(this.toDate)), this.driverId);
          if(checkData.length==0||checkData2.length==0){
            this.isProgressBarVisible=false;
            window.alert("Please select other week as the chosen week's data is incomplete.")
          }
          else{
            while(this.fromDate <= this.toDate){
              let previous = new Date(this.fromDate.getTime());
              let after = new Date(this.fromDate.getTime());
              previous.setDate(previous.getDate() - 1)
              after.setDate(after.getDate() + 1)
              let duration=0;
              let dataCollection:any={
                driveRecordId:"",
                busRouteId: "",
                date: "",
                duration: 0
              }
              let driveRecord = await this.wkHrService.getDriveRecord((this.simpleDate(this.fromDate)), this.driverId);
              let driveRecordId = await this.wkHrService.getDriveRecordID((this.simpleDate(this.fromDate)), this.driverId);
              let workHour:any = await this.wkHrService.getWorkingHours(driveRecordId);
              (this.simpleDate(this.fromDate))

              workHour.forEach((obj: any) => {
                if(obj.endTime.toDate().getTime() <after.getTime()&&obj.startTime.toDate().getTime() >previous.getTime()){
                  duration+=obj.driveDuration
                }
              })

              var date = driveRecord[0].recordDate;
              //if date is not string
              if(typeof date !== 'string'){
                date = this.simpleDate(date.toDate());
              }

              dataCollection.driveRecordId= driveRecordId
              dataCollection.busRouteId= driveRecord[0].busRouteId
              dataCollection.date = date
              dataCollection.duration= duration

              collect.push(dataCollection);
              dateArr.push(this.properDateformat(this.fromDate));
              this.fromDate.setDate(this.fromDate.getDate() + 1);
            }
            this.queryData=collect;
            // let uniqueArr = this.getUniqueNopArr(this.queryData)
            this.countHour(collect);
            this.countPerDay(collect, dateArr);
          }
        }
      }
    }
  }

  async monthlyQuery(){
    if(this.selectedYear==this.monthHr.value.selectedYear
      &&this.monthYear== this.monthHr.value.monthYear
      &&this.mdriverId==this.monthHr.value.driver){
      window.alert("You have selected the same week, please select a different week.");
    }
    else{
      this.selectedYear= this.monthHr.value.selectedYear;
      this.monthYear= this.monthHr.value.monthYear;
      this.mdriverId = this.monthHr.value.driver;
      console.log(this.monthHr.value)
      if(this.monthHr.value.driver==null
        ||this.monthHr.value.driver==""
        ||this.monthHr.value.selectedYear==null
        ||this.monthHr.value.monthYear==null){
        window.alert('Please fill in the form')
      }
      else if(this.monthHr.invalid){
        window.alert('Invalid Query, please try again')
      }
      else{
        this.isProgressBarVisible=true;

        if (this.selectedYear && this.monthYear != null){
          let dates: any[] = [];
          var collect : any[]=[];
          let dateArr:any[]=[];
          let simpleDateArr:any[]=[];
          const fromDate = new Date(this.selectedYear, this.monthNames.indexOf(this.monthYear),1);
          const toDate = new Date(this.selectedYear, this.monthNames.indexOf(this.monthYear)+1,0);
          console.log(await this.wkHrService.getDriveRecord((this.simpleDate(fromDate)), this.driverId), this.simpleDate(toDate));
          let checkData= await this.wkHrService.getDriveRecord((this.simpleDate(this.fromDate)), this.driverId);
          let checkData2= await this.wkHrService.getDriveRecord((this.simpleDate(this.toDate)), this.driverId);
          if(checkData.length==0||checkData2.length==0){
            this.isProgressBarVisible=false;
            window.alert("Please select other month as the chosen month's data is incomplete.")
          }
          else{
            while(fromDate <= toDate){
              let previous = new Date(fromDate.getTime());
              let after = new Date(fromDate.getTime());
              previous.setDate(previous.getDate() - 1)
              after.setDate(after.getDate() + 1)
              let duration=0;
              let dataCollection:any={
                driveRecordId:"",
                busRouteId: "",
                date: "",
                duration: 0
              }
              let driveRecord = await this.wkHrService.getDriveRecord((this.simpleDate(fromDate)), this.driverId);
              let driveRecordId = await this.wkHrService.getDriveRecordID((this.simpleDate(fromDate)), this.driverId);
              let workHour:any = await this.wkHrService.getWorkingHours(driveRecordId);


              workHour.forEach((obj: any) => {
                if(obj.endTime.toDate().getTime() <after.getTime()&&obj.startTime.toDate().getTime() >previous.getTime()){
                  duration+=obj.driveDuration
                }
              })

              var date = driveRecord[0].recordDate;
              //if date is not string
              if(typeof date !== 'string'){
                date = this.simpleDate(date.toDate());
              }

              dataCollection.driveRecordId= driveRecordId
              dataCollection.busRouteId= driveRecord[0].busRouteId
              dataCollection.date = date
              dataCollection.duration= duration

              collect.push(dataCollection);
              dateArr.push(this.properDateformat(fromDate));
              simpleDateArr.push(this.simpleDate(fromDate));
              fromDate.setDate(fromDate.getDate() + 1);
            }
            this.mQueryData=collect;
            // let uniqueArr = this.getUniqueNopArr(this.queryData)
            this.countHour(collect);
            this.countPerWeek(collect, dateArr, simpleDateArr);
          }
        }
      }
    }
  }

  //count the number of each rating
  countHour(hourList:any){
    let durationArr:any[] =[];
    hourList.forEach((x:any)=>{
      durationArr.push(x.duration)
    })
    var isMonthly = true;
    if(hourList.length>7){
      this.highQuantity(hourList, isMonthly, hourList.length);
      this.mQueryResult =durationArr;
    }
    else{
      this.highQuantity(hourList, !isMonthly, 7);
      this.queryResult =durationArr;
    }

  }

  //count passenger quantity per week for each rate star
  countPerWeek(workHourList:any, dateArr:any, simpleDate:any){
    let week=7;
    let monthEachWorkHour:any[]=[];
    let nopListPerDay:any[]=[];
    let weeklyWorkHours:any[]=[];
    let countingHours:any[]=[];
    let durations:any[]=[];
    let count:number=0;
      for(var day=0; day<simpleDate.length; day++){

        //if day has already reached to the end of week
        if(day==week){
          weeklyWorkHours.push(count); //week1=[day1,day2,dy3,dy4,dy5,dy6,dy7], week2=[],
          count=0;
          week+=7
        }


        workHourList.forEach((x:any)=>{
          if(x.date == simpleDate[day]){
            count+=Number((x.duration/3600).toFixed(1))
          }
        })

        if(simpleDate.length-day==1){
          weeklyWorkHours.push(count);
          count=0;
          week=7;
        }
    }
    this.isMonthlyWorkingHourFetch = true;
    this.updateLineChart(weeklyWorkHours, dateArr, "month");
  }

  async countPerDay(nopList:any, dateArr:any){
      let workHours:any[]=[];
      for(var i=0; i<nopList.length; i++){
        let dateWorkHr={
          date: "",
          hours: 0
        };
        dateWorkHr.hours=Number((nopList[i].duration/3600).toFixed(1));
        dateWorkHr.date=nopList[i].date;
        workHours.push(dateWorkHr)
      }
    this.isDailyWorkingHourFatch = true;
    console.log(workHours)
    this.updateLineChart(workHours, dateArr, "week");
  }

  //convert data format into a simple string format
  simpleDate(date:any){
    return (date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear())
  }

  getUniqueNopArr(nopList:any){
    let findDuplicates = (arr: any[]) => arr.filter((item, index) => arr.indexOf(item.busStopID) !== index)
    let unique = [...new Set(findDuplicates(nopList[0]))] // Unique duplicates
    return unique;
  }

  //find the highest quantity of nop
  async highQuantity(workHrObjs:any[], isMonthly: boolean, days: number){
    const maxRate = workHrObjs.reduce(function(prev, current) {
      return (prev.duration > current.duration) ? prev : current
    });
    let busDriver:any = this.busDriver.find(x=>{
      return x.id===this.weekHr.value.driver;
    })
    let count =0;
    workHrObjs.forEach((x:any)=>{
      count+=x.duration;
    })
    if(isMonthly) {
      this.mTotalDuration.duration=Number((count/3600).toFixed(1));
      this.mTotalDuration.busDriver=busDriver.fullName;
      //get average daily amount of the highest rating quantity
      this.mAverageDaily.busDriver=maxRate.name;
      this.mAverageDaily.duration=Number((this.mTotalDuration.duration/days)).toFixed(1);
    }
    else{
      console.log(maxRate.duration)
      this.totalDuration.duration=Number((count/3600).toFixed(1));
      this.totalDuration.busDriver=busDriver.fullName
      //get average daily amount of the highest rating quantity
      this.averageDaily.busDriver=this.totalDuration.busDriver;
      this.averageDaily.duration=Number((this.totalDuration.duration/days).toFixed(1));
    }
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
  }

  //   //hardcoded the rating list on bus driver
  // async lol(){
  //   // this.nopService.hi();
  //   var date = new Date()
  //   // var stops= await this.dataApi.getBusStopsByRoute("BusRoute1680460045688")
  //   // // var yesterday = new Date(date.getTime());
  //   // //   yesterday.setDate(date.getDate() - 1);
  //   // // console.log(yesterday.getDate()+"/"+yesterday.getDay()+"/"+yesterday.getFullYear())
  //   // for(var stop of stops) {

  //     // for(var l=0; l<2; l++){
  //     //   var yesterday = new Date(date.getTime());
  //     //   yesterday.setDate(date.getDate() - l );
  //     //   var currDay = yesterday.getDate()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getFullYear();
  //     //   var currDat2 = yesterday.getTime();
  //     //   var ran = Math.floor(Math.random() * 1000);

  //     //     var date = new Date();
  //     //     var num = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  //     //     var noOfP2 = {
  //     //       busDriverId:"hfRK37clJ8MEc0sPgyW01YyptVg2",
  //     //       busRouteId:"NMQlnUla3nfKcRiyZZyi",
  //     //       recordDate: yesterday
  //     //     };
  //     //     this.wkHrService.hi(currDay, noOfP2, ran);

  //     //   }

  //       // for(var l=1; l<36; l++){
  //       //   var yesterday = new Date(date.getTime());
  //       //   yesterday.setDate(date.getDate() + l );
  //       //   var currDay = yesterday.getDate()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getFullYear();
  //       //   var currDat2 = yesterday.getTime();
  //       //   var ran = Math.floor(Math.random() * 1000);

  //       //     var date = new Date();
  //       //     var num = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  //       //     var noOfP2 = {
  //       //       busDriverId:"hfRK37clJ8MEc0sPgyW01YyptVg2",
  //       //       busRouteId:"NMQlnUla3nfKcRiyZZyi",
  //       //       recordDate: yesterday
  //       //     };
  //       //     this.wkHrService.hi(currDay, noOfP2, this.simpleDate(yesterday));

  //       //   }

  //     for(var l=30; l<50; l++){
  //       var yesterday = new Date(date.getTime());
  //       yesterday.setDate(date.getDate() - l );
  //       var currDay = yesterday.getDate()+"-"+(yesterday.getMonth()+1)+"-"+yesterday.getFullYear();
  //       var currDat2 = yesterday.getTime();
  //       var ran = Math.floor(Math.random() * 1000);

  //         var date = new Date();
  //         var num = Math.floor(Math.random() * (5 - 1 + 1) + 1);
  //         var noOfP2 = {
  //           busDriverId:"hfRK37clJ8MEc0sPgyW01YyptVg2",
  //           busRouteId: "NMQlnUla3nfKcRiyZZyi",
  //           recordDate: yesterday
  //         };
  //         this.wkHrService.hi(currDay, noOfP2, ran);

  //     }
  //   }

    async generateReport(){

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
      doc.text('Bus Driver : ' + this.totalDuration.busDriver, 10, 35);
      doc.text('Duration : ' + this.totalDuration.duration, 10, 40);

      doc.setFontSize(12);
      doc.text('Average Daily Working Hours', 70, 30);
      doc.setFontSize(10);
      doc.text('Bus Driver : ' + this.averageDaily.busDriver, 70, 35);
      doc.text('Average : ' + this.averageDaily.duration, 70, 40);

      // doc.setFontSize(12);
      // doc.text('Daily with Most Passengers '+this.topDayPassenger.busStop, 140, 30);
      // doc.setFontSize(10);
      // doc.text('Date : ' + this.topDayPassenger.date + this.topDayPassenger.day, 140, 35);
      // doc.text('Quantity : ' + this.topDayPassenger.quantity, 140, 40);



      //chart
      canvas = await html2canvas(document.querySelector("#wkHrlinechart")!);

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
      doc.text('Bus Driver : ' + this.mTotalDuration.busDriver, 10, 35);
      doc.text('Quantity : ' + this.mTotalDuration.duration, 10, 40);

      doc.setFontSize(12);
      doc.text('Average Daily Working Hours', 70, 30);
      doc.setFontSize(10);
      doc.text('Bus Driver : ' + this.mAverageDaily.busDriver, 70, 35);
      doc.text('Averrage : ' + this.mAverageDaily.duration, 70, 40);

      // doc.setFontSize(12);
      // doc.text('Day with Most Passengers '+this.mTopDayRate.busStop, 140, 30);
      // doc.setFontSize(10);
      // doc.text('Date : ' + this.mTopDayRate.date + this.mTopDayRate.day, 140, 35);
      // doc.text('Quantity : ' + this.mTopDayRate.quantity, 140, 40);

      //chart
      canvas = await html2canvas(document.querySelector("#wkHrlinechart2")!);
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
