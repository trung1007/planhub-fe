import { useRef, useState, useEffect, ReactNode, FC } from "react";

interface SmoothToggleProps {
    open: boolean;
    children: ReactNode;
}

const SmoothToggle: FC<SmoothToggleProps> = ({ open, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<string>("0px");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new ResizeObserver(() => { if (open && el) { setHeight(el.scrollHeight + "px"); } }); observer.observe(el);
        if (open) {
            // Mở: set px trước, sau đó auto
            setHeight(el.scrollHeight + "100px");
            const timer = setTimeout(() => setHeight("auto"), 300);
            return () => { clearTimeout(timer); observer.disconnect(); };
        } else {
            // Đóng: nếu đang auto, set px trước, sau đó 0px
            if (height === "auto") {
                requestAnimationFrame(() => {
                    if (!el) return;
                    const currentHeight = el.scrollHeight + "px";
                    setHeight(currentHeight);
                    requestAnimationFrame(() => setHeight("0px"));
                });
            } else {
                setHeight("0px");
            }
        }
    }, [open]);

    return (
        <div
            style={{ maxHeight: height }}
            className="transition-all duration-300 overflow-hidden"
        >
            <div ref={ref}>{children}</div>
        </div>
    );
};

export default SmoothToggle;
