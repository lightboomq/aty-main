import React from 'react';
import { Outlet } from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import s from './layout.module.css'
function Layout() {
  return (
    <div className={s.wrapper}>
      <Outlet/> {/*В Outlet будет подставляться содержимое текущего маршрута */}
    </div>
  );
};

export default  observer(Layout);