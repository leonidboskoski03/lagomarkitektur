import { forwardRef } from "react";

export const LoaderRevealUnderlay = forwardRef<
    HTMLDivElement,
    object
>(function LoaderRevealUnderlay(_, forwardedRef) {
    return (
        <div className="relative h-full overflow-clip">
            <div
                ref={forwardedRef}
                className="absolute inset-0 z-[5] h-full w-full overflow-hidden bg-white"
            />
        </div>
    );
});
