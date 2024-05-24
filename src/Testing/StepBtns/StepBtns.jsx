import React from 'react';
import s from './stepBtns.module.css';
function StepBtns({ ticket, userAnswerFlags, indexTicket, setIndexTicket }) {
    function scrollNav(step) {
        const navOl = document.getElementById('navOl');
        const navLi = document.getElementById(step);

        navOl.scrollBy({
            top: 0,
            left: navLi.getBoundingClientRect().right - 160,
            behavior: 'smooth',
        });
    }

    function nextQuestion() {
        let step = indexTicket;

        step++;
        while (userAnswerFlags[step] !== null) {
            if (step === ticket.length) {
                step = 0;
            }
            else{
                step++;
            }
        }
        scrollNav(step);
        return setIndexTicket(step);
    }

    function prevQuestion() {
        let step = indexTicket;

        step--;
        while (userAnswerFlags[step] !== null) {
            if (step === -1) {
                step = ticket.length - 1;
            } else {
                step--;
            }
        }
        scrollNav(step);
        return setIndexTicket(step);
    }

    return (
        <div className={s.divWrapperBtns}>
            <button className={s.btn} onClick={prevQuestion} type='button'>
                Предыдущий вопрос
            </button>
            <button className={s.btn} onClick={nextQuestion} type='button'>
                Следующий вопрос
            </button>
        </div>
    );
}

export default StepBtns;
