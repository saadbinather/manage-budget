"use client";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  format,
  subMonths,
  subYears,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
} from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Expense = {
  date: string;
  category: string;
  amount: number;
};

type Income = {
  date: string;
  amount: number;
};

interface ExpenseChartProps {
  expenses: Expense[];
  incomes: Income[];
}

const getTimePeriods = (t: (key: string) => string) => [
  { label: t("stats.today"), value: "today" },
  { label: t("stats.thisWeek"), value: "week" },
  { label: t("stats.thisMonth"), value: "month" },
  { label: t("stats.lastMonth"), value: "lastMonth" },
  { label: t("stats.thisYear"), value: "year" },
  { label: t("stats.sixMonths"), value: "6months" },
  { label: t("stats.fiveYears"), value: "5years" },
  { label: t("stats.tenYears"), value: "10years" },
];

export default function ExpenseChart({ expenses, incomes }: ExpenseChartProps) {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Get chart dimensions based on time period
  const getChartDimensions = () => {
    switch (selectedPeriod) {
      case "today":
        return { height: "h-48", barThickness: 60, maxRotation: 0 };
      case "week":
        return { height: "h-56", barThickness: 50, maxRotation: 15 };
      case "month":
        return { height: "h-64", barThickness: 40, maxRotation: 45 };
      case "lastMonth":
        return { height: "h-64", barThickness: 40, maxRotation: 45 };
      case "year":
        return { height: "h-72", barThickness: 30, maxRotation: 45 };
      case "6months":
        return { height: "h-80", barThickness: 25, maxRotation: 45 };
      case "5years":
        return { height: "h-96", barThickness: 20, maxRotation: 45 };
      case "10years":
        return { height: "h-96", barThickness: 15, maxRotation: 45 };
      default:
        return { height: "h-64", barThickness: 40, maxRotation: 45 };
    }
  };

  // Smart data aggregation to limit marks to 10-12
  const aggregateData = (
    filteredExpenses: Expense[],
    filteredIncomes: Income[],
    startDate: Date,
    endDate: Date
  ) => {
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let intervals: { start: Date; end: Date; label: string }[] = [];

    if (totalDays <= 1) {
      // Today - show hourly intervals
      intervals = Array.from({ length: 12 }, (_, i) => {
        const hour = new Date(startDate);
        hour.setHours(i * 2);
        const nextHour = new Date(hour);
        nextHour.setHours(hour.getHours() + 2);
        return {
          start: hour,
          end: nextHour,
          label: format(hour, "HH:mm"),
        };
      });
    } else if (totalDays <= 7) {
      // Week - show daily intervals
      intervals = eachDayOfInterval({ start: startDate, end: endDate }).map(
        (day) => ({
          start: startOfDay(day),
          end: endOfDay(day),
          label: format(day, "EEE dd"),
        })
      );
    } else if (totalDays <= 31) {
      // Month - show weekly intervals
      intervals = eachWeekOfInterval({ start: startDate, end: endDate }).map(
        (week) => ({
          start: startOfWeek(week),
          end: endOfWeek(week),
          label: format(week, "MMM dd"),
        })
      );
    } else if (totalDays <= 365) {
      // Year - show monthly intervals
      intervals = eachMonthOfInterval({ start: startDate, end: endDate }).map(
        (month) => ({
          start: startOfMonth(month),
          end: endOfMonth(month),
          label: format(month, "MMM"),
        })
      );
    } else {
      // Multiple years - show yearly intervals
      intervals = eachYearOfInterval({ start: startDate, end: endDate }).map(
        (year) => ({
          start: startOfYear(year),
          end: endOfYear(year),
          label: format(year, "yyyy"),
        })
      );
    }

    // Limit to maximum 12 intervals
    if (intervals.length > 12) {
      const step = Math.ceil(intervals.length / 12);
      intervals = intervals
        .filter((_, index) => index % step === 0)
        .slice(0, 12);
    }

    // Aggregate data for each interval
    const aggregatedData = intervals.map((interval) => {
      const intervalExpenses = filteredExpenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= interval.start && expenseDate <= interval.end;
      });

      const intervalIncomes = filteredIncomes.filter((income) => {
        const incomeDate = new Date(income.date);
        return incomeDate >= interval.start && incomeDate <= interval.end;
      });

      return {
        label: interval.label,
        expenses: intervalExpenses.reduce((sum, e) => sum + e.amount, 0),
        incomes: intervalIncomes.reduce((sum, i) => sum + i.amount, 0),
      };
    });

    return aggregatedData;
  };

  // Filter data based on selected time period
  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (selectedPeriod) {
      case "today":
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case "week":
        startDate = startOfWeek(now);
        endDate = endOfWeek(now);
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case "lastMonth":
        startDate = startOfMonth(subMonths(now, 1));
        endDate = endOfMonth(subMonths(now, 1));
        break;
      case "year":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case "6months":
        startDate = subMonths(now, 6);
        endDate = now;
        break;
      case "5years":
        startDate = subYears(now, 5);
        endDate = now;
        break;
      case "10years":
        startDate = subYears(now, 10);
        endDate = now;
        break;
      default:
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    }

    // Use all historical data instead of filtering by time period
    const filteredExpenses = expenses;
    const filteredIncomes = incomes;

    return { filteredExpenses, filteredIncomes, startDate, endDate };
  };

  const { filteredExpenses, filteredIncomes, startDate, endDate } =
    getFilteredData();
  const { height, barThickness, maxRotation } = getChartDimensions();
  const aggregatedData = aggregateData(
    filteredExpenses,
    filteredIncomes,
    startDate,
    endDate
  );

  // Create aggregated chart data
  const chartData = {
    labels: aggregatedData.map((item) => item.label),
    datasets: [
      {
        label: t("profile.expense"),
        data: aggregatedData.map((item) => item.expenses),
        backgroundColor: "rgba(239, 68, 68, 0.8)", // Red with higher opacity
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: barThickness,
        order: 2, // Render expenses first (behind)
        stack: "stack1", // Stack them together
      },
      {
        label: t("profile.income"),
        data: aggregatedData.map((item) => item.incomes),
        backgroundColor: "rgba(34, 197, 94, 0.8)", // Green with higher opacity
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: barThickness,
        order: 1, // Render income second (on top)
        stack: "stack1", // Stack them together
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return datasets.map((dataset: any, index: number) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              lineWidth: 2,
              pointStyle: "circle",
              hidden: chart.getDatasetMeta(index).hidden,
              index: index,
            }));
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick: (e: any, legendItem: any, legend: any) => {
          // Default Chart.js legend click behavior
          const index = legendItem.index;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(index);
          meta.hidden = !meta.hidden;
          chart.update();
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => `${ctx.dataset.label}: $${ctx.parsed.y}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          afterBody: (tooltipItems: any) => {
            const dataIndex = tooltipItems[0].dataIndex;
            const item = aggregatedData[dataIndex];
            if (item.expenses > 0 && item.incomes > 0) {
              return [`Net: $${item.incomes - item.expenses}`];
            }
            return [];
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: selectedPeriod === "today" ? 14 : 12 },
          maxRotation: maxRotation,
        },
        stacked: true, // Enable stacking on x-axis
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: {
          font: { size: 12 },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (value: any) => `$${value}`,
        },
        stacked: true, // Enable stacking on y-axis
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("stats.financialOverview")}
        </h3>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {getTimePeriods(t).map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={height}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
