import React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"
import { formatMonthLong, formatMonthShort } from "./../lib/Format"

const config = { solde: { label: "Argent libre (€)", color: "var(--chart-1)" } }

export function BalanceChart({ evolution }) {
    return (
        <Card className="border-white/10">
            <CardHeader>
                <CardTitle>Évolution de l'argent dépensable</CardTitle>
                <CardDescription>Solde à la fin de chaque mois</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={config} className="h-[260px] w-full">
                    <AreaChart data={evolution} margin={{ left: 8, right: 8, top: 8 }}>
                        <defs>
                            <linearGradient id="fillSolde" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-solde)" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="var(--color-solde)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeOpacity={0.4} />
                        <XAxis dataKey="mois" tickLine={false} axisLine={false} tickMargin={8} minTickGap={24} tickFormatter={formatMonthShort} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelFormatter={formatMonthLong} />} />
                        <Area dataKey="solde" type="monotone" stroke="var(--color-solde)" strokeWidth={2} fill="url(#fillSolde)" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}