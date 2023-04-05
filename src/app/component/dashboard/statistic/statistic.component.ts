
import {Chart, registerables} from 'node_modules/chart.js'
import {Component, OnInit, Injectable} from '@angular/core';
import { DataService } from 'src/app/shared/service/data.service';
import { BusDriver } from 'src/app/shared/model/bus-driver';
import { SevenDayRange } from './datepicker/sevenDayRange.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { Rate } from 'src/app/shared/model/rate';
import { MatRadioChange } from '@angular/material/radio';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  isProgressBarVisible=false;
  minDate: Date;
  maxDate: Date;
  fromDate : any = 1;
  toDate : any = 1;
  driverId= "";

  isDailyRatingsFatch = false;
  isMonthlyRatingsFetch = false;

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
  line:any=null;
  bar:any=null;

  //type of monthly charts
  pie2:any=null;
  line2:any=null;
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
      label: '1 Star',
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
      label: '2 Star',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '3 Star',
      data: [],
      backgroundColor: [
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '4 Star',
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)'
      ],
      borderColor: [,
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '5 Star',
      data: [],
      backgroundColor: [
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(153, 102, 255, 1)'
      ],
      borderWidth: 2
    }]
  }

  lineData2 =
  {
    labels: [],
    datasets: [{
      label: '1 Star',
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
      label: '2 Star',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '3 Star',
      data: [],
      backgroundColor: [
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '4 Star',
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)'
      ],
      borderColor: [,
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '5 Star',
      data: [],
      backgroundColor: [
        'rgba(153, 102, 255, 0.6)'
      ],
      borderColor: [
        'rgba(153, 102, 255, 1)'
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
    this.line = new Chart("linechart", {
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

    this.bar = new Chart("barchart", {
      type: 'bar',
      data: this.datas,
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Types of Rating'
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
    this.line2 = new Chart("linechart2", {
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

    this.bar2 = new Chart("barchart2", {
      type: 'bar',
      data: this.datas,
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Types of Rating'
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

  updateChart(chartData:any, isMonthly: boolean){
    if(isMonthly){
      this.bar2.data.datasets[0].data=chartData;
      this.bar2.update();
    }
    else{
      this.bar.data.datasets[0].data=chartData;
      this.bar.update();
    }
    this.isProgressBarVisible=false;
  }

  updateLineChart(allRatings:any, dateArr:any, periodic: string){
    let weekLabel=[];

    //weekly line chart as default
    var selectedLine = this.line;
    //replace to monthly line chart
    if(periodic=="month"){
      selectedLine=this.line2;

      for(var i=0;i<allRatings.length;i++) {
        let allWeeksRating=[];
        for(var v=1; v<6; v++) {
          for(var weekArr of allRatings[i]){
            let count=0;
            switch(weekArr[0].level){
              case (v+" Star"):
                weekArr.forEach((day: { quantity: number; }) => {
                  count+=day.quantity;
                });
                allWeeksRating.push(count);
                break;
              default:
                break;
            }
          }

        }
        selectedLine.data.datasets[i].data=allWeeksRating;
      }
      for(var i=0; i<allRatings[0].length; i++){
        weekLabel.push("Week "+(i+1))
      }
      selectedLine.data.labels=weekLabel;
    }
    else{
      for(var i=0;i<allRatings.length;i++) {
        let starArr=[];
        for(var obj of allRatings[i]){
          starArr.push(obj.quantity)
        }
        //to update and overwrite each data
        selectedLine.data.datasets[i].data=starArr;
      }
      selectedLine.data.labels=dateArr;
    }
    selectedLine.update()
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

  //count ratings quantity per week for each rate star
  countPerWeek(rateList:any, dateArr:any){
    console.log(rateList)
    let week=7;
    let monthEachStarRate:any[]=[];
    for(var v=1; v<6; v++){
      let weeklyRatings:any[]=[];
      let countingRates:any[]=[];
      for(var day=0; day<rateList.length; day++){
        let ratingPerDay={
          quantity:0,
          level:"",
          date:""
        }
        //if day has already reached to the end of week
        if(day==week){
          weeklyRatings.push(countingRates);
          countingRates=[];  //week1=[day1,day2,dy3,dy4,dy5,dy6,dy7], week2=[],
          week+=7
        }

        //each rate object from the same day
        for(var obj of rateList[day]){
          //if the rate is same as the selected rate level
          if(obj.ratingLevel==v){
            ratingPerDay.quantity++
          }
        }
        ratingPerDay.date=rateList[day][0].ratingDate;
        ratingPerDay.level= v+" Star";
        //push the total same rate quantity from the same day into the week arr
        countingRates.push(ratingPerDay); //week1:day1.quantity, day2.quantity

        if(rateList.length-day==1){
          weeklyRatings.push(countingRates);
          countingRates=[];
          week=7;
        }
      }
      this.isMonthlyRatingsFetch = true;
      monthEachStarRate.push(weeklyRatings); //1 Star=[wk1[],wk2[],wk3[],wk4[],wk5[]]
    }
    this.updateLineChart(monthEachStarRate, dateArr, "month");
  }

  countPerDay(rateList:any, dateArr:any){
    let rateListPerDay:any[]=[];
    for(var v=1; v<6; v++){
      let ratings:any[]=[];
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
        dateRate.rate= v+" Star";
        ratings.push(dateRate)
      }
      rateListPerDay.push(ratings)
    }
    this.isDailyRatingsFatch = true;
    this.updateLineChart(rateListPerDay, dateArr, "week");
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
      this.updateChart(this.mQueryResult, isMonthly);
    }
    else{
      this.highQuantity([rate1Obj, rate2Obj, rate3Obj, rate4Obj, rate5Obj], !isMonthly, 7);
      this.queryResult =[rate1Obj.rateQuantity,rate2Obj.rateQuantity,rate3Obj.rateQuantity,
        rate4Obj.rateQuantity,rate5Obj.rateQuantity];
      this.updateChart(this.queryResult, !isMonthly)
    }

  }

  //find the highest quantity of rating
  highQuantity(rateObjs:any[], isMonthly: boolean, days: number){
    const maxRate = rateObjs.reduce(function(prev, current) {
      return (prev.rateQuantity > current.rateQuantity) ? prev : current
    });

    if(isMonthly) {
      this.mHighestQuantity.quantity=maxRate.rateQuantity;
      this.mHighestQuantity.rate=maxRate.rate;
      //find the day with top ratings
      var max = this.dayTopRate(this.mHighestQuantity, this.mQueryData);
      this.mTopDayRate= this.getHighestRateObj(max);
      //get average daily amount of the highest rating quantity
      this.mAverageDaily.rate=this.mHighestQuantity.rate;
      this.mAverageDaily.quantity=(this.mHighestQuantity.quantity/days).toPrecision(3);
    }
    else{
      this.highestQuantity.quantity=maxRate.rateQuantity;
      this.highestQuantity.rate=maxRate.rate;
      //find the day with top ratings
      var max=this.dayTopRate(this.highestQuantity, this.queryData);
      this.topDayRate= this.getHighestRateObj(max);
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
  }

  async genrateReport(){

    if(!this.isDailyRatingsFatch && !this.isMonthlyRatingsFetch){
      window.alert("Pleace query the informaton");
      return;
    }

    var doc = new jsPDF();
    var canvas;
    const pageWidth = doc.internal.pageSize.getWidth();
    const padding = 10;

    if(this.isDailyRatingsFatch){

      //Title
      doc.setFontSize(26);
      doc.text('Weekly Bus Driver Rating Report', 10, 20);

      //Quantity
      doc.setFontSize(12);
      doc.text('Highest Rating Quantity', 10, 30);
      doc.setFontSize(10);
      doc.text('Highest Rating : ' + this.highestQuantity.rate, 10, 35);
      doc.text('Quantity : ' + this.highestQuantity.quantity, 10, 40);

      doc.setFontSize(12);
      doc.text('Averrage Daily Highest Ratings', 70, 30);
      doc.setFontSize(10);
      doc.text('Highest Rating : ' + this.averageDaily.rate, 70, 35);
      doc.text('Averrage : ' + this.averageDaily.quantity, 70, 40);

      doc.setFontSize(12);
      doc.text('Daily with Most Ratings '+this.topDayRate.rate, 140, 30);
      doc.setFontSize(10);
      doc.text('Date : ' + this.topDayRate.date + this.topDayRate.day, 140, 35);
      doc.text('Quantity : ' + this.topDayRate.quantity, 140, 40);



      //chart
      canvas = await html2canvas(document.querySelector("#linechart")!);

      var imgData  = canvas.toDataURL("image/jpeg");

      if (canvas.width > pageWidth) {
        const ratio = pageWidth / canvas.width;
        canvas.height = canvas.height * ratio - padding;
        canvas.width = canvas.width * ratio - padding;
      }

      doc.setFontSize(20);
      doc.text('Number of Ratings Per Day', 10, 60)
      doc.addImage(imgData,padding,65,canvas.width, canvas.height);

      //bar
      canvas = await html2canvas(document.querySelector("#barchart")!);
      var imgData  = canvas.toDataURL("image/jpeg");
      if (canvas.width > pageWidth) {
        const ratio = pageWidth / canvas.width;
        canvas.height = canvas.height * ratio - padding;
        canvas.width = canvas.width * ratio - padding;
      }

      doc.setFontSize(20);
      doc.text('Number of Each Ratings', 10, 170)
      doc.addImage(imgData,padding,175,canvas.width, canvas.height);
    }

    if(this.isMonthlyRatingsFetch){
      //monthly
      if(this.isDailyRatingsFatch){
        doc.addPage();
      }

      //Title
      doc.setFontSize(26);
      doc.text('Monthly Bus Driver Rating Report', 10, 20);

      //Quantity
      doc.setFontSize(12);
      doc.text('Highest Rating Quantity', 10, 30);
      doc.setFontSize(10);
      doc.text('Highest Rating : ' + this.mHighestQuantity.rate, 10, 35);
      doc.text('Quantity : ' + this.mHighestQuantity.quantity, 10, 40);

      doc.setFontSize(12);
      doc.text('Averrage Daily Highest Ratings', 70, 30);
      doc.setFontSize(10);
      doc.text('Highest Rating : ' + this.mAverageDaily.rate, 70, 35);
      doc.text('Averrage : ' + this.mAverageDaily.quantity, 70, 40);

      doc.setFontSize(12);
      doc.text('Daily with Most Ratings '+this.mTopDayRate.rate, 140, 30);
      doc.setFontSize(10);
      doc.text('Date : ' + this.mTopDayRate.date + this.mTopDayRate.day, 140, 35);
      doc.text('Quantity : ' + this.mTopDayRate.quantity, 140, 40);

      //chart
      canvas = await html2canvas(document.querySelector("#linechart2")!);
      var imgData  = canvas.toDataURL("image/jpeg");
      if (canvas.width > pageWidth) {
          const ratio = pageWidth / canvas.width;
          canvas.height = canvas.height * ratio - padding;
          canvas.width = canvas.width * ratio - padding;
      }

      doc.setFontSize(20);
      doc.text('Number of Ratings Per Week', 10, 60)
      doc.addImage(imgData,padding,65,canvas.width, canvas.height);

      //bar
      canvas = await html2canvas(document.querySelector("#barchart2")!);
      var imgData  = canvas.toDataURL("image/jpeg");
      if (canvas.width > pageWidth) {
        const ratio = pageWidth / canvas.width;
        canvas.height = canvas.height * ratio - padding;
        canvas.width = canvas.width * ratio - padding;
      }

      doc.setFontSize(20);
      doc.text('Number of Each Ratings', 10, 170)
      doc.addImage(imgData,padding,175,canvas.width, canvas.height);

    }

    doc.save('bus_driver_rating_report.pdf');
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
