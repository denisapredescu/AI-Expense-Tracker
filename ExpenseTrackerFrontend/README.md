# AI Expense Tracker Frontend

A modern Angular frontend for an AI-enabled expense tracking application. This project provides:

- Authentication and protected routing
- Expense management with AI-based natural language expense extraction
- Budget tracking and monthly budget editing
- Insights dashboard with charts and summaries
- Integration with a .NET backend API for persistence

## 🚀 Key Features

### Authentication
- Login and registration pages
- Client-side route protection via `AuthGuard`
- JWT stored in `localStorage`
- Current user email shared across components via `SharedDataService`

### Expenses
- View user-specific expenses
- Filter expenses by month and category
- Edit, remove, and save expenses
- AI extraction for natural language expense entry
- Supports manual or AI-assisted entry of expense details

### Budgets
- View monthly budgets
- Filter budgets by month/year
- Edit, delete, and save budgets
- Monthly budget performance data reflected in dashboard summaries

### Dashboard
- Expense summary for the selected month
- Total expense calculations
- Budget vs expense comparisons
- Category-based expense grouping
- AI-powered insights fetched from backend API

### UI & Visuals
- Angular Material components
- Responsive navigation layout
- Charts powered by `ng2-charts` and `chart.js`
- Date pickers using Moment adapter for month/year selection

## 📁 Project Structure

- `src/app/app.module.ts` — main application module
- `src/app/app-routing.module.ts` — app routes and lazy-loaded auth module
- `src/app/pages` — page components for auth, dashboard, expenses, budgets
- `src/app/services` — backend API integration services
- `src/app/models` — typed models for expenses, budgets, users, insights
- `src/app/shared/components` — reusable UI components like forms and statistic cards

## 🔌 Backend Integration

This frontend expects a .NET backend running at `https://localhost:44386`.

### Configured API endpoints
- `https://localhost:44386/User/Login`
- `https://localhost:44386/User/Register`
- `https://localhost:44386/Expense/GetAll?userEmail=`
- `https://localhost:44386/Expense/Save`
- `https://localhost:44386/Expense/SaveAll?userEmail=`
- `https://localhost:44386/Expense/Update`
- `https://localhost:44386/Expense/Delete`
- `https://localhost:44386/Budget/GetAll?userEmail=`
- `https://localhost:44386/Budget/Save`
- `https://localhost:44386/Budget/Update`
- `https://localhost:44386/Budget/Delete?budgetId=`
- `https://localhost:44386/api/ai/extract`
- `https://localhost:44386/api/ai/getInsights`

## 🧠 AI Features

- `AiServiceService.extract()` sends free-form user text to the backend AI endpoint for expense extraction
- The backend transforms the text into structured `ExpenseModel[]`
- `AiServiceService.getInsights()` fetches month-based financial insights for the current user
- AI extraction is used in `NewExpenseComponent`
- Insights are rendered on the `DashboardComponent`

## 📌 Running Locally

### Prerequisites
- Node.js + npm
- Angular CLI 15-compatible environment
- Local .NET backend running at `https://localhost:44386`

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm start
```

Open `http://localhost:4200/` in your browser.

## 🧪 Available Scripts

- `npm start` — starts the Angular dev server
- `npm build` — builds the app for production
- `npm run watch` — builds continuously in development mode
- `npm test` — runs unit tests with Karma

## 💡 Notes

- Authentication state is stored in `localStorage` via `accessToken` and `email`
- Expenses and budgets are user-specific and loaded using the shared current email
- Date filtering is applied per selected month/year in both budgets and expenses pages
- AI extraction requires the backend AI service to be available

## 📦 Tech Stack

- Angular 15
- Angular Material
- ng2-charts / Chart.js
- Moment.js
- TypeScript
- RxJS

## 🛠️ Future Improvements

- Strengthen route guard logic to block unauthorized navigation
- Add better error handling for failed backend requests
- Implement a dedicated user profile and logout flow
- Support grouped category filters and full budget analytics
