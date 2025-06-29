"use client"

import { DataTable } from "@/components/shared/data-table"
import { useState } from "react"

interface Transaction {
  id: string
  doctorName: string
  testName: string
  date: string
  amount: number
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [transactionsList, setTransactionsList] = useState(transactions)

  // Transform data for custom layout (not using DataTable for this one due to unique layout)
  return (
    <div className="bg-white rounded-[20px] shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-sf-pro font-semibold text-black">
          Transaction History
        </h3>
        <button className="text-[#7165e1] text-sm font-sf-pro font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {transactionsList.map((transaction) => (
          <div key={transaction.id} className="flex justify-between items-start">
            <div className="flex-1">
              <p className="font-sf-pro font-semibold text-black text-sm">
                {transaction.doctorName}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {transaction.testName}
              </p>
              <p className="text-xs text-gray-500">
                {transaction.date}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sf-pro font-bold text-black">
                ₹ {transaction.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}