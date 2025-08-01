"use client";
import React from "react";

interface BudgetChartProps {
  currentMonthExpenses: number;
  currentMonthIncome: number;
}

export default function BudgetChart({
  currentMonthExpenses,
  currentMonthIncome,
}: BudgetChartProps) {
  const percentage =
    currentMonthIncome > 0
      ? (currentMonthExpenses / currentMonthIncome) * 100
      : 0;
  const strokeDasharray =
    currentMonthIncome > 0
      ? Math.min((currentMonthExpenses / currentMonthIncome) * 201, 201)
      : 0;
  const isOverBudget = currentMonthExpenses > currentMonthIncome;
  const isAtLimit = currentMonthExpenses === currentMonthIncome;
  const remaining = currentMonthIncome - currentMonthExpenses;
  const hasNoData = currentMonthIncome === 0 && currentMonthExpenses === 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={`${strokeDasharray} 201`}
            className={`transition-all duration-300 ${
              isOverBudget ? "text-red-500" : "text-blue-500"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-sm font-medium ${
              isOverBudget ? "text-red-600" : "text-slate-600"
            }`}
          >
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-medium text-slate-800">
          This Month's Budget
        </h4>
        <p className="text-2xl font-light text-slate-800">
          ${currentMonthIncome.toLocaleString()}
        </p>
        <p className="text-sm text-slate-500">
          ${currentMonthExpenses.toLocaleString()} spent
        </p>
        {!hasNoData && (
          <p
            className={`text-sm font-medium ${
              isOverBudget ? "text-red-600" : "text-green-600"
            }`}
          >
            {isOverBudget
              ? `Due Amount: $${Math.abs(remaining).toLocaleString()}`
              : `Budget Limit Left: $${remaining.toLocaleString()}`}
          </p>
        )}
        {(isOverBudget || isAtLimit) && !hasNoData && (
          <div>
            <p className="text-xs font-medium text-red-700">
              {isOverBudget
                ? "⚠️ Warning: You've exceeded your budget limit!"
                : "⚠️ Warning: You've reached your budget limit!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
