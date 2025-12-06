"use client";

const ButtonGroup = ({
    onAdd,
    title,
    secondTitle,
    onSecond,
    thirdTitle,
    onThird,
    isHideRight
}: {
    onAdd: () => void;
    title: string;
    secondTitle?: string;
    onSecond?: (value?: any) => void;
    thirdTitle?: string;
    onThird?: () => void;
    isHideRight?: boolean
}) => {

    const handleSecondClick = () => {
        if (secondTitle === "Add to active sprint") {
            onSecond?.(true);
        } else {
            onSecond?.();
        }
    };

    const leftButtons = [
        { label: title, onClick: onAdd },

        secondTitle && {
            label: secondTitle,
            onClick: handleSecondClick,
        },

        thirdTitle && { label: thirdTitle, onClick: onThird },
    ].filter(Boolean) as { label: string; onClick?: () => void }[];

    return (
        <>
            <div className="flex py-3 justify-between">
                {/* LEFT BUTTONS */}
                <div className="flex gap-3">
                    {leftButtons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={btn.onClick}
                            className="px-3 bg-primary text-white transition font-semibold duration-300 hover:scale-110 cursor-pointer origin-center"
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                {!isHideRight && (<div className="flex gap-3">
                    <button className="px-3 bg-primary font-semibold text-white">Filter</button>
                    <button className="px-3 bg-primary font-semibold text-white">Sort By</button>
                    <button className="px-3 bg-primary font-semibold text-white">View</button>
                </div>)}
            </div>


        </>
    );
};

export default ButtonGroup;
