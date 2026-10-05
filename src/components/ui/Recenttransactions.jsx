import React from "react"
import { Badge } from "./badge"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { formatDateShort, formatSigned } from "../lib/Format"

export function RecentTransactions({ transactions }) {
    return (
        <Card className="border-white/10">
            <CardHeader>
                <CardTitle>Dernières transactions</CardTitle>
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
                                    {t.categorie && <Badge variant="secondary">{t.categorie}</Badge>}
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