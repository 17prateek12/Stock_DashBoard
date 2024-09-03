import React, { useContext, useState, useEffect } from 'react'
import stock from "../asset/stock.png";
import Button from '../component/Button';
import businessman from "../asset/businessmen.png";
import businessmanlight from "../asset/businessmen-light.png";
import ThemeChangeIcon from '../component/ThemeChangeicon';
import ThemeContext from '../context/ThemeContext';
import RegisterLoginModal from '../component/RegisterLoginModal';

const LandingPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  const [openmodel, setOpenmodel] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const handleclose = () => {
    setOpenmodel(false);
  }

  const getCurrentIcon = (): string => {
    if (darkMode === 'light') {
      return businessman;
    } else if (darkMode === 'dark') {
      return businessmanlight;
    } else {
      return systemTheme === 'dark' ? businessmanlight : businessman;
    }
  };

  return (
    <main className='bg-muted'>
      <header className='max-w-7xl mx-auto px-24 md:px-4 lg:px-12 py-2 flex justify-between items-center '>
        <img src={stock} alt="..." className='w-16 h-16 object-contain' />
        <ThemeChangeIcon />
      </header>
      <section className='max-w-7xl mx-auto px-24 xl:px-12 md:px-4 pt-24 min-h-screen'>
        <div className='flex w-full justify-between items-center flex-wrap navmd:justify-center navmd:gap-8'>
          <div className='w-[400px] md:w-full h-auto flex flex-col items-center justify-center'>
            <h1 className='text-[60px] font-bold mb-16 md:text-3xl md:mb-8 text-text'>StockSentry</h1>
            <p className='text-xl font-normal leading-10 text-justify mb-4 sm:text-sm sm:leading-7 text-text'>
              StockSentry is a stock tracking dashboard. Moninter stock price, receive complete market price
              value historical data, and forecast its future value. Create your own watchlist and learn about
              the trending stocks' top gainers and losers.
            </p>
            <Button onClick={() => {
              setOpenmodel(true);
              console.log('Modal should open, openmodel:', true);
            }}>Get Started</Button>

          </div>
          <div className='w-[600px] md:w-full lg:w-1/2 xl:w-1/2 navmd:w-full'>
            <img src={getCurrentIcon()} alt="..." className='w-full h-auto object-contain' />
          </div>
        </div>

        {openmodel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50" >
            <RegisterLoginModal onClose={handleclose} />
          </div>
        )}
      </section>
    </main>
  )
}

export default LandingPage