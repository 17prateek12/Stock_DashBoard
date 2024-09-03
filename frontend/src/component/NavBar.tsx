import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logoutUser } from '../slice/authSlice';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import ThemeChangeIcon from './ThemeChangeicon';


const NavBar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleExploreClick = () => {
    setOpen((prevState) => !prevState);
  };


  return (
    <div className='w-full top-0 fixed bg-navside h-16 z-0'>
      <div className='px-24 xl:px-16 sm:px-4 flex justify-between items-center h-full w-[80%] lg:w-full'>
        <div className='text-[40px] md:text-xl font-bold text-text'>StockSentry</div>
        <div className='flex items-center justify-center gap-6'>
          <ThemeChangeIcon />
          <div className='relative'>
            <button className='h-10 w-10 rounded-[50%] flex justify-center items-center border border-btn text-text' onClick={handleExploreClick} >
              {user?.username ? <p>{user.username.slice(0, 2).toUpperCase()}</p> : <p></p>}
            </button>
            {open &&
              (
                <div>
                  <div className='w-[200px] mt-4 right-0 absolute h-auto rounded-[20px] bg-navside flex flex-col gap-4 py-8 px-4 shadow-lg z-[100]'>
                    <Button onClick={handleLogout}>Logout</Button>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export { NavBar }