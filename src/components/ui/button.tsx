import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const base = "inline-flex items-center justify-center font-medium rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  };
  // Tab active style: nếu có class 'flex-1' và variant=default thì thêm border, shadow, text-primary
  const isTab = className.includes('flex-1');
  const isActiveTab = isTab && variant === 'default';
  const tabActiveStyle = isActiveTab ? 'bg-blue-600 !text-white shadow hover:bg-blue-700' : '';
  const sizes: Record<string, string> = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  // Nếu là tab active thì không dùng variants[variant] nữa để tránh conflict màu
  const variantClass = isActiveTab ? tabActiveStyle : variants[variant];
  return (
    <button
      className={`${base} ${variantClass} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
