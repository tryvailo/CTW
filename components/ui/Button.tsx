import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-elderly-primary text-white hover:bg-elderly-primary-dark disabled:bg-elderly-gray-medium disabled:cursor-not-allowed',
    secondary: 'bg-white text-elderly-primary border-elderly border-elderly-primary hover:bg-elderly-gray-light disabled:border-elderly-gray-medium disabled:text-elderly-gray-dark disabled:cursor-not-allowed',
  };
  
  const sizeStyles = {
    default: 'px-8 py-4 text-elderly-base min-h-touch',
    large: 'px-10 py-5 text-elderly-lg font-bold min-h-[52px]',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

