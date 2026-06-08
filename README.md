# 💰 AI Expense Tracker

An AI-powered full-stack expense management system built with **Angular**, **.NET**, **SQL Server**, and **OpenRouter (LLM integration)**.

---

## 🚀 Features

### 🔐 Authentication
- Secure login system
- User-based data isolation
- Persistent session handling


---

### 📊 Dashboard
- Overview of:
  - Total budgets
  - Total expenses
  - Savings
- Real-time financial summary

---

### 💰 Budgets Management
- Create, update, and delete monthly budgets
- Filter by month and year
- Automatic recalculation and sorting

---

### 🧾 Expenses Management (AI-powered)

Users can input natural language text and the system automatically extracts structured expenses using AI.

Example input: Paid 120 lei at Kaufland for groceries and 50 lei at OMV for fuel
```

AI extracts:

```json
[
  {
    "categoryId": 1,
    "amount": 120,
    "currency": "LEI",
    "paymentMethod": "Card",
    "paymentDate": "2026-06-09",
    "merchant": "Kaufland",
    "description": "groceries"
  }
]
```

## 📈 AI Insights

The system generates financial insights using OpenRouter (GPT-3.5 Turbo).

It analyzes:
- Current month budgets
- Current month expenses
- Historical financial data

It provides:
- Monthly financial summary
- Budget vs expense analysis
- Comparison with previous months
- Spending behavior insights

---

## 🧠 AI Integration

AI is powered by OpenRouter API (LLM abstraction layer).

### Core service:
```csharp id="c1a2b3"
OpenRouterExecutor(prompt)
```

## ✨ Features

- AI-powered expense extraction from natural language input  
- Strict JSON output enforcement for structured data  
- Financial insights generation using LLM reasoning  
- Prompt-engineered system for consistent responses  

---

## 🏗️ Architecture

```text id="arch_001"
Angular Frontend
        ↓
ASP.NET Core Web API
        ↓
Business Layer (Services)
        ↓
OpenRouter AI API
        ↓
SQL Server Database
```

## 🛠️ Tech Stack

### Frontend
- Angular  
- TypeScript  
- RxJS  

### Backend
- ASP.NET Core Web API  
- C#  

### Database
- SQL Server  

### AI
- OpenRouter API  
- GPT-3.5 Turbo  

---

## 📸 UI Preview (GIFs)

- Login page (GIF demo)  
- Dashboard (GIF demo)  
- Budgets management (GIF demo)  
- Expenses AI extraction (GIF demo)  
- AI insights generation (GIF demo)  

---

## 🔑 Key Highlights

- AI-driven expense extraction from natural language  
- Financial insights powered by LLM  
- Clear separation between backend logic and AI layer  
- Full-stack architecture (.NET + Angular)  
- Real-world financial tracking system  

---

## ⚠️ Notes

- AI responses are validated on backend  
- Financial calculations are partially deterministic  
- OpenRouter is used as LLM abstraction layer  
