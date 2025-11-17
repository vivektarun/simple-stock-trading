import React, { useEffect, useState } from 'react'
import './App.css'
import initialStocks from './data/stocks'
import StockList from './components/StockList'
import Wallet from './components/Wallet'
import TransactionHistory from './components/TransactionHistory'
import TradeModal from './components/Trade'

const STORAGE_KEY = 'stock_app_v2'
const DEFAULT_WALLET = 1000

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    // ignore
  }
}

function App() {
  const persisted = loadState()

  const [stocks, setStocks] = useState(persisted?.stocks ?? initialStocks)
  const [balance, setBalance] = useState(persisted?.balance ?? DEFAULT_WALLET)
  const [holdings, setHoldings] = useState(persisted?.holdings ?? {})
  const [transactions, setTransactions] = useState(persisted?.transactions ?? [])

  const [modal, setModal] = useState({ visible: false, type: null, stock: null })

  useEffect(() => {
    saveState({ stocks, balance, holdings, transactions })
  }, [stocks, balance, holdings, transactions])

  const openModal = (type, stock) => {
    setModal({ visible: true, type, stock })
  }

  const closeModal = () => setModal({ visible: false, type: null, stock: null })

  const addTransaction = (t) => {
    setTransactions((prev) => [{ id: Date.now(), date: Date.now(), ...t }, ...prev])
  }

  const handleBuy = (stock, qty) => {
    const qtyNum = Number(qty)
    if (!qtyNum || qtyNum <= 0) return alert('Invalid quantity')
    if (qtyNum > stock.available) return alert('Not enough stock available')
    const total = stock.price * qtyNum
    if (total > balance) return alert('Insufficient funds')

    // update available
    setStocks((prev) => prev.map((s) => s.symbol === stock.symbol ? { ...s, available: s.available - qtyNum } : s))
    // update holdings
    setHoldings((prev) => ({ ...prev, [stock.symbol]: (prev[stock.symbol] || 0) + qtyNum }))
    // update balance
    setBalance((b) => b - total)
    // record transaction
    addTransaction({ symbol: stock.symbol, qty: qtyNum, type: 'buy', price: stock.price, amount: total, fee: 0 })
    closeModal()
  }

  const handleSell = (stock, qty) => {
    const qtyNum = Number(qty)
    if (!qtyNum || qtyNum <= 0) return alert('Invalid quantity')
    if ((holdings[stock.symbol] || 0) < qtyNum) return alert('You do not own that many shares')

    const total = stock.price * qtyNum
    const fee = total * 0.01 // 1% brokerage
    const net = total - fee

    // update available
    setStocks((prev) => prev.map((s) => s.symbol === stock.symbol ? { ...s, available: s.available + qtyNum } : s))
    // update holdings
    setHoldings((prev) => {
      const next = { ...prev }
      next[stock.symbol] = (next[stock.symbol] || 0) - qtyNum
      if (next[stock.symbol] <= 0) delete next[stock.symbol]
      return next
    })
    // update balance
    setBalance((b) => b + net)
    // record transaction
    addTransaction({ symbol: stock.symbol, qty: qtyNum, type: 'sell', price: stock.price, amount: total, fee })
    closeModal()
  }

  return (
    <div className="App">
      <header>
        <h1>Simple Stock Trading</h1>
        <p>Starting wallet: ${DEFAULT_WALLET}. Brokerage on sales: 1%.</p>
      </header>
      <main>
        <div className="left">
          <StockList
            stocks={stocks}
            onBuyClick={(s) => openModal('buy', s)}
            onSellClick={(s) => openModal('sell', s)}
          />
          <TransactionHistory transactions={transactions} />
        </div>
        <aside className="right">
          <Wallet balance={balance} holdings={holdings} />
        </aside>
      </main>

      <TradeModal className="trade-modal"
        visible={modal.visible}
        type={modal.type}
        stock={modal.stock}
        maxQty={modal.type === 'buy' ? (modal.stock?.available ?? 0) : (holdings[modal.stock?.symbol] ?? 0)}
        onClose={closeModal}
        onConfirm={(qty) => {
          if (modal.type === 'buy') handleBuy(modal.stock, qty)
          else if (modal.type === 'sell') handleSell(modal.stock, qty)
        }}
      />
    </div>
  )
}

export default App
