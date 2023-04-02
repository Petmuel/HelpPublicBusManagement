import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import {Component, OnInit, Injectable} from '@angular/core';

@Injectable()
export class SevenDayRange<D> implements MatDateRangeSelectionStrategy<D> {

  constructor(private _dateAdapter: DateAdapter<D>) {
  }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -6);
      const end = this._dateAdapter.addCalendarDays(date, 0);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
