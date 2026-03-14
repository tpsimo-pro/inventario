import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import './FormField.css';

interface FormFieldBaseProps {
  label: string;
  error?: string;
  required?: boolean;
}

type InputFieldProps = FormFieldBaseProps & InputHTMLAttributes<HTMLInputElement> & {
  as?: 'input';
};

type SelectFieldProps = FormFieldBaseProps & SelectHTMLAttributes<HTMLSelectElement> & {
  as: 'select';
  children: React.ReactNode;
};

type FormFieldProps = InputFieldProps | SelectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, error, required, as = 'input', ...rest } = props;

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </label>
      {as === 'select' ? (
        <select className={`form-input form-select ${error ? 'form-error' : ''}`} {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}>
          {(props as SelectFieldProps).children}
        </select>
      ) : (
        <input className={`form-input ${error ? 'form-error' : ''}`} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
}
