import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BudgetsComponent } from './pages/budgets/budgets.component';

import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { NavmenuComponent } from './layout/navmenu/navmenu.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { StatisticsCardComponent } from './shared/components/statistics-card/statistics-card.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { NewExpenseComponent } from './pages/expenses/new-expense/new-expense.component';
import { NewBudgetComponent } from './pages/budgets/new-budget/new-budget.component';
import { MatSelectModule } from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpenseFormComponent } from './shared/components/expense-form/expense-form.component';
import { A11yModule } from "@angular/cdk/a11y";
import { BudgetFormComponent } from './shared/components/budget-form/budget-form.component';
import { EntityPageLayoutComponent } from './shared/components/entity-page-layout/entity-page-layout.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    AppComponent,
    ExpensesComponent,
    DashboardComponent,
    BudgetsComponent,
    MainLayoutComponent,
    NavmenuComponent,
    StatisticsCardComponent,
    NewExpenseComponent,
    NewBudgetComponent,
    ExpenseFormComponent,
    BudgetFormComponent,
    EntityPageLayoutComponent,
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
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    A11yModule,
    MatChipsModule,
    MatProgressSpinnerModule
],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
