import React, { useState } from 'react'

export default function TradeModal({ visible, type, stock, maxQty, onClose, onConfirm }) {
  const [qty, setQty] = useState(1)

  if (!visible || !stock) return null

  const handleConfirm = () => {
    const n = Number(qty)
    if (!n || n <= 0) return
    onConfirm(n)
    setQty(1)
  }

  return (
    <div className="trade-overlay">
      <div className="modal">
        <h3>{type === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}</h3>
        <p>Price: ${stock.price.toFixed(2)}</p>
        <p>Available: {maxQty}</p>
        <label>
          Quantity:
          <input type="number" min="1" max={maxQty} value={qty} onChange={(e) => setQty(e.target.value)} />
        </label>
        <div className="trade-actions">
          <button onClick={handleConfirm}>{type === 'buy' ? 'Buy' : 'Sell'}</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
