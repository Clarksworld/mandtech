import React, { useState } from 'react';
import './FormFields.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  required = false,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`form-field-container ${className} ${focused ? 'field-focused' : ''}`}>
      <label htmlFor={inputId} className="field-label">
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      {multiline ? (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="field-input field-textarea"
          {...(props as any)}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="field-input"
          {...props}
        />
      )}
    </div>
  );
};

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  id?: string;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  checked,
  onToggle,
  id,
}) => {
  const checkboxId = id || `checkbox-${label.slice(0, 10).toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="checkbox-row" onClick={onToggle}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        onChange={() => {}} // Controlled state
        className="hidden-checkbox"
      />
      <div className={`custom-checkbox ${checked ? 'checked' : ''}`}>
        {checked && <span className="checkmark-icon">✓</span>}
      </div>
      <label htmlFor={checkboxId} className={`checkbox-label ${checked ? 'checked-label' : ''}`}>
        {label}
      </label>
    </div>
  );
};

interface RadioGroupProps {
  options: string[];
  selected: string;
  onSelect: (val: string) => void;
  label?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  selected,
  onSelect,
  label,
}) => {
  return (
    <div className="radio-group-container">
      {label && <label className="field-label">{label}</label>}
      <div className="radio-grid">
        {options.map((opt) => {
          const isSelected = selected === opt;
          return (
            <div
              key={opt}
              className={`radio-option ${isSelected ? 'radio-selected' : ''}`}
              onClick={() => onSelect(opt)}
            >
              <div className={`radio-circle ${isSelected ? 'circle-selected' : ''}`} />
              <span className="radio-text">{opt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
