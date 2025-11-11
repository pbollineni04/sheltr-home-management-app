import { useState, useEffect } from 'react';

const BUDGET_KEY = 'sheltr_monthly_budget';
const DEFAULT_BUDGET = 800;

export const useBudget = () => {
  const [budget, setBudget] = useState<number>(() => {
    const stored = localStorage.getItem(BUDGET_KEY);
    return stored ? parseFloat(stored) : DEFAULT_BUDGET;
  });

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, budget.toString());

    // Dispatch custom event for cross-component sync
    window.dispatchEvent(new CustomEvent('budgetChanged', { detail: budget }));
  }, [budget]);

  useEffect(() => {
    // Listen for budget changes from other components
    const handleBudgetChange = (e: CustomEvent) => {
      setBudget(e.detail);
    };

    window.addEventListener('budgetChanged', handleBudgetChange as EventListener);
    return () => {
      window.removeEventListener('budgetChanged', handleBudgetChange as EventListener);
    };
  }, []);

  return { budget, setBudget };
};
