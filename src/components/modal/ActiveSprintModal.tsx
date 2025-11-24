"use client";

import { Modal } from "antd";
import { useState } from "react";

interface ActiveSprintModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    sprints: { id: number; name: string }[];
    handleAddToSprint: (sprintId: number) => void;
}

const ActiveSprintModal: React.FC<ActiveSprintModalProps> = ({
    open,
    setOpen,
    sprints,
    handleAddToSprint,
}) => {
    const [selectedSprint, setSelectedSprint] = useState<number | null>(null);

    const confirm = () => {
        if (!selectedSprint) return;
        handleAddToSprint(selectedSprint);
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            footer={null}
            closable={false}
            onCancel={() => setOpen(false)}
        >
            {/* Header */}
            <div className="text-lg font-semibold mb-4">
                Add selected issues to a sprint
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">

                {sprints.length === 0 && (
                    <div className="p-4 bg-red-50 text-red-500 rounded text-center">
                        No active sprint available
                    </div>
                )}

                {sprints.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSelectedSprint(s.id)}
                        className={`p-3 border rounded text-left transition 
                            ${selectedSprint === s.id
                                ? "bg-blue-100 border-blue-500"
                                : "hover:bg-blue-50"
                            }`}
                    >
                        <div className="font-semibold">{s.name}</div>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 mt-5">
                <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Cancel
                </button>

                <button
                    disabled={!selectedSprint}
                    onClick={confirm}
                    className={`px-4 py-2 rounded text-white 
                        ${selectedSprint
                            ? "bg-primary hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Confirm
                </button>
            </div>
        </Modal>
    );
};

export default ActiveSprintModal;
