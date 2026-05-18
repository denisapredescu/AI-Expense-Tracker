// import { Component } from '@angular/core';

import { ChartOptions, Legend } from 'chart.js';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
// import {MatDatepicker} from '@angular/material/datepicker';
// import {FormControl} from '@angular/forms';
// import * as moment from 'moment';
// import { Moment } from 'moment';

// // the `default as` syntax.
// import * as _moment from 'moment';
// // tslint:disable-next-line:no-duplicate-imports
// import {default as _rollupMoment, Moment} from 'moment';

// const moment = _rollupMoment || _moment;

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';

import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
  // { provide: MAT_NATIVE_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS },
  // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
{ provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
]

})


export class DashboardComponent {
  // date = new FormControl(moment());

  // chosenYearHandler(normalizedYear: Moment) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.year(normalizedYear.year());
  //   this.date.setValue(ctrlValue);
  // }

  // chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value;
  //   ctrlValue.month(normalizedMonth.month());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }
  public currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

selectedDate = new FormControl<Date | null>(new Date());

chosenYear: number | null = null;

chosenMonth: number | null = null;

setMonthAndYear(event: any, datepicker: any) {
  // this.selectedDate = event.value;
  this.selectedDate.setValue(event.value);
  datepicker.close();
  
  console.log('Selected:', this.selectedDate);

}

chosenYearHandler(normalizedYear: Moment) {
  console.log('Chosen Year:', normalizedYear);
  this.chosenYear = normalizedYear.year(); // Extract the year from the selected date
}

chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
// this.chosenMonth = normalizedMonth.getMonth(); // Months are zero-indexed
//   // const ctrlValue = datepicker.month; // this.selectedDate || new Date();

//   // ctrlValue.setMonth(normalizedMonth.getMonth());

//   // ctrlValue.setFullYear(normalizedMonth.getFullYear());

//   this.selectedDate.setValue(new Date(this.chosenYear || 2000, this.chosenMonth)); //ctrlValue;

  const year = this.chosenYear ?? new Date().getFullYear();
  const month = normalizedMonth.month();

  const newDate = new Date(year, month, 1);

  this.selectedDate.setValue(newDate);

  datepicker.close();

  console.log('Selected:', this.selectedDate);
}

  /* =========================
      EXPENSES DATA
  ========================== */

  expenses = [
    {
      category: 'Housing',
      amount: 600,
      percent: 43.1,
      color: '#5b5bf7'
    },
    {
      category: 'Food & Dining',
      amount: 307.45,
      percent: 22.1,
      color: '#36c690'
    },
    {
      category: 'Transport',
      amount: 192.1,
      percent: 13.8,
      color: '#ff9800'
    },
    {
      category: 'Entertainment',
      amount: 112.5,
      percent: 8.1,
      color: '#ff5b8f'
    }
  ];

  /* =========================
      AI INSIGHTS
  ========================== */

  aiInsights = [
    {
      type: 'success',
      icon: '✔',
      text: 'You saved 15% more compared to last month.'
    },
    {
      type: 'info',
      icon: 'ℹ',
      text: 'Transport expenses are lower than usual.'
    },
    {
      type: 'warning',
      icon: '⚠',
      text: 'You can save around $120 if you reduce entertainment expenses.'
    }
  ];

  /* =========================
      PIE CHART DATA
  ========================== */

  pieChartData = {
    labels: this.expenses.map(e => e.category + "  $ " + e.amount.toFixed(2) + " (" + e.percent + "%)"),

    datasets: [
      {
        data: this.expenses.map(e => e.amount),

        backgroundColor:
          this.expenses.map(e => e.color),

        borderWidth: 0
      }
    ]
  };

  /* =========================
      CHART OPTIONS
  ========================== */

  pieChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: '72%',

    plugins: {
      legend: {
        display: false,
        position: 'right',
          labels: {
          
          font: {
            size: 14,
            weight: 'bold',
            
          }
        }
      }
    },

    animation: {
      animateRotate: true,
      duration: 2000
    }
  };


trendChartData = {
  labels: [
    'Jan',


    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun'
  ],

  datasets: [
    {
      label: 'Expenses',

      data: [
        1200,
        900,
        1400,
        1000,
        1600,
        1300
      ],

      borderColor: '#7c4dff',

      backgroundColor:
        'rgba(124,77,255,0.15)',

      fill: true,

      tension: 0.4,

      pointRadius: 4,

      pointBackgroundColor: '#7c4dff',

      borderWidth: 3
    }
  ]
};


trendChartOptions: ChartOptions<'line'> = {

  responsive: true,

  maintainAspectRatio: false,

  animation: {
    duration: 2000,
    easing: 'easeOutQuart'
  },

  plugins: {
    legend: {
      display: false
    }
  },

  scales: {

    x: {
      grid: {
        display: false
      }
    },

    y: {
      beginAtZero: true,

      grid: {
        color: 'rgba(0,0,0,0.05)'
      }
    }
  }
};

transactions = [
  {
    title: 'Netflix Subscription',
    date: 'Today, 10:45 AM',
    amount: 15.99,
    category: 'Entertainment',
    icon: 'movie',
    color: '#ff5b8f'
  },
  {
    title: 'Uber Ride',
    date: 'Yesterday, 08:20 PM',
    amount: 22.50,
    category: 'Transport',
    icon: 'directions_car',
    color: '#ff9800'
  },
  {
    title: 'Starbucks Coffee',
    date: 'Yesterday, 09:10 AM',
    amount: 8.75,
    category: 'Food',
    icon: 'restaurant',
    color: '#36c690'
  },
  {
    title: 'Monthly Rent',
    date: 'May 1, 2026',
    amount: 600,
    category: 'Housing',
    icon: 'home',
    color: '#5b5bf7'
  }
];

  //  public pieChartOptions: ChartOptions = {
  //   responsive: true
  // };
  // public barChartData3
  // = {
  //   labels:[['Download', 'Sales'],
  //   ['In', 'Store', 'Sales'],
  //   'Mail Sales'
  // ],
  // datasets: [{
  //   label: 'Sales',
  //   data: [300, 500, 100]
  // }]};

  public pieChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

public barChartOptions: ChartOptions<'bar'> = {

  responsive: true,
  maintainAspectRatio: false,

  animation: {
    duration: 2500,
    easing: 'easeOutQuart'
  },

  animations: {
    y: {
      from: 0
    }
  },

  plugins: {
    legend: {
      display: true
    }
  }
};

public lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,

  animation: {
    duration: 3000,
    easing: 'easeOutQuart'
  },

  elements: {
    line: {
      tension: 0.4
    }
  },

  animations: {
    x: {
      duration: 3000
    },
    y: {
      from: 0
    }
  }
};
barChartData = {
  labels: ['Food', 'Rent', 'Transport'],
  datasets: [
    {
      data: [200, 800, 150],
      label: 'Expenses'
    }
  ]
};
barChartData2 = {
  labels: ['Food', 'Rent', 'Transport', 'Shopping'],
  datasets: [
    {
      label: 'Expenses',
      data: [120, 800, 200, 350],
    }
  ]
};

chartOptions = {
  responsive: true,
  // maintainAspectRatio: false,
  
  duration:  5000,
    easing: 'easeOutQuart'


    //  responsive: true,
    // plugins: {
    //   legend: {
    //     position: 'top',
    //   },
    //   title: {
    //     display: true,
    //     text: 'Chart.js Bar Chart'
    //   }
    // }
};

lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label: 'Monthly Expenses',
      data: [500, 700, 400, 900],
      fill: false,
      tension: 0.4
    }
  ]
};
// pieChartData = {
//   labels: ['Food', 'Rent', 'Bills'],
//   datasets: [
//     {
//       data: [300, 900, 200]
//     },
  
//   ]
// };


doughnutChartData = {
  labels: ['Savings', 'Expenses'],
  datasets: [
    {
      data: [4000, 2500]
    }
  ]
};

radarChartData = {
  labels: ['Food', 'Transport', 'Shopping', 'Bills'],
  datasets: [
    {
      label: 'This Month',
      data: [200, 150, 300, 400]
    }
  ]
};


polarChartData = {
  labels: ['Food', 'Travel', 'Bills'],
  datasets: [
    {
      data: [300, 500, 200]
    }
  ]
};
}