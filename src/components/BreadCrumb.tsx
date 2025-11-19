import Link from "next/link";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadCrumbProps {
    items: { label: string; href?: string }[];
}

const BreadCrumb = ({ items }: BreadCrumbProps) => {
    return (
        <nav className="flex items-center text-sm text-gray-600 cursor-pointer pb-3">
            {items.map((item, index) => {
                const isHome = item.label.toLowerCase() === "home";

                return (
                    <div key={index} className="flex items-center group">
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="flex items-center gap-1 group-hover:text-primary"
                            >
                                {isHome && <FaHome size={14} className="text-primary" />}
                                {item.label}
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1 text-gray-800 font-medium group-hover:text-primary">
                                {isHome && <FaHome size={14} className="text-primary" />}
                                {item.label}
                            </span>
                        )}

                        {index < items.length - 1 && (
                            <FaChevronRight className="mx-2 text-gray-400 text-xs group-hover:text-primary" />
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default BreadCrumb;
