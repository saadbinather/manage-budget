"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Translation dictionary
const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.stats": "Stats",
    "nav.history": "History",
    "nav.profile": "Profile",

    // Home page
    "home.title": "Budget Tracker",
    "home.subtitle": "Manage your finances with precision and clarity",
    "home.addExpense": "Add Expense",
    "home.addIncome": "Add Income",
    "home.totalExpenses": "Expenses",
    "home.totalIncome": "Income",
    "home.netBalance": "Net Balance",
    "home.transactions": "transactions",
    "home.positiveBalance": "Positive balance",
    "home.negativeBalance": "Negative balance",
    "home.categoryBreakdown": "Category Breakdown",
    "home.totalMonthlyExpenses": "Total Monthly Expenses",
    "home.showDetailedAnalysis": "Show Detailed Analysis",
    "home.recentTransactions": "Recent Transactions",
    "home.latestFinancialActivities": "Your latest financial activities",
    "home.noTransactionsYet": "No transactions yet",
    "home.startTrackingFinances":
      "Start tracking your finances by adding your first expense or income entry",
    "home.viewAllTransactions": "View all transactions →",
    "home.formTitle": "Title",
    "home.formDate": "Date",
    "home.formCategory": "Category",
    "home.selectCategory": "Select category",
    "home.formAmount": "Amount ($)",
    "home.enterExpenseTitle": "Enter expense title",
    "home.deleteTransaction": "Delete transaction",

    // Profile page
    "profile.title": "User Profile",
    "profile.subtitle": "Manage your account and view your financial overview",
    "profile.editProfile": "Edit Profile",
    "profile.editing": "Editing...",
    "profile.budgetTrackerUser": "Budget Tracker User",
    "profile.name": "Name",
    "profile.age": "Age",
    "profile.email": "Email",
    "profile.years": "years",
    "profile.totalIncome": "Total Income",
    "profile.totalExpenses": "Total Expenses",
    "profile.recentTransactions": "Recent Transactions",
    "profile.latestActivities": "Your latest financial activities",
    "profile.total": "total",
    "profile.viewAll": "View all transactions →",
    "profile.income": "Income",
    "profile.expense": "Expense",
    "profile.thisMonthsBudget": "This Month's Budget",
    "profile.spent": "spent",
    "profile.dueAmount": "Due Amount",
    "profile.budgetLimitLeft": "Budget Limit Left",
    "profile.warningExceeded": "Warning: You've exceeded your budget limit!",
    "profile.warningReached": "Warning: You've reached your budget limit!",

    // Stats page
    "stats.title": "Financial Statistics",
    "stats.subtitle": "Analyze your spending patterns and trends",
    "stats.advancedFilters": "Advanced Filters",
    "stats.resetFilters": "Reset Filters",
    "stats.dateFrom": "Date From",
    "stats.dateTo": "Date To",
    "stats.category": "Category",
    "stats.amountRange": "Amount Range",
    "stats.type": "Type",
    "stats.all": "All",
    "stats.expense": "Expense",
    "stats.income": "Income",
    "stats.applyFilters": "Apply Filters",
    "stats.today": "Today",
    "stats.thisWeek": "This Week",
    "stats.thisMonth": "This Month",
    "stats.lastMonth": "Last Month",
    "stats.thisYear": "This Year",
    "stats.sixMonths": "6 Months",
    "stats.fiveYears": "5 Years",
    "stats.tenYears": "10 Years",
    "stats.financialOverview": "Financial Overview",
    "stats.monthlyTrends": "Monthly Trends",
    "stats.expenseBreakdownByCategory": "Expense Breakdown by Category",
    "stats.budgetVsActualSpending": "Budget vs Actual Spending",
    "stats.tryAdjustingFilters": "Try adjusting your filters",
    "stats.showingFilteredResults": "Showing filtered results",
    "stats.filteredTransactions": "Filtered Transactions",








    
    // History page
    "history.title": "Transaction History",
    "history.subtitle": "View and manage your financial records",
    "history.noTransactions": "No transactions found",
    "history.addFirstTransaction": "Add your first transaction to get started",
    "history.date": "Date",
    "history.category": "Category",
    "history.amount": "Amount",
    "history.transactionTitle": "Title",
    "history.actions": "Actions",
    "history.delete": "Delete",
    "history.edit": "Edit",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.min": "Min",
    "common.max": "Max",
    "common.range": "Range",

    // Categories
    "category.food": "Food",
    "category.rent": "Rent",
    "category.utilities": "Utilities",
    "category.travel": "Travel",
    "category.entertainment": "Entertainment",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.stats": "Estadísticas",
    "nav.history": "Historial",
    "nav.profile": "Perfil",

    // Home page
    "home.title": "Rastreador de Presupuesto",
    "home.subtitle": "Gestiona tus finanzas con precisión y claridad",
    "home.addExpense": "Agregar Gasto",
    "home.addIncome": "Agregar Ingreso",
    "home.totalExpenses": "Gastos Totales",
    "home.totalIncome": "Ingresos Totales",
    "home.netBalance": "Balance Neto",
    "home.transactions": "transacciones",
    "home.positiveBalance": "Balance positivo",
    "home.negativeBalance": "Balance negativo",
    "home.categoryBreakdown": "Desglose por Categoría",
    "home.totalMonthlyExpenses": "Gastos Mensuales Totales",
    "home.showDetailedAnalysis": "Mostrar Análisis Detallado",
    "home.recentTransactions": "Transacciones Recientes",
    "home.latestFinancialActivities": "Tus últimas actividades financieras",
    "home.noTransactionsYet": "Aún no hay transacciones",
    "home.startTrackingFinances":
      "Comienza a rastrear tus finanzas agregando tu primer gasto o ingreso",
    "home.viewAllTransactions": "Ver todas las transacciones →",
    "home.formTitle": "Título",
    "home.formDate": "Fecha",
    "home.formCategory": "Categoría",
    "home.selectCategory": "Seleccionar categoría",
    "home.formAmount": "Monto ($)",
    "home.enterExpenseTitle": "Ingresa el título del gasto",
    "home.deleteTransaction": "Eliminar transacción",

    // Profile page
    "profile.title": "Perfil de Usuario",
    "profile.subtitle": "Gestiona tu cuenta y visualiza tu resumen financiero",
    "profile.editProfile": "Editar Perfil",
    "profile.editing": "Editando...",
    "profile.budgetTrackerUser": "Usuario del Rastreador de Presupuesto",
    "profile.name": "Nombre",
    "profile.age": "Edad",
    "profile.email": "Correo",
    "profile.years": "años",
    "profile.totalIncome": "Ingresos Totales",
    "profile.totalExpenses": "Gastos Totales",
    "profile.recentTransactions": "Transacciones Recientes",
    "profile.latestActivities": "Tus últimas actividades financieras",
    "profile.total": "total",
    "profile.viewAll": "Ver todas las transacciones →",
    "profile.income": "Ingreso",
    "profile.expense": "Gasto",
    "profile.thisMonthsBudget": "Presupuesto de Este Mes",
    "profile.spent": "gastado",
    "profile.dueAmount": "Monto Adeudado",
    "profile.budgetLimitLeft": "Presupuesto Restante",
    "profile.warningExceeded":
      "¡Advertencia: Has excedido tu límite de presupuesto!",
    "profile.warningReached":
      "¡Advertencia: Has alcanzado tu límite de presupuesto!",

    // Stats page
    "stats.title": "Estadísticas Financieras",
    "stats.subtitle": "Analiza tus patrones de gasto y tendencias",
    "stats.advancedFilters": "Filtros Avanzados",
    "stats.resetFilters": "Restablecer Filtros",
    "stats.dateFrom": "Fecha Desde",
    "stats.dateTo": "Fecha Hasta",
    "stats.category": "Categoría",
    "stats.amountRange": "Rango de Monto",
    "stats.type": "Tipo",
    "stats.all": "Todo",
    "stats.expense": "Gasto",
    "stats.income": "Ingreso",
    "stats.applyFilters": "Aplicar Filtros",
    "stats.today": "Hoy",
    "stats.thisWeek": "Esta Semana",
    "stats.thisMonth": "Este Mes",
    "stats.lastMonth": "Mes Pasado",
    "stats.thisYear": "Este Año",
    "stats.sixMonths": "6 Meses",
    "stats.fiveYears": "5 Años",
    "stats.tenYears": "10 Años",
    "stats.financialOverview": "Resumen Financiero",
    "stats.monthlyTrends": "Tendencias Mensuales",
    "stats.expenseBreakdownByCategory": "Desglose de Gastos por Categoría",
    "stats.budgetVsActualSpending": "Presupuesto vs Gasto Real",
    "stats.tryAdjustingFilters": "Intenta ajustar tus filtros",
    "stats.showingFilteredResults": "Mostrando resultados filtrados",
    "stats.filteredTransactions": "Transacciones Filtradas",

    // History page
    "history.title": "Historial de Transacciones",
    "history.subtitle": "Ver y gestionar tus registros financieros",
    "history.noTransactions": "No se encontraron transacciones",
    "history.addFirstTransaction":
      "Agrega tu primera transacción para comenzar",
    "history.date": "Fecha",
    "history.category": "Categoría",
    "history.amount": "Monto",
    "history.transactionTitle": "Título",
    "history.actions": "Acciones",
    "history.delete": "Eliminar",
    "history.edit": "Editar",

    // Common
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.cancel": "Cancelar",
    "common.save": "Guardar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.close": "Cerrar",
    "common.confirm": "Confirmar",
    "common.yes": "Sí",
    "common.no": "No",
    "common.min": "Mín",
    "common.max": "Máx",
    "common.range": "Rango",

    // Categories
    "category.food": "Comida",
    "category.rent": "Renta",
    "category.utilities": "Servicios",
    "category.travel": "Viajes",
    "category.entertainment": "Entretenimiento",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
