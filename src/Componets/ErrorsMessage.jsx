import React from 'react';
import errorIcon from '../assets/errorIcon.svg';
import Errors from '../store/Errors';
import s from '../StyleComponets/errorsMessage.module.css';
function ErrorsMessage({ err }) {
    const [isShowError, setIsShowError] = React.useState(true);
    React.useEffect(() => {
        const timerId = setTimeout(() => {
            setIsShowError(false);
            Errors.setMessage('')
        }, 10000);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <>
            {isShowError && (
                <div className={s.wrapper}>
                    <img src={errorIcon} alt='err' />
                    <p className={s.textErr}>{err}</p>
                    <div className={s.line}> </div>
                </div>
            )}
        </>
    );
}

export default ErrorsMessage;
