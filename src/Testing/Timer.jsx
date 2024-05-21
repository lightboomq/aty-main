import React from 'react';

function Timer() {
    const [time, setTime] = React.useState(2);
    const timerId = React.useRef(null)

    React.useEffect(() => {
        timerId.current = setInterval(updateCountdown, 1000);
        return () => clearInterval(timerId.current);
    }, []);

    function updateCountdown() {
        
        if (time < 0) {
            console.log('vishlo')
            return clearInterval(timerId.current);
        }
        setTime(time-1);
        console.log(time)
    }
    let seconds = time % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return <h3>{`${Math.floor(time / 60)} : ${seconds}`}</h3>;
}
export default Timer;
