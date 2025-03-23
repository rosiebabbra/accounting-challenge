import React, { useEffect, useState } from "react"

interface RevenueBreakdown {
    product_sales: number
    grants: number
    total: number
}

interface ExpenseBreakdown {
    payroll: number
    maintenance: number
    taxes: number
    external_services: number
    total: number
}

interface PnLData {
    revenue: RevenueBreakdown
    expenses: ExpenseBreakdown
    profit: number
}

export default function ProfitAndLoss() {
    const [data, setData] = useState<PnLData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    "/api/companies/1/reports/pnl?start=2017-01-01&end=2017-12-31"
                )
                if (!res.ok) throw new Error("Failed to fetch P&L report")
                const json = await res.json()
                setData(json)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) return <p>Loading profit and loss report...</p>
    if (error) return <p>Error: {error}</p>
    if (!data) return <p>No data available.</p>

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-[36px] font-bold mb-6 text-center">Profit and Loss</h1>

            <div className="bg-white rounded-lg p-4 shadow">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            <th className="text-left pb-2 text-gray-600">Category</th>
                            <th className="text-right pb-2 text-gray-600">Amount (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-left font-bold pt-4">Revenue</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-left pl-2 py-1">Product Sales</td>
                            <td className="text-right">{data.revenue.product_sales.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left pl-2 py-1">Grants</td>
                            <td className="text-right">{data.revenue.grants.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t font-bold">
                            <td className="text-left py-1">Total Revenue</td>
                            <td className="text-right">{data.revenue.total.toLocaleString()}</td>
                        </tr>

                        <tr>
                            <td className="font-semibold pt-6">Expenses</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td className="text-left py-1">Payroll</td>
                            <td className="text-right">{data.expenses.payroll.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left  py-1">Maintenance</td>
                            <td className="text-right">{data.expenses.maintenance.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left  py-1">Taxes</td>
                            <td className="text-right">{data.expenses.taxes.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="text-left py-1">External Services</td>
                            <td className="text-right">{data.expenses.external_services.toLocaleString()}</td>
                        </tr>
                        <tr className="border-t font-bold">
                            <td className="text-left py-1">Total Expenses</td>
                            <td className="text-right">{data.expenses.total.toLocaleString()}</td>
                        </tr>

                        <tr className="border-t-2 font-bold text-lg">
                            <td className="text-left pt-4">Net Profit</td>
                            <td className="text-right pt-4">
                                {data.profit >= 0 ? (
                                    <span className="text-green-600">€{data.profit.toLocaleString()}</span>
                                ) : (
                                    <span className="text-red-600">-€{Math.abs(data.profit).toLocaleString()}</span>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}