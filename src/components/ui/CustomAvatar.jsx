import React, {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthContext.jsx";

const AVATAR_GRADIENTS = {
    blue: "bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500",
    purple: "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
    red: "bg-gradient-to-tr from-amber-500 via-rose-500 to-red-500",
    green: "bg-gradient-to-tr from-emerald-400 via-green-500 to-teal-600",
    orange: "bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500",
    gray: "bg-gradient-to-tr from-neutral-600 via-neutral-700 to-neutral-800",
};

const SIZES = {
    sm: "size-9 text-xs",
    md: "size-9 text-xs",
    lg: "size-20 text-sm",
};

export function CustomAvatar({
                                 size = "md",
                                 variant = "blue",
                                 className,
                                 src,
                                 name
                             }) {

    const getInitials = (str) => {
        if (!str) return "IU";
        const parts = str.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return str.slice(0, 2).toUpperCase();
    };



    const sizeClass = SIZES[size] || SIZES.md;
    const gradientClass = AVATAR_GRADIENTS[variant] || AVATAR_GRADIENTS.blue;

    return (
        <div
            className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 font-semibold select-none ${sizeClass} ${gradientClass} ${className}`}
        >
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className="size-full object-cover rounded-full"
                />
            ) : null}

            <span className={variant === "blue" ? "text-black font-bold" : "text-white font-medium drop-shadow-sm"}>
            </span>
        </div>
    );
}