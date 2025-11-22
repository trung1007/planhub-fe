const ButtonGroup = ({ onAdd, title }: { onAdd: () => void, title:string }) => {
    return (
        <div className="flex py-3 justify-between">
            <button
                onClick={onAdd}
                className="px-3 bg-primary text-white transition font-semibold duration-300 hover:scale-110 cursor-pointer origin-center"
            >
                {title}
            </button>
            <div className="flex gap-3">
                <button className="px-3 bg-primary font-semibold text-white ">
                    Filter
                </button>
                <button className="px-3 bg-primary font-semibold text-white ">
                    Sort By
                </button>
                <button className="px-3 bg-primary font-semibold text-white ">
                    View
                </button>
            </div>
        </div>
    );
};

export default ButtonGroup