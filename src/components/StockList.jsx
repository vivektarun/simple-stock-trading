import React from 'react'

export default function StockList({ stocks, onBuyClick, onSellClick }) {
  return (
    <div className="stock-list card">
      <h2>Available Stocks</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s) => (
            <tr key={s.symbol}>
              <td>{s.symbol}</td>
              <td>{s.name}</td>
              <td>${s.price.toFixed(2)}</td>
              <td>{s.available}</td>
              <td>
                <button onClick={() => onBuyClick(s)}>Buy</button>
                <button onClick={() => onSellClick(s)}>Sell</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
