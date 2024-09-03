import {Routes, Route} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { NavBar } from '../component/NavBar';
import Sidemenu from '../component/Sidemenu';
import MainPage from '../DashBoard/MainPage';
import StockDetail from '../DashBoard/StockDetail';
import TopGainer from '../DashBoard/TopGainer';
import TopLoser from '../DashBoard/TopLoser';
import IndicesBoard from '../DashBoard/IndicesBoard';
import WatchList from '../DashBoard/WatchList';
import PredictionChart from '../DashBoard/PredictionChart';
import UserProfile from '../DashBoard/UserProfile';


const HomePage = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className='grid grid-cols-5 lg:grid-cols-1'>
      <div className='block col-span-1 min-h-screen lg:hidden z-0'>
        <Sidemenu />
      </div>
      <div className='lg:col-span-1 col-span-4 '>
        <NavBar />
        <div className='py-16 z-[2] bg-white px-16 lg:px-8 sm:px-4'>
          <Routes>
            <Route path="/*" element={<MainPage />} />
            <Route path="/detail/symbol" element={<StockDetail />} />
            <Route path='/topgain' element={<TopGainer />} />
            <Route path='/toploser' element={<TopLoser />} />
            <Route path='/indices' element={<IndicesBoard />} />
            <Route path='/watchlist' element={<WatchList />} />
            <Route path='/prediction' element={<PredictionChart />} />
            <Route path='/userprofile' element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export { HomePage }