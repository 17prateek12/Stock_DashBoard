import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  isActive?: boolean; // Use isActive prop to determine the button style
};

const LinkButton = ({ children, onClick = () => {}, type = "button", isActive = false }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`px-8 py-2 text-base font-medium rounded-lg transition-all w-[200px] lg:w-full
                  duration-150 ease-in-out border border-transparent ${isActive ? 'bg-btn text-btntxt border-transparent' : 'bg-transparent text-btn border-btn underline'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default LinkButton;
