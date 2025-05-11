import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

const FormField = ({
  label,
  htmlFor,
  error,
  required = false,
  className,
  children,
}: FormFieldProps) => {
  return (
    <div className={twMerge('space-y-2', className)}>
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;