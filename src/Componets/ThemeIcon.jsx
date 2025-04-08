import React from 'react';
import themeIcon from '../assets/themeModeIcon.png';
import ModeStorage from '../store/ModeStorage';
import s from '../StyleComponets/themeIcon.module.css';

function ThemeIcon() {
    const [rotateValue, setRotateValue] = React.useState(0); //Добавить глобальное состояние на rotateValue путем mobx (P.S не корректно работает , сбрасывает состояние на новый роут)
    
    function getTheme() {
        ModeStorage.setFlagTheme();

        if (ModeStorage.flagTheme) {
            ModeStorage.setDarkMode();
            setRotateValue(-180);
        } else {
            ModeStorage.setSystemMode();
            setRotateValue(0);
        }
    }
    
    return <img onClick={getTheme} className={s.imgThemeIcon} src={themeIcon} alt='theme' style={{ transform: `rotate(${rotateValue}deg)` }}/>;
}

export default ThemeIcon;
