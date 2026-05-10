import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { ArrowDownUp } from 'lucide-react';

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('JPY');

  const exchangeRate = 149.5;
  const convertedAmount = (parseFloat(amount || '0') * exchangeRate).toFixed(2);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW', 'AUD', 'CAD'];

  return (
    <GlassCard className="p-6">
      <h3 className="font-bold mb-4">Currency Converter</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2">From</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-primary/20 p-2 rounded-full">
            <ArrowDownUp className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">To</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={convertedAmount}
              readOnly
              className="flex-1 bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-input-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border text-sm text-muted-foreground text-center">
          1 {fromCurrency} = {exchangeRate} {toCurrency}
        </div>
      </div>
    </GlassCard>
  );
}
