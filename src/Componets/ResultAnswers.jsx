import React from 'react';
import s from '../StyleComponets/resultAnswer.module.css';
function ResultAnswers({ el }) {
    if (el.userResponse && el.correctAnswer) {
        return (
            <span>
                {el.answerText}
                <span className={s.highlightStantardGreen}>
                    &nbsp;(Эталон)
                    <span className={s.highlightUserResponseRed}>(Ваш ответ)</span>
                </span>
            </span>
        );
    }

    if (el.userResponse === false) {
        return (
            <span>
                {el.answerText}
                <span className={s.highlightUserResponseRed}>(Ваш ответ)</span>
            </span>
        );
    }

    if (el.correctAnswer) {
        return (
            <span>
                {el.answerText}
                <span className={s.highlightStantardGreen}>(Эталон)</span>
            </span>
        );
    }

    return el.answerText;
}

export default ResultAnswers;
