import React from 'react'

export default function TransactionHistory({ transactions }) {
  return (
    <div className="transactions card">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Symbol</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Fee</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.date).toLocaleString()}</td>
                <td>{t.type}</td>
                <td>{t.symbol}</td>
                <td>{t.qty}</td>
                <td>${t.price.toFixed(2)}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td>${(t.fee || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
