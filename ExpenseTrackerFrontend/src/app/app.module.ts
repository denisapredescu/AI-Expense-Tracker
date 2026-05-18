import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpensesComponent } from './modules/expenses/expenses.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { BudgetsComponent } from './modules/budgets/budgets.component';

import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NavmenuComponent } from './layout/navmenu/navmenu.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgChartsModule } from 'ng2-charts/lib/ng-charts.module';
import { MatSidenavModule } from '@angular/material/sidenav';
// import {MatDatepickerModule} from '@angular/material/datepicker';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { StatisticsCardComponent } from './modules/statistics-card/statistics-card.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    ExpensesComponent,
    DashboardComponent,
    BudgetsComponent,
    MainLayoutComponent,
    NavmenuComponent,
    StatisticsCardComponent,

    
  ],
  imports: [

    NgChartsModule,

    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
  MatListModule,
  MatIconModule,
  BrowserAnimationsModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
