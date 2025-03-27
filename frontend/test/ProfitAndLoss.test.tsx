import { render, screen } from "@testing-library/react"
import ProfitAndLoss from "../src/components/ProfitAndLoss"
import { beforeEach, test, vi, expect } from "vitest"
import React from "react"

beforeEach(() => {
    globalThis.fetch = vi.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                revenue: {
                    product_sales: 1000,
                    grants: 0,
                    total: 1000,
                },
                expenses: {
                    payroll: 0,
                    maintenance: 0,
                    taxes: 0,
                    external_services: 0,
                    total: 0,
                },
                profit: 1000,
            }),
        })
    ) as any
})

test("renders Total Revenue", async () => {
    render(<ProfitAndLoss />)

    const totalRevenue = await screen.findByText("Total Revenue")
    expect(totalRevenue).toBeInTheDocument()
})
