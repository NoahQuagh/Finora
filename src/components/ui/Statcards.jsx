import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, PiggyBank, TriangleAlert, Wallet } from "lucide-react"
import { Badge } from "./badge"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { AnimatedMoney } from "../motion/Animatedmoney.jsx"
import { formatEUR } from "../lib/Format"

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function StatCards({ data }) {
  const depensable = data?.depensable || { nom: 'Courant', solde: 0, prevu: 0 }
  const totalCmp = data?.totalCmp || { totalComptes: 0, ecart: 0, nb_compte: 0 }
  const epargnes = data?.epargne || []

  const totalEpargne = epargnes.reduce((acc, i) => acc + (i.solde || 0), 0)

  return (
      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {/* 1. Compte courant */}
        <motion.div variants={item} className="md:col-span-2">
          <Card className="h-full border-white/10 bg-gradient-to-br from-zinc-800/60 via-card to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="size-4" />{depensable.nom}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedMoney value={depensable.solde} className="block text-5xl font-bold tracking-tight tabular-nums sm:text-6xl" />
              <p className="mt-3 text-sm text-muted-foreground">
                {Math.abs(depensable.prevu - depensable.solde) > 0.004 ? (
                    <>Après prélèvements à venir : <strong className="text-foreground">{formatEUR(depensable.prevu)}</strong></>
                ) : (
                    <>Aucun prélèvement en attente</>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. Total des comptes */}
        <motion.div variants={item}>
          <Card className="h-full border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="size-4" /> Total des comptes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedMoney value={totalCmp.totalComptes} className="block text-3xl font-semibold tabular-nums" />
              <p className="mt-2 text-xs text-muted-foreground">{totalCmp.nb_compte} compte{totalCmp.nb_compte > 1 ? 's' : ''} au total</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. Épargne & Placements (Taille fixe propre) */}
        <motion.div variants={item}>
          <Card className="h-full border-white/10 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <PiggyBank className="size-4" /> Épargne & Investissement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatedMoney value={totalEpargne} className="block text-3xl font-semibold tabular-nums" />
              <div>
                {Math.abs(totalCmp.ecart) < 0.01 ? (
                    <Badge variant="outline" className="gap-1 text-emerald-400">
                      <CheckCircle2 className="size-3" /> Comptes et budgets concordent
                    </Badge>
                ) : (
                    <Badge variant="outline" className="gap-1 text-amber-400">
                      <TriangleAlert className="size-3" /> Écart de {formatEUR(totalCmp.ecart)}
                    </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
  )
}