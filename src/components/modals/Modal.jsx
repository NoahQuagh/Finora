import React from "react";
import {
    CenterMorphModal,
    CenterMorphModalContent,
} from "../motion/center-morph-modal";

export function Modal({
                          isOpen,
                          onClose,
                          header,
                          children,
                          footer,
                          size = "md",
                          isNewProject = false
                      }) {
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-2xl",
        sevenxl: "max-w-7xl",
        full: "max-w-full"
    };

    const widthClass = sizeClasses[size] || size;

    return (
        <CenterMorphModal
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <CenterMorphModalContent
                ariaLabel="Modale"
                className={`w-full ${widthClass} modal-box bg-[#1a1b1e] `}
                showCloseButton={false}
            >
                <div className={isNewProject ? "modalNewProject" : ""}>
                    {header && (
                        <div className="modal-header">
                            {header}
                            <button
                                className="modal-close-btn"
                                onClick={onClose}
                                type="button"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                    )}

                    <div className="modal-body">
                        {children}
                    </div>

                    {footer && (
                        <div className="modal-footer">
                            {footer}
                        </div>
                    )}
                </div>
            </CenterMorphModalContent>
        </CenterMorphModal>
    );
}