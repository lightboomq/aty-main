import React from 'react';
import themeIcon from '../../assets/themeModeIcon.png';
import ModeStorage from '../../store/ModeStorage';
import { observer } from 'mobx-react-lite';
import s from './themeIcon.module.css';

function ThemeIcon() {
    const [rotateImg, setRotateImg] = React.useState(-180);
    const img = React.useRef(0);

    function getTheme() {
        ModeStorage.setFlagTheme();
        ModeStorage.flagTheme ? ModeStorage.setDarkMode() : ModeStorage.setSystemMode();

        img.current.style.transform = `rotate(${rotateImg}deg)`;
        setRotateImg(rotateImg - 180);
    }
    return <img ref={img} onClick={getTheme} className={s.imgThemeIcon} src={themeIcon} alt='theme' />;
}

export default observer(ThemeIcon);
