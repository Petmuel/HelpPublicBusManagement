
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

  //monthly query data
  monthYear="";
  mDriverId= "";

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
      label: '# of 1 Stars',
      data: [],
      backgroundColor: [
        'rgba(255, 26, 104)'
      ],
      borderColor: [
        'rgba(255, 26, 104, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '# of 2 Stars',
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '# of 3 Stars',
      data: [],
      backgroundColor: [
        'rgba(255, 206, 86)'
      ],
      borderColor: [
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '# of 4 Stars',
      data: [],
      backgroundColor: [
        'rgba(75, 192, 192)'
      ],
      borderColor: [,
        'rgba(75, 192, 192, 1)'
      ],
      borderWidth: 2
    },
    {
      label: '# of 5 Stars',
      data: [],
      backgroundColor: [
        'rgba(153, 102, 255)'
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
    monthYear: new FormControl(),
    driver: new FormControl()
  })

  constructor(private dataApi: DataService) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date();
   }

  ngOnInit(): void {
    this.RenderChart()
    this.getAllBusDrivers()
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

    this.pie = new Chart("piechart", {
      type: 'pie',
      data: this.datas,
      options: options
    });

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

    //month charts
    this.pie2 = new Chart("piechart2", {
      type: 'pie',
      data: this.datas,
      options: options
    });

    this.line2 = new Chart("linechart2", {
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

  updateChart(chartData:any){
    this.pie.data.datasets[0].data=chartData;
    this.bar.data.datasets[0].data=chartData;
    this.pie.update();
    this.bar.update();
  }
  updateChart2(chartData:any){
    this.pie2.data.datasets[0].data=chartData;
    this.bar2.data.datasets[0].data=chartData;
    this.pie2.update();
    this.bar2.update();
  }
  updateLineChart(allRatings:any, dateArr:any){
    for(var i=0;i<allRatings.length;i++) {
      let starArr:any[]=[];
      for(var obj of allRatings[i]){
        starArr.push(obj.quantity)
      }
      this.line.data.datasets[i].data=starArr;
    }

    console.log(dateArr)
    console.log(allRatings)
    this.line.data.labels=dateArr;
    this.line.update()
  }

  updateLineChart2(allRatings:any, dateArr:any){
    for(var i=0;i<allRatings.length;i++) {
      let starArr:any[]=[];
      for(var obj of allRatings[i]){
        starArr.push(obj.quantity)
      }
      this.line2.data.datasets[i].data=starArr;
    }
    console.log(dateArr)
    console.log(allRatings)
    this.line2.data.labels=dateArr;
    this.line2.update()
  }
  //hardcoded the rating list on bus driver
  // lol(){
  //   var date = new Date()
  //   // var yesterday = new Date(date.getTime());
  //   //   yesterday.setDate(date.getDate() - 1);
  //   // console.log(yesterday.getDate()+"/"+yesterday.getDay()+"/"+yesterday.getFullYear())
  //   for(var l=1; l<32; l++){
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
          let dateArr:any[]=[];
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
            ;
            dateArr.push(this.properDateformat(this.fromDate))
            dates = [...dates, new Date(this.fromDate)];
            this.fromDate.setDate(this.fromDate.getDate() + 1);
            num++;
          }
          this.queryData=collect;
          this.countRate(this.queryData);
          this.countPerDay(this.queryData, dateArr);
        }
      }
    }
  }

  async monthlyQuery(){
    console.log("hi")
    if(this.monthYear==this.monthRange.value.monthYear
      &&this.mDriverId==this.monthRange.value.driver){
      window.alert("You have entered the same month, please enter a different month.");
    }
    else{
        this.monthYear= this.monthRange.value.monthYear;
        this.mDriverId=this.monthRange.value.driver;
        if(this.monthRange.value.monthYear==null
          ||this.monthRange.value.monthYear==""
          ||this.monthRange.value.driver==null
          ||this.monthRange.value.driver==""){
          window.alert('Please fill in the form')
        }
        else if(this.monthRange.invalid){
          window.alert('Invalid Query, please try again')
        }
        else{
          if (this.monthYear=="February"){
            console.log("hi")
            let dates: any[] = [];
            var collect : Rate[]=[];
            let dateArr:any[]=[];
            const str = "1-2-2023";
            const str2 = "28-2-2023"
            const [day, month, year] = str.split('-');
            const [day2, month2, year2] = str2.split('-');
            const fromDate = new Date(+year, +month - 1, +day);
            const toDate = new Date(+year2, +month2 - 1, +day2);
            while(fromDate <= toDate){
              var num=0;
              var rateId = 'rate'+num;
              //console.log(this.simpleDate(fromDate))
              // while((await this.dataApi.getRate2((this.simpleDate(this.fromDate)), this.driverId, rateId))!=null){
              //   collect.push(await this.dataApi.getRate2((this.simpleDate(this.fromDate)), this.driverId, rateId))
              //   num++;
              //   rateId='rate'+num;
              // }
              let dataCollection = await this.dataApi.getRate((this.simpleDate(fromDate)), this.mDriverId)
              collect.push(dataCollection)
              ;
              dateArr.push(this.properDateformat(fromDate))
              dates = [...dates, new Date(fromDate)];
              fromDate.setDate(fromDate.getDate() + 1);
              num++;
            }
            this.mQueryData=collect;
            console.log(this.mQueryData)
            this.countRate(this.mQueryData);
            this.countPerDay(this.mQueryData, dateArr);
          }
        }

    }
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
    if(rateList.length>7){
      this.updateLineChart2(rateListPerDay, dateArr);
    }
    else{
      this.updateLineChart(rateListPerDay, dateArr);
    }
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
      // for(var obj of rateList[i]){
      //   obj.ratingLevel==1?rate1Obj.rateQuantity++:
      //   obj.ratingLevel==2?rate2Obj.rateQuantity++:
      //   obj.ratingLevel==3?rate3Obj.rateQuantity++:
      //   obj.ratingLevel==4?rate4Obj.rateQuantity++:
      //   obj.ratingLevel==5?rate5Obj.rateQuantity++:
      //   ""
      // }
    }
    if(rateList.length>7){
      this.monthlyhighQuantity([rate1Obj, rate2Obj, rate3Obj, rate4Obj, rate5Obj]);
      this.mQueryResult =[rate1Obj.rateQuantity,rate2Obj.rateQuantity,rate3Obj.rateQuantity,
        rate4Obj.rateQuantity,rate5Obj.rateQuantity];
      this.updateChart2(this.mQueryResult)
    }
    else{
      this.highQuantity([rate1Obj, rate2Obj, rate3Obj, rate4Obj, rate5Obj]);
      this.queryResult =[rate1Obj.rateQuantity,rate2Obj.rateQuantity,rate3Obj.rateQuantity,
        rate4Obj.rateQuantity,rate5Obj.rateQuantity];
      this.updateChart(this.queryResult)
    }

  }

//find the highest quantity of rating
highQuantity(rateObjs:any[]){
  const maxRate = rateObjs.reduce(function(prev, current) {
    return (prev.rateQuantity > current.rateQuantity) ? prev : current
  });

  this.highestQuantity.quantity=maxRate.rateQuantity;
  this.highestQuantity.rate=maxRate.rate;

  //find the day with top ratings
  this.dayTopRate(this.highestQuantity);
  //get average daily amount of the highest rating quantity
  this.averageDaily.rate=this.highestQuantity.rate;
  this.averageDaily.quantity=(this.highestQuantity.quantity/7).toPrecision(3);
}

monthlyhighQuantity(rateObjs:any[]){
  console.log(rateObjs)
  const maxRate = rateObjs.reduce(function(prev, current) {
    return (prev.rateQuantity > current.rateQuantity) ? prev : current
  });

  this.mHighestQuantity.quantity=maxRate.rateQuantity;
  this.mHighestQuantity.rate=maxRate.rate;

  //find the day with top ratings
  this.monthdayTopRate(this.mHighestQuantity);
  //get average daily amount of the highest rating quantity
  this.mAverageDaily.rate=this.mHighestQuantity.rate;
  this.mAverageDaily.quantity=(this.mHighestQuantity.quantity/30).toPrecision(3);
}

//find the day with the most amount of the highest ratings quantity
dayTopRate(rate: any){
  let rateList:any[]= this.queryData;
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

  var days = [' (Sunday)', ' (Monday)', ' (Tuesday)', ' (Wednesday)', ' (Thursday)', ' (Friday)', ' (Saturday)'];
  const str = max.date;
  const [day, month, year] = str.split('-');
  const date = new Date(+year, +month - 1, +day);
  this.topDayRate.day=days[date.getDay()];
  this.topDayRate.rate="("+max.rate+")";
  this.topDayRate.quantity=max.quantity;
  this.topDayRate.date=this.properDateformat(date);
}

monthdayTopRate(rate: any){
  let rateList:any[]= this.mQueryData;
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

  var days = [' (Sunday)', ' (Monday)', ' (Tuesday)', ' (Wednesday)', ' (Thursday)', ' (Friday)', ' (Saturday)'];
  const str = max.date;
  const [day, month, year] = str.split('-');
  const date = new Date(+year, +month - 1, +day);
  this.mTopDayRate.day=days[date.getDay()];
  this.mTopDayRate.rate="("+max.rate+")";
  this.mTopDayRate.quantity=max.quantity;
  this.mTopDayRate.date=this.properDateformat(date);
}

properDateformat(date:any){
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = monthNames[date.getMonth()]
  return date.getDate()+" "+m+" "+date.getFullYear();
}
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
