
import {Chart, registerables} from 'node_modules/chart.js'
import {Component, OnInit, Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { FormGroup, FormControl } from '@angular/forms';
Chart.register(...registerables)

@Injectable()
export class SevenDayRange<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -3);
      const end = this._dateAdapter.addCalendarDays(date, 3);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SevenDayRange,
    },
  ],
})
export class StatisticComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  constructor() { }

  ngOnInit(): void {
    this.RenderChart()
  }

  RenderChart(){
    console.log("Chart")
    new Chart("piechart", {
    type: 'pie',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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

}
