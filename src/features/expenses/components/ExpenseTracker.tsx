"use client"

import { useState } from "react"
import { ExpenseHeader } from "./expense/ExpenseHeader"
import { ExpenseSummaryCards } from "./expense/ExpenseSummaryCards"
import { ExpenseCategoryBreakdown } from "./expense/ExpenseCategoryBreakdown"
import { ExpenseRecentList } from "./expense/ExpenseRecentList"
import { expenses, categories, getCategoryColor } from "./expense/expenseData"

const ExpenseTracker = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const thisMonthExpenses = expenses
    .filter((expense) => new Date(expense.date).getMonth() === new Date().getMonth())
    .reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-6">
      <ExpenseHeader />

      <ExpenseSummaryCards thisMonthExpenses={thisMonthExpenses} totalExpenses={totalExpenses} />

      <ExpenseCategoryBreakdown categories={categories} />

      <ExpenseRecentList expenses={expenses} getCategoryColor={getCategoryColor} />
    </div>
  )
}

export default ExpenseTracker
