import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Select } from "antd";
import { useEditIssue } from "@/hooks/useIssue";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";

export interface InfoRowEditableProps<T = any> {
    mode?: "multiple" | "tags";
    label: string;
    value: T;
    editType?: "select" | "textarea";
    options?: {
        value: any;
        label: React.ReactNode;
    }[];
    renderValue?: (value: T) => React.ReactNode;
    currentIssueValue: any,
    issueId: number,
    property: string,
}

export function InfoRowEditable<T = any>({
    mode,
    label,
    value,
    editType = "select",
    options = [],
    renderValue,
    issueId,
    currentIssueValue,
    property
}: InfoRowEditableProps<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState<T>(value);

    const { mutate: mutationEdit, isPending: isEditingField } = useEditIssue()

    const handleSave = (newValue: T) => {

        const payload = {
            ...currentIssueValue,
            [property]: newValue
        }
        console.log(payload);
        mutationEdit({ id: issueId, data: payload }, {
            onSuccess: () => {
                toast.success("Issue updated successfully!");
                setIsEditing(false);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to edit issue");
                setIsEditing(false);
            },
        }

        )
    };

    const handleBlur = () => {
        const isChanged =
            Array.isArray(tempValue) && Array.isArray(value)
                ? JSON.stringify(tempValue) !== JSON.stringify(value)
                : tempValue !== value;

        if (isChanged) {
            handleSave(tempValue);
        } else {
            setIsEditing(false);
        }
    };

    useEffect(() => {
        if (isEditing) {
            setTempValue(value);
        }
    }, [isEditing]);

    return (
        <div className="flex items-center justify-between group">
            <p className="font-medium text-primary w-30">{label}</p>
            <div className="flex-1">
                {isEditing ? (
                    editType === 'select' ? (<Select
                        className="w-[250px]"
                        value={tempValue as any}
                        mode={mode}
                        onChange={(v) => {
                            setTempValue(v);
                        }}
                        options={options}
                        onBlur={() => handleBlur()}
                        optionRender={(opt) => opt.data.label}
                    />) : editType === "textarea" ? (
                        <TextArea
                            autoSize={{ minRows: 3 }}
                            className="w-full"
                            value={tempValue as any}
                            onChange={(e) => setTempValue(e.target.value as unknown as T)}
                            onBlur={() => handleBlur()}
                        />
                    ) : null
                ) : (
                    <div className="flex items-center gap-2">
                        {renderValue ? renderValue(value) : <span>{String(value)}</span>}

                        {/* ICON EDIT */}
                        <FaEdit
                            className="text-second cursor-pointer opacity-0 group-hover:opacity-100 transition"
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
