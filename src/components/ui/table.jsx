import * as React from "react"

export const Table = React.forwardRef(({ className = "", ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table ref={ref} className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
))
Table.displayName = "Table"

export const TableHeader = React.forwardRef(({ className = "", ...props }, ref) => (
    <thead ref={ref} className={`[&_tr]:border-b [&_tr]:border-white/10 ${className}`} {...props} />
))
TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef(({ className = "", ...props }, ref) => (
    <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
))
TableBody.displayName = "TableBody"

export const TableRow = React.forwardRef(({ className = "", ...props }, ref) => (
    <tr ref={ref} className={`border-b border-white/10 transition-colors hover:bg-white/5 ${className}`} {...props} />
))
TableRow.displayName = "TableRow"

export const TableHead = React.forwardRef(({ className = "", ...props }, ref) => (
    <th ref={ref} className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground ${className}`} {...props} />
))
TableHead.displayName = "TableHead"

export const TableCell = React.forwardRef(({ className = "", ...props }, ref) => (
    <td ref={ref} className={`p-2 align-middle ${className}`} {...props} />
))
TableCell.displayName = "TableCell"