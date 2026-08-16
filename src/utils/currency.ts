import { ExpenseItem } from '../types';

export type CurrencyMode = 'AUD' | 'EUR';

export const EUR_TO_AUD_RATE = 1.64;
export const AUD_TO_EUR_RATE = 1 / EUR_TO_AUD_RATE;

/**
 * Returns the numeric value of an expense in the specified currency.
 */
export function getExpenseAmountInCurrency(expense: ExpenseItem, targetCurrency: CurrencyMode): number {
  if (targetCurrency === 'AUD') {
    if (expense.amountAud !== undefined && expense.amountAud > 0) {
      return expense.amountAud;
    }
    if (expense.currency === 'AUD') {
      return expense.amount;
    }
    return expense.amount * EUR_TO_AUD_RATE;
  } else {
    // targetCurrency === 'EUR'
    if (expense.currency === 'EUR') {
      return expense.amount;
    }
    if (expense.amountAud !== undefined && expense.amountAud > 0) {
      return expense.amountAud * AUD_TO_EUR_RATE;
    }
    return expense.amount * AUD_TO_EUR_RATE;
  }
}

/**
 * Format an amount with currency symbol and code
 */
export function formatCurrencyAmount(amount: number, targetCurrency: CurrencyMode, decimals = 0): string {
  const formatted = amount.toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
  if (targetCurrency === 'AUD') {
    return `$${formatted} AUD`;
  }
  return `€${formatted}`;
}

/**
 * Format a compact amount with just the symbol
 */
export function formatShortCurrency(amount: number, targetCurrency: CurrencyMode, decimals = 0): string {
  const formatted = amount.toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
  if (targetCurrency === 'AUD') {
    return `$${formatted}`;
  }
  return `€${formatted}`;
}
