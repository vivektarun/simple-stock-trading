import React from 'react'

export default function Wallet({ balance, holdings }) {
  return (
    <div className="wallet card">
      <h2>Wallet</h2>
      <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
      <h3>Holdings</h3>
      {Object.keys(holdings).length === 0 ? (
        <p>No holdings</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(holdings).map(([symbol, qty]) => (
              <tr key={symbol}>
                <td>{symbol}</td>
                <td>{qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
