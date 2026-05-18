import { Component, Input  } from '@angular/core';

import { ChartOptions } from 'chart.js';
@Component({
  selector: 'app-statistics-card',
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.scss']
})
export class StatisticsCardComponent {
  @Input() title: string = 'Total Expenses';
  @Input() value: string = '$1,234.56';
  @Input() icon: string = 'attach_money';
  @Input() color: string = '#4c8baf';

  lineChartData = {
  labels: ['', '', '', ''],
  
  datasets: [
    {
      label: '',
      data: [9, 7, 10, 8],
      // fill: false,
      tension: 0.4,
      fill: true,
backgroundColor: 'rgba(75, 192, 192, 0.2)',
borderColor: this.color,
borderWidth: 2,
pointRadius: 0
    }
  ]
};

public lineChartOptions: ChartOptions<'line'> = {

  responsive: true,
  maintainAspectRatio: false,
  

  animation: {
    duration: 2500,
    easing: 'easeInBack'
  },

  elements: {
    line: {
      tension: 0.4
    }
  },

  scales: {

    x: {
      display: false
    },

    y: {
      display: false
    }

  },

  plugins: {
    legend: {
      display: false
    }
  }

};
}
