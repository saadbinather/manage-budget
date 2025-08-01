"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit3,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

type UserProfile = {
  name: string;
  age: number;
  email: string;
};

type Transaction = {
  type: "income" | "expense";
  amount: number;
  date: string;
};

const staticProfile: UserProfile = {
  name: "Saad Bin Ather",
  age: 18,
  email: "saadbinather@gmail.com",
};

// Dummy transactions for demonstration
const dummyTransactions: Transaction[] = [
  { type: "income", amount: 2000, date: "2024-06-01" },
  { type: "income", amount: 1500, date: "2024-06-10" },
  { type: "expense", amount: 500, date: "2024-06-12" },
  { type: "expense", amount: 300, date: "2024-06-15" },
  { type: "income", amount: 1000, date: "2024-06-20" },
  { type: "expense", amount: 200, date: "2024-06-22" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(staticProfile);
  const [editing, setEditing] = useState(false);

  // Calculate totals
  const totalIn = dummyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = dummyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Dummy edit handler
  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => {
      setEditing(false);
      alert("Edit profile feature coming soon!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white pt-28 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light text-slate-800 mb-3 tracking-tight">
            User Profile
          </h1>
          <p className="text-slate-600 text-lg font-light">
            Manage your account and view your financial overview
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {profile.name}
                </h2>
                <p className="text-slate-500">Budget Tracker User</p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
              onClick={handleEdit}
              disabled={editing}
            >
              <Edit3 className="w-4 h-4" />
              {editing ? "Editing..." : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Name</p>
                <p className="text-slate-900 font-semibold">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Age</p>
                <p className="text-slate-900 font-semibold">
                  {profile.age} years
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email</p>
                <p className="text-slate-900 font-semibold">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Total Income
              </h3>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-slate-700" />
              <p className="text-3xl font-light text-green-600">
                ${totalIn.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {dummyTransactions.filter((t) => t.type === "income").length}{" "}
              transactions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Total Expenses
              </h3>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingDown className="w-8 h-8 text-slate-700" />
              <p className="text-3xl font-light text-red-600">
                ${totalOut.toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {dummyTransactions.filter((t) => t.type === "expense").length}{" "}
              transactions
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Net Balance
              </h3>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-slate-700" />
              <p
                className={`text-3xl font-light ${
                  totalIn - totalOut >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${(totalIn - totalOut).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              {totalIn - totalOut >= 0
                ? "Positive balance"
                : "Negative balance"}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-1">
                Recent Transactions
              </h3>
              <p className="text-slate-500 text-sm">
                Your latest financial activities
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-500 font-medium">
                {dummyTransactions.length} total
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {dummyTransactions.slice(0, 5).map((transaction, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-5 hover:shadow-xl hover:border-slate-300 hover:bg-gradient-to-r hover:from-white hover:to-slate-50 transition-all duration-300 ease-out transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          transaction.type === "income"
                            ? "bg-green-50 border border-green-200 group-hover:bg-green-100 group-hover:border-green-300"
                            : "bg-red-50 border border-red-200 group-hover:bg-red-100 group-hover:border-red-300"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            transaction.type === "income"
                              ? "bg-green-500 group-hover:bg-green-600"
                              : "bg-red-500 group-hover:bg-red-600"
                          }`}
                        ></div>
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xs text-white font-bold">
                            N
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-semibold text-slate-900 transition-colors duration-300 ${
                            transaction.type === "income"
                              ? "text-green-700 group-hover:text-green-800"
                              : "text-red-700 group-hover:text-red-800"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-slate-500 font-medium group-hover:text-slate-600 transition-colors duration-300">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <span className="text-slate-300">•</span>
                        <p className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors duration-300">
                          {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-bold transition-all duration-300 ${
                        transaction.type === "income"
                          ? "text-green-600 group-hover:text-green-700"
                          : "text-red-600 group-hover:text-red-700"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 font-medium group-hover:text-slate-500 transition-colors duration-300">
                      {transaction.type === "income" ? "Income" : "Expense"}
                    </p>
                  </div>
                </div>

                {/* Enhanced hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            ))}
          </div>

          {dummyTransactions.length > 5 && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <a
                href="/history"
                className="block w-full py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200 text-center hover:bg-slate-50 rounded-lg"
              >
                View all transactions →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
