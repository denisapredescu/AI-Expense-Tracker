import { Component, Input, SimpleChanges } from '@angular/core';

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
  lineChartData: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['color']) {
      this.buildChart();
    }
  }

  buildChart() {
    this.lineChartData = {
      labels: ['', '', '', ''],
      datasets: [
        {
          label: '',
          data: [7, 3, 9.5, 6],
          tension: 0.4,
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: this.color,
          color: this.color,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    };
  }

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
        display: false,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
}
