import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { AuthComponent } from './pages/auth/auth/auth.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { BudgetsComponent } from './pages/budgets/budgets.component';
import { NewExpenseComponent } from './pages/expenses/new-expense/new-expense.component';
import { NewBudgetComponent } from './pages/budgets/new-budget/new-budget.component';

const routes: Routes = [

  // APP (cu layout + sidenav)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'expenses/new', component: NewExpenseComponent },
      { path: 'budgets', component: BudgetsComponent },
      { path: 'budgets/new', component: NewBudgetComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  // fallback
  { path: '**', redirectTo: 'dashboard' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
