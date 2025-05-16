import React from 'react';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ErrorsMessage from './Componets/ErrorsMessage';
import s from './layout.module.css';
function Layout() {
    return (
        <div className={s.wrapper}>
            <ErrorsMessage/>
            <Outlet /> {/*В Outlet будет подставляться содержимое текущего маршрута */}
        </div>
    );
}

export default observer(Layout);
