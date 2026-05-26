import React from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'charcoal';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const btnClass = [
    'mandtech-btn',
    `btn-${variant}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={btnClass} disabled={disabled || loading} {...props}>
      {loading ? (
        <span className="spinner"></span>
      ) : (
        <span className="btn-label">{label}</span>
      )}
    </button>
  );
};

export default Button;
