import { ChartOptions } from 'chart.js';
import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { ExpensesService } from 'src/app/services/expenses.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseSummary } from 'src/app/models/ExpenseSummary';
import { BudgetModel } from 'src/app/models/BudgetModel';
import { BudgetsService } from 'src/app/services/budgets.service';
import { AiServiceService } from 'src/app/services/ai-service.service';
import { InsightsModel } from 'src/app/models/InsightsModel';

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
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  ]
})

export class DashboardComponent implements OnInit {

  constructor(private expenseService: ExpensesService,
    private budgetService: BudgetsService,
    private sharedDataService: SharedDataService,
    private aiService: AiServiceService,
          private snackBar: MatSnackBar
  ) {}

  expenses: ExpenseModel[] = [];
  expensesDb: ExpenseModel[] = [];
  expensesGroupBy: ExpenseSummary[] = [];
  insights: InsightsModel = {
    monthlyInsights: '',
    comparedWithOtherMonths: ''
  };
  totalExpense: number = 0;
  totalExpensePerYear: number = 0;
  monthBudget: number = 0;
  budgets: BudgetModel[] = [];
  budgetsDb: BudgetModel[] = [];
  currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  selectedDate = new FormControl<Date | null>(new Date());
  chosenYear: number | undefined = this.selectedDate.getRawValue()?.getFullYear();
  chosenMonth: number | undefined = this.selectedDate.getRawValue()?.getMonth();

  ngOnInit(): void {
    this.getInsights();
    this.budgetService.getAll(this.sharedDataService.currentEmail).subscribe(
      (response:BudgetModel[]) => {
        console.log(response);
        this.budgets = response;
        
      this.budgets.map(r => r.budgetMonth = new Date(r.budgetMonth));
        this.budgetsDb = this.budgets;
        this.getBudgetInfo();
      },
      (error) => {
        console.log(error);
        this.snackBar.open('Failed to extract budget list. Please try again later.' + error, 'Close', {
          duration: 3000
        });}
    );
    this.expenseService.getAll(this.sharedDataService.currentEmail).subscribe(
      (response: ExpenseModel[]) => {
        this.expenses = response;
        this.expensesDb = response;
        console.log(response);

    this.getExpensePerYear();
        this.getExpensesInfo();

        this.buildPieChart();
        this.buildLineChartOfExpenses();
      },
      (error) => {
        this.snackBar.open('Failed to extract expenses. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    );
    // this.getInsights();
//     this.insights = {
// comparedWithOtherMonths
// : 
// "Compared to previous months, your expenses have decreased by 20% this month. This indicates that you are becoming more efficient in managing your expenses.",
// monthlyInsights
// : 
// "This month, you have spent a total of $550 on expenses, which is under your budget of $700. This shows good budget management."}
  }

  loadingGettingInsights: boolean = true;
  getInsights() {
    this.loadingGettingInsights = true;
console.log("i will seach after: ", this.selectedDate.value);
    if (!this.selectedDate.value) {
       this.snackBar.open('Failed to show insights because there are no selected date.', 'Close', {
          duration: 3000
        });
        return;
    } 
    
    else
    this.aiService.getInsights(
      this.sharedDataService.currentEmail, 
     this.selectedDate.value
    ).subscribe(
      (response) => {
        console.log("INSIGHTS: ", response);
        this.insights = response;
        this.loadingGettingInsights = false;
      },
      (error) => {
        console.log(error);
        // this.snackBar.open('Failed to show insights.', 'Close', {
        //   duration: 3000
        // });
      }
    );
  }
  getBudgetInfo() {
        this.budgets = this.budgetsDb.filter(bud => {
      if (!bud.budgetMonth) return false;
console.log(bud.budgetMonth);
      const selected = this.selectedDate.value;
      if (!selected) return true;
      
      return (
        bud.budgetMonth.getFullYear() === selected.getFullYear() &&
       bud.budgetMonth.getMonth()  === selected.getMonth()
      );
    });
console.log(this.budgets);
    this.monthBudget = this.budgets.length > 0 ? this.budgets[0].monthlyLimit: 0;
  }

  getExpensesInfo() {
    this.expenses = this.expensesDb.filter(exp => {
    if (!exp.paymentDate) return false;
    const expDate = new Date(exp.paymentDate);
      if (isNaN(expDate.getTime())) return false;
    return (
      expDate.getFullYear() === this.selectedDate.value?.getFullYear() &&
      expDate.getMonth() === this.selectedDate.value?.getMonth()
    );
  });
    this.totalExpense = this.expenses.reduce(
      (sum, expense) => sum + expense.amount || 0,
      0
    );

    const colors = [
      '#5b5bf7',
      '#36c690',
      '#ff9800',
      '#ff5b8f',
      '#00bcd4',
      '#9c27b0'
    ];

    const total = this.expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    const grouped = this.expenses.reduce((acc, exp) => {

      const category = exp.category?.name || 'Unknown';

      if (!acc[category]) {
        acc[category] = 0;
      }

      acc[category] += exp.amount;

      return acc;

    }, {} as Record<string, number>);
    
    this.expensesGroupBy = Object.entries(grouped).map(
      ([category, amount], index) => ({
        category,
        amount,
        percent: Number(
          ((amount / total) * 100).toFixed(1)
        ),
        color: colors[index % colors.length]
      })
    );
  }

  setMonthAndYear(event: any, datepicker: any) {
    this.selectedDate.setValue(event.value);
    datepicker.close();
  }

  chosenYearHandler(normalizedYear: Moment) {
    this.chosenYear = normalizedYear.year(); // Extract the year from the selected date
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
    const year = this.chosenYear ?? new Date().getFullYear();
    const month = normalizedMonth.month();
    const newDate = new Date(year, month, 1);

    this.selectedDate.setValue(newDate);
    datepicker.close();

    console.log('Selected:', this.selectedDate);

    // this.expenses = this.expensesDb.filter(exp => {
    //   if (!exp.paymentDate) return false;
    //   const expDate = new Date(exp.paymentDate);

    //   if (isNaN(expDate.getTime())) return false;

    //   const selected = this.selectedDate.value;
    //   if (!selected) return true;

    //   return (
    //     expDate.getFullYear() === selected.getFullYear() &&
    //     expDate.getMonth() === selected.getMonth()
    //   );
    // });

      // this.getExpensesInfo();



    this.refresh();   
  }

  getExpensePerYear() {
        this.totalExpensePerYear = this.expensesDb.filter(expense =>  new Date(expense.paymentDate!).getFullYear() === this.selectedDate.value?.getFullYear()).reduce(
      (sum, expense) => sum + expense.amount || 0,
      0
    );
  }

  refresh() {
    console.log(this.selectedDate.value)
    this.getInsights();
    this.getBudgetInfo();
    this.getExpensesInfo();
    this.buildPieChart();
    this.getExpensePerYear();


    this.buildLineChartOfExpenses();

  }

  pieChartData: any = {
      labels: this.expensesGroupBy.map(e => e.category + "  LEI " + e.amount.toFixed(2) + " (" + e.percent + "%)"),

      datasets: [
        {
          data: this.expensesGroupBy.map(e => e.amount),

          backgroundColor:
            this.expensesGroupBy.map(e => e.color),

          borderWidth: 0
        }
      ]
    };
  /* =========================
      PIE CHART DATA
  ========================== */
  buildPieChart() {
    console.log(this.expensesGroupBy);
    this.pieChartData = {
      labels: this.expensesGroupBy.map(e => e.category + "  LEI " + e.amount.toFixed(2) + " (" + e.percent + "%)"),

      datasets: [
        {
          data: this.expensesGroupBy.map(e => e.amount),

          backgroundColor:
            this.expensesGroupBy.map(e => e.color),

          borderWidth: 0
        }
      ]
    };
  }
  /* =========================
      CHART OPTIONS
  ========================== */

  pieChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: '72%',

    plugins: {
      legend: {
        display: true,
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

  buildLineChartOfExpenses() {
    const totals = new Map<string, number>();

  this.expensesDb.filter(exp => new Date(exp.paymentDate || "").getFullYear() == this.selectedDate.value?.getFullYear()).forEach(expense => {
  const date = new Date(expense.paymentDate || "");

  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  totals.set(
    key,
    (totals.get(key) ?? 0) + expense.amount
  );
});
console.log("total", totals);
const labels = [...totals.keys()];
const data = [...totals.values()];
//     const grouped = Object.values(
//   this.expenses.reduce((acc, expense) => {
//     const date = new Date(expense.paymentDate || "");

//     const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

//     if (!acc[key]) {
//       acc[key] = 0;
//     }

//     acc[key] += expense.amount;

//     return acc;
//   }, {} as Record<string, number>)
// );

// const labels = Object.keys(grouped).sort();

// const data = labels.map(label => grouped[label]);

// console.log(labels); // ['2026-05', '2026-06']
// console.log(data);   // [150, 275]

this.trendChartData = {
  labels: labels,
 datasets: [
    {
      label: 'Expenses',
      data: data,  borderColor: '#7c4dff',

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
  }

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

sortedDescExpensesDb() {
  return this.expensesDb.sort((a, b) => new Date(b.paymentDate || "").getTime() - new Date(a.paymentDate || "").getTime())
}
}