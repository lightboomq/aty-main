import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/timer.svg';
import s from '../StyleComponets/timer.module.css';
import ModeStorage from '../store/ModeStorage.js';
function Timer({ ticket, userAnswers}) {
    const [time, setTime] = React.useState(1200);
    const [minutes, setMinutes] = React.useState('20');
    const [seconds, setSeconds] = React.useState('00');
    

    const navigate = useNavigate();
    React.useEffect(() => {
        function counter() {
            setMinutes(time / 60 < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60));
            setSeconds(time % 60 < 10 ? `0${time % 60}` : time % 60);
            setTime(time - 1);
        }
        function updateCounter() {
            if (time === 0) {
                const correctAnswers = userAnswers.reduce((sum, num) => sum + num, 0);
                localStorage.setItem('readyTicket', JSON.stringify(ticket));
                localStorage.setItem('correctAnswers', correctAnswers);
                return navigate('/result');
            }
            counter();
        }
        setTimeout(updateCounter, 1000);
    }, [time, navigate, ticket, userAnswers]);

    return (
        <div className={s.wrapper}>
            <img src={logo} alt='timer' />
            <h3 className={`${s.timer} ${s[ModeStorage.theme]}`}>{`${minutes}:${seconds}`}</h3>
        </div>
    );
}

export default Timer;
