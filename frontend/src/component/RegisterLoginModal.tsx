import { useState } from 'react';
import { LoginForm } from './LoginForm';
import Registrationform from './Registrationform';
import { IoMdCloseCircleOutline } from "react-icons/io";

const RegisterLoginModal = ({ onClose }: { onClose: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);


  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-loginform w-[400px] sm:w-[90%] px-6 py-8 rounded-lg relative'>
        <div className='w-full flex items-center justify-center'>
          {isLogin ? (
            <p className='text-text text-3xl font-bold mx-auto'>LOGIN</p>
          ) : (
            <p className='text-text mx-auto text-3xl font-bold'>
              SIGN UP
            </p>
          )}
          <button onClick={onClose} className='ml-auto'>
            <IoMdCloseCircleOutline className='text-text' />
          </button>
        </div>
        {isLogin ? (
          <LoginForm />
        ) : (
          <Registrationform  />
        )}
        <p className="text-text text-sm font-normal my-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-sm font-bold cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterLoginModal;
