import React from "react"
import { Badge } from "../common/badge.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "../common/card.jsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { formatDateShort, formatSigned } from "../lib/Format"

export function RecentTransactions({title, transactions }) {
    return (
        <Card className="border-white/10">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Libellé</TableHead>
                            <TableHead className="hidden md:table-cell">Budget</TableHead>
                            <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell className="text-muted-foreground">{formatDateShort(t.date)}</TableCell>
                                <TableCell className="font-medium">{t.libelle}</TableCell>
                                <TableCell className="hidden md:table-cell text-muted-foreground">{t.budget}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {t.categorie && <Badge variant="secondary" className="gap-1.5 inline-flex items-center">
                                        {t.icon && <i className={`${t.icon} text-xs`} />}
                                        <span>{t.categorie}</span>
                                    </Badge>}
                                </TableCell>
                                <TableCell className={"text-right font-medium tabular-nums " + (t.montant < 0 ? "text-red-400" : "text-emerald-400")}>
                                    {formatSigned(t.montant)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}