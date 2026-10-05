import * as React from "react"
import { ResponsiveContainer } from "recharts"

export function ChartContainer({ config = {}, className = "", children, ...props }) {
    // Génère les variables CSS pour les couleurs de chart (--color-solde, etc.)
    const style = React.useMemo(() => {
        const vars = {}
        Object.entries(config).forEach(([key, item]) => {
            if (item.color) {
                vars[`--color-${key}`] = item.color
            }
        })
        return vars
    }, [config])

    return (
        <div className={className} style={style} {...props}>
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </div>
    )
}

export function ChartTooltip({ active, payload, label, content, ...props }) {
    if (!active || !payload || !payload.length) return null

    if (React.isValidElement(content)) {
        return React.cloneElement(content, { active, payload, label, ...props })
    }

    return (
        <ChartTooltipContent active={active} payload={payload} label={label} {...props} />
    )
}

export function ChartTooltipContent({ active, payload, label, labelFormatter, indicator = "dot" }) {
    if (!active || !payload || !payload.length) return null

    const formattedLabel = labelFormatter ? labelFormatter(label) : label

    return (
        <div className="rounded-xl border border-white/10 bg-card p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5">
            {formattedLabel && (
                <div className="font-medium text-muted-foreground border-b border-white/10 pb-1">
                    {formattedLabel}
                </div>
            )}
            <div className="space-y-1">
                {payload.map((item, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            {indicator === "line" ? (
                                <div
                                    className="h-3 w-1 rounded-full"
                                    style={{ backgroundColor: item.color || item.fill }}
                                />
                            ) : (
                                <div
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: item.color || item.fill }}
                                />
                            )}
                            <span>{item.name || item.dataKey}</span>
                        </div>
                        <span className="font-semibold text-foreground tabular-nums">
              {typeof item.value === "number" ? `${item.value.toFixed(2)} €` : item.value}
            </span>
                    </div>
                ))}
            </div>
        </div>
    )
}