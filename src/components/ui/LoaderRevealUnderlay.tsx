import { forwardRef } from "react";

export const LoaderRevealUnderlay = forwardRef<
    HTMLDivElement,
    object
>(function LoaderRevealUnderlay(_, forwardedRef) {
    return (
        <div className="relative h-screen overflow-clip">
            <div
                ref={forwardedRef}
                className="absolute top-0 z-[5] h-screen w-screen overflow-hidden bg-white"
            />
        </div>
    );
});
