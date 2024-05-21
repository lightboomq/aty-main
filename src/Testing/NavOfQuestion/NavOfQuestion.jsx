import React from 'react';
import s from './navOfQuestion.module.css';
import ModeStorage from '../../store/ModeStorage.js';
import { observer } from 'mobx-react-lite';
function NavOfQuestion({ ticket, userAnswerFlags, indexTicket, setIndexTicket }) {
    function highlight(i) {
        if (userAnswerFlags[i]) return `${s.questionByNav} ${s.highlightInGreen}`;

        if (userAnswerFlags[i] === 0) return `${s.questionByNav} ${s.highlightInRed}`;

        if (i === indexTicket) return `${s.questionByNav} ${s.highlightInBlue}`;

        return `${s.questionByNav} ${s[ModeStorage.theme]}`;
    }

 
    const olRef = React.useRef(null);

    const [currentLiCoordX, setCurrentLiCoordX] = React.useState(0);

    console.log(currentLiCoordX)
    console.log(currentLiCoordX-100)
    React.useEffect(() => {
        olRef.current.scrollBy({
            top: 0,
            left: currentLiCoordX-100,
            behavior: 'smooth',
        });
    }, [currentLiCoordX]);

    function getQuestionByNav(e) {
        const index = e.target.id;
        if (e.target.tagName !== 'LI' || ticket[index].correctAnswer) return;

        setCurrentLiCoordX(e.target.getBoundingClientRect().left);
        setIndexTicket(Number(index));
    }

    return (
        <ol id={'olNav'} ref={olRef} onClick={getQuestionByNav} className={s.olWrapper}>
            {ticket.map((obj, i) => {
                return (
                    <li key={obj.question} id={i} className={highlight(i)}>
                        {i + 1}
                    </li>
                );
            })}
        </ol>
    );
}

export default observer(NavOfQuestion);
