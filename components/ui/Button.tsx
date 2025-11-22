import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'default' | 'large' | 'xl' | 'lg';
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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-elderly-primary text-white hover:bg-elderly-primary-dark disabled:bg-elderly-gray-medium disabled:cursor-not-allowed',
    secondary: 'bg-white text-elderly-primary border-elderly border-elderly-primary hover:bg-elderly-gray-light disabled:border-elderly-gray-medium disabled:text-elderly-gray-dark disabled:cursor-not-allowed',
    accent: 'bg-elderly-cta text-white hover:bg-elderly-cta-dark disabled:bg-elderly-cta disabled:opacity-60 disabled:cursor-not-allowed',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed',
  };
  
  const sizeStyles = {
    default: 'px-8 py-4 text-elderly-base min-h-touch',
    large: 'px-10 py-5 text-elderly-lg font-bold min-h-[52px]',
    xl: 'px-8 py-4 text-elderly-lg font-bold min-h-[64px]',
    lg: 'px-6 py-3 text-elderly-base font-semibold min-h-[48px]',
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

