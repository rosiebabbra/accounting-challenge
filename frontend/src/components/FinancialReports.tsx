import { useState } from "react"
import ProfitAndLoss from "./ProfitAndLoss"
import BalanceSheet from "./BalanceSheet"
import React from "react"

export default function FinancialReports() {
    const [view, setView] = useState<"balance" | "pnl">("balance")

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 justify-center">
                <button
                    onClick={() => setView("balance")}
                    className={`px-4 py-2 rounded font-medium shadow ${view === "balance" ? "bg-[#195058] text-white" : "bg-[#f9f9f9] text-gray-700"
                        }`}
                >
                    Balance Sheet
                </button>
                <button
                    onClick={() => setView("pnl")}
                    className={`px-4 py-2 rounded font-medium shadow ${view === "pnl" ? "bg-[#195058] text-white" : "bg-[#f9f9f9] text-gray-700"
                        }`}
                >
                    Profit & Loss
                </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                {view === "pnl" ? <ProfitAndLoss /> : <BalanceSheet />}
            </div>
        </div>
    )
}
