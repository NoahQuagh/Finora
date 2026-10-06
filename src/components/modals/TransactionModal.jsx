import React, { useState, useEffect } from "react"
import { Modal } from "./Modal.jsx"
import { Button } from "../ui/button"

export function TransactionModal({
                                     isOpen,
                                     onClose,
                                     comptes = [],
                                     budgets = [],
                                     onRefresh
                                 }) {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        libelle: "",
        montant: "",
        type: "DEPENSE",
        date: new Date().toISOString().split("T")[0],
        com_id: comptes[0]?.id || "",
        bud_id: budgets[0]?.id || "",
        cat_id: "",
        est_a_prelever: false,
        note: ""
    })

    // Synchroniser la sélection par défaut dès que les comptes/budgets sont chargés
    useEffect(() => {
        if (comptes.length > 0 && !formData.com_id) {
            setFormData((prev) => ({ ...prev, com_id: comptes[0].id }))
        }
        if (budgets.length > 0 && !formData.bud_id) {
            setFormData((prev) => ({ ...prev, bud_id: budgets[0].id }))
        }
    }, [comptes, budgets])

    // Charger les catégories (aligné avec 'data' renvoyé par ton PHP)
    useEffect(() => {
        if (isOpen) {
            fetch("/api/categories/getCategories.php", { credentials: "include" })
                .then((r) => r.json())
                .then((res) => {
                    if (res.success && Array.isArray(res.data)) {
                        setCategories(res.data)
                    }
                })
                .catch(() => {})
        }
    }, [isOpen])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/transactions/addTransaction.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData)
            })

            const resData = await res.json()
            if (resData.success) {
                if (onRefresh) onRefresh()
                onClose()
                setFormData({
                    libelle: "",
                    montant: "",
                    type: "DEPENSE",
                    date: new Date().toISOString().split("T")[0],
                    com_id: comptes[0]?.id || "",
                    bud_id: budgets[0]?.id || "",
                    cat_id: "",
                    est_a_prelever: false,
                    note: ""
                })
            } else {
                alert(resData.message || "Erreur lors de l'enregistrement")
            }
        } catch (err) {
            console.error("Erreur transaction :", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            header={<h2 className="text-lg font-semibold text-white">Nouvelle transaction</h2>}
        >
            <form onSubmit={handleSubmit} className="space-y-4 p-2 text-sm text-zinc-200">

                {/* Toggle Type : Dépense / Revenu */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, type: "DEPENSE" }))}
                        className={`py-2 rounded-lg font-medium transition-colors ${
                            formData.type === "DEPENSE" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Dépense
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, type: "REVENUE" }))}
                        className={`py-2 rounded-lg font-medium transition-colors ${
                            formData.type === "REVENUE" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Revenu
                    </button>
                </div>

                {/* Libellé & Montant */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs text-zinc-400">Libellé *</label>
                        <input
                            type="text"
                            name="libelle"
                            required
                            placeholder="ex: Courses Super U"
                            value={formData.libelle}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Montant (€) *</label>
                        <input
                            type="number"
                            step="0.01"
                            name="montant"
                            required
                            placeholder="0.00"
                            value={formData.montant}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>
                </div>

                {/* Compte & Budget */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Compte *</label>
                        <select
                            name="com_id"
                            value={formData.com_id}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-[#1a1b1e] border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
                        >
                            {(comptes || []).map((c) => (
                                <option key={c.id} value={c.id}>{c.nom}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Budget *</label>
                        <select
                            name="bud_id"
                            value={formData.bud_id}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-[#1a1b1e] border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
                        >
                            {(budgets || []).map((b) => (
                                <option key={b.id} value={b.id}>{b.nom}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Catégorie & Date */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Catégorie</label>
                        <select
                            name="cat_id"
                            value={formData.cat_id}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-[#1a1b1e] border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
                        >
                            <option value="">Sans catégorie</option>
                            {(categories || []).map((cat) => (
                                <option key={cat.CAT_ID} value={cat.CAT_ID}>{cat.CAT_NOM}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-400">Date *</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30"
                        />
                    </div>
                </div>

                {/* Prélèvement en attente */}
                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="est_a_prelever"
                        name="est_a_prelever"
                        checked={formData.est_a_prelever}
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 accent-emerald-500"
                    />
                    <label htmlFor="est_a_prelever" className="text-xs text-zinc-300 cursor-pointer">
                        Marquer comme prélèvement en attente (à venir)
                    </label>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button type="submit" loading={loading} className="bg-white text-black hover:bg-zinc-200">
                        Ajouter la transaction
                    </Button>
                </div>
            </form>
        </Modal>
    )
}