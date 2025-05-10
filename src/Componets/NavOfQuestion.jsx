import React from 'react';
import s from '../StyleComponets/navOfQuestion.module.css';
import ModeStorage from '../store/ModeStorage.js';
import { observer } from 'mobx-react-lite';

function NavOfQuestion({ ticket, userAnswers, indexTicket, setIndexTicket }) {
    const typeTest = localStorage.getItem('typeTest');
   
    function highlight(i) {
        if (i === indexTicket) return `${s.questionByNav} ${s.highlightInBlue}`;
        if (userAnswers[i]) return `${s.questionByNav} ${s.highlightInGreen}`;
        if (userAnswers[i] === 0) return `${s.questionByNav} ${s.highlightInRed}`;

        return `${s.questionByNav} ${s[ModeStorage.theme]}`;
    }

    function highlightExam(i) {
        if (typeof userAnswers[i] === 'number') return `${s.questionByNav} ${s.highlightInDark}`;
        if (i === indexTicket) return `${s.questionByNav} ${s.highlightInBlue}`;

        return `${s.questionByNav} ${s[ModeStorage.theme]}`;
    }

    const navOl = React.useRef(null);

    function scrollNav(selectedTagLi) {
        navOl.current.scrollBy({
            top: 0,
            left: selectedTagLi - 160,
            behavior: 'smooth',
        });
    }

    function getQuestionByNav(e) {
        const index = Number(e.target.id);
        if (e.target.tagName !== 'LI' || userAnswers[index] !== null) return;

        const selectedTagLi = e.target.getBoundingClientRect().right;
        scrollNav(selectedTagLi);

        setIndexTicket(index);
    }

    return (
        <ol id={'navOl'} ref={navOl} onClick={getQuestionByNav} className={s.olWrapper}>
            {ticket.map((obj, i) => {
                return (
                    <li
                        key={`${obj.answers}${i}`}
                        id={i}
                        className={typeTest === 'Экзамен' || typeTest === 'Тренировочный экзамен' ? highlightExam(i) : highlight(i)}
                    >
                        {i + 1}
                    </li>
                );
            })}
        </ol>
    );
}

export default observer(NavOfQuestion);
