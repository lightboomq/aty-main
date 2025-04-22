import React from 'react';
import { Outlet } from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import s from './layout.module.css'
function Layout() {
  return (
    <>
      <Outlet/> {/*В Outlet будет подставляться содержимое текущего маршрута */}
    </>
        
   
  );
};

export default  observer(Layout);