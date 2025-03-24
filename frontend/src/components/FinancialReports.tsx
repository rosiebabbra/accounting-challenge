import { useEffect, useState } from "react"
import ProfitAndLoss from "./ProfitAndLoss"
import BalanceSheet from "./BalanceSheet"
import React from "react"
import { MdDarkMode, MdLightMode } from "react-icons/md"

export default function FinancialReports() {
    const [view, setView] = useState<"balance" | "pnl">("balance")
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem("theme")
        if (stored) return stored === "dark"
        console.log(stored)
        return window.matchMedia("(prefers-color-scheme: dark)").matches
    })

    useEffect(() => {
        const root = document.documentElement
        if (darkMode) {
            root.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            root.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }, [darkMode])

    return (
        <div className="p-4 mx-auto max-w-6xl transition-colors duration-300 rounded-[29px] shadow-lg dark:bg-gray-800">
            <div className="flex justify-between items-center mt-4 mb-2">
                <div className="flex gap-4">
                    <button
                        onClick={() => setView("balance")}
                        className={`px-4 py-2 rounded font-medium shadow transition-all ${view === "balance"
                            ? "bg-[#f9f9f9] text-gray-700 dark:bg-gray-900 dark:text-gray-900"
                            : "bg-gray-700 text-white"
                            }`}
                    >
                        Balance Sheet
                    </button>
                    <button
                        onClick={() => setView("pnl")}
                        className={`px-4 py-2 rounded font-medium shadow transition-all ${view === "pnl"
                            ? "bg-[#f9f9f9] text-gray-700 dark:bg-gray-900 dark:text-gray-900"
                            : "bg-gray-700 text-white"
                            }`}
                    >
                        Profit & Loss
                    </button>
                </div>


                <div className="text-right">
                    <button
                        onClick={() => setDarkMode(prev => !prev)}
                        className="text-lg bg-gray-100 dark:bg-[#1e293b] text-[#195058] dark:text-white px-3 py-2 rounded shadow hover:opacity-90 transition-all"
                        title="Toggle theme"
                    >
                        {darkMode ? <div><MdLightMode color='#cf9906' />
                        </div> :
                            <div><MdDarkMode /> </div>}
                    </button>
                    {darkMode ? (
                        <div className="max-[639px]:hidden lg:block text-[12px] mt-1 mr-1 text-gray-100">Dark Mode</div>
                    ) : (
                        <div className="max-[639px]:hidden lg:block text-[12px] mt-1 mr-1 text-gray-800">Light Mode</div>
                    )}

                </div>
            </div>

            <div className="bg-gray-100 dark:bg-[#1e293b] dark:text-white transition-colors duration-100">
                {view === "pnl" ? <ProfitAndLoss /> : <BalanceSheet />}
            </div>
        </div>
    )
}
