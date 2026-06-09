# 💰 AI Expense Tracker

A full-stack expense tracking application with an Angular frontend and ASP.NET Core backend.

This repository contains:
- `ExpenseTrackerFrontend/` — Angular 15 frontend
- `Backend/` — .NET solution with API, business logic, and data access layers

## 🌟 What this app does

- Authenticated user login and registration
- Monthly budget and expenses creation and editing
- Natural language expense entry via AI extraction
- AI-generated financial insights for the selected month
- Dashboard charts and expense category summaries

## 🧭 Architecture

- Frontend: `ExpenseTrackerFrontend/`
  - Angular Material UI
  - Protected routes with `AuthGuard`
  - Shared email state in `SharedDataService`
  - Charts with `ng2-charts` + `chart.js`
- Backend: `Backend/Expense Tracker.API/`
  - ASP.NET Core Web API
  - Business logic in `Backend/Expense Tracker.BLL/`
  - Data access in `Backend/Expense Tracker.DAL/`
  - SQL Server persistence via Entity Framework Core
  - AI integration through `AIService` and OpenRouter

## 🚀 Features

### Authentication
- Login and register users
- JWT token stored in `localStorage`
- Current user email shared across frontend components
- Route guarding on app pages

![Alt text](/readme-images/login-page.gif)

### Dashboard Display
- Filter data (bugdet and expenses) by month and year
- Show expenses totals, monthly budget, savings
- Pie Chart based on the expenses divided on categories
- Line Chart of expenses by month for the specified year
- AI Insights

 ![Alt text](/readme-images/dashboard-page.gif) 

### Expense Management
- View expenses by user
- Add and edit expenses
- Delete expenses
- Save manualy one by one or a batch of AI-extracted expenses
- Filter expenses by month and category
- Sort expenses
  
![Alt text](/readme-images/expenses-page.gif)

### Budget Management
- Create monthly budgets
- Update budgets
- Delete budgets
- Filter budgets by month/year
- Sort budgets

![Alt text](/readme-images/budgets-page.gif)

### AI Capabilities
- Free-form text extraction powered by backend AI service
- Structured expense JSON enforced by strict prompt rules
- Insight generation using current month and historical data
- AI service uses OpenRouter with `gpt-3.5-turbo`

## 🔌 Backend API Endpoints

### User
- `POST /User/Login` — login and receive JWT
- `POST /User/Register` — register a new user

### Expenses
- `GET /Expense/GetAll?userEmail={}` — list user expenses
- `POST /Expense/Save` — save a single expense
- `POST /Expense/SaveAll?userEmail={}` — save multiple expenses
- `POST /Expense/Update` — update an expense
- `DELETE /Expense/Delete` — delete an expense

### Budgets
- `GET /Budget/GetAll?userEmail={}` — list user budgets
- `POST /Budget/Save` — save a new budget
- `POST /Budget/Update` — update a budget
- `DELETE /Budget/Delete?budgetId={}` — delete a budget

### Categories
- `GET /Category/GetAll` — list all category options

### AI
- `POST /api/ai/extract` — extract expenses from text
- `GET /api/ai/getInsights?userEmail=&selectedMonth={}` — get month+year insights

## ⚙️ Local Setup

### Prerequisites
- Node.js and npm
- .NET SDK
- SQL Server instance
- Angular CLI-compatible environment

### Frontend

```bash
cd ExpenseTrackerFrontend
npm install
npm start
```

Open `http://localhost:4200/`

### Backend

1. Open `Backend/Expense Tracker.API/Expense Tracker.API.sln`
2. Update `Backend/Expense Tracker.API/appsettings.json`
   - `ConnectionStrings:ConnString` should point to your SQL Server instance
   - `OpenRouter:ApiKey` should contain your OpenRouter API key (empty now because is a secret)
3. Run the API project in Visual Studio 

The backend is expected to run on `https://localhost:44386`

## 🧩 Important Configuration

- SQL Server connection string in `Backend/Expense Tracker.API/appsettings.json`
- JWT secret in `Jwt:Token`
- OpenRouter API key in `OpenRouter:ApiKey`
- CORS allows `http://localhost:4200`

## 🧠 AI Implementation Notes

- `Backend/Expense Tracker.BLL/Services/AIService.cs` builds strict prompt instructions
- Expense extraction returns a valid JSON array of expense objects
- Insights use current and historical budget/expense data
- The backend parses OpenRouter responses and converts them into typed models

## 📂 Directory Overview

- `ExpenseTrackerFrontend/` — Angular SPA
- `Backend/Expense Tracker.API/` — ASP.NET API and startup
- `Backend/Expense Tracker.BLL/` — business services, AI, auth
- `Backend/Expense Tracker.DAL/` — EF Core database context, entities, repositories

## ⚠️ Known behavior

- `AuthGuard` currently allows navigation by returning `true`, but login state is still stored in `localStorage`
- AI extraction depends on backend availability and a configured OpenRouter API key

## 🛠️ Tech Stack

- Angular 15
- Angular Material
- TypeScript
- RxJS
- ASP.NET Core
- Entity Framework Core
- SQL Server
- OpenRouter API
