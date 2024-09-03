import React, { useState } from 'react';
import stock from "../asset/stock.png";
import LinkButton from './LinkButton';
import DashboardLnks from './DashboardLnks';
import { Link, useLocation } from 'react-router-dom';

const Sidemenu = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div className='px-8 py-4 bg-navside h-full'>
      <img src={stock} alt="..." className='w-16 h-16 object-contain mx-auto' />
      <div className='flex justify-center items-center gap-4 flex-col my-8'>
        {DashboardLnks.map((item, index) => (
          <Link to={item.link} key={index} onClick={() => handleLinkClick(item.link)}>
            <LinkButton isActive={activeLink === item.link}>{item.label}</LinkButton>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
