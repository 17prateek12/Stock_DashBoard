import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset"; // Add type prop
};

const Button = ({ children, onClick = () => {}, type = "button" }: ButtonProps) => {
  return (
    <button
      type={type} // Use the type prop here
      className='px-4 py-2 text-base text-btntxt bg-btn font-medium rounded-lg 
                 hover:bg-btntxt hover:text-btn duration-150 ease-in-out transition-all 
                 border border-transparent hover:border-btn'
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
