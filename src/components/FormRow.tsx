interface FormRowProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormRow: React.FC<FormRowProps> = ({ label, error, children }) => {
  return (
    <div className="flex items-baseline gap-4">
      <label className="w-40 text-sm text-gray-700">{label}</label>
      <div className="flex-1">
        {children}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default FormRow