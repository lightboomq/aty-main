import React from 'react';
import { observer } from 'mobx-react-lite';
import ModeStorage from '../store/ModeStorage.js';
import s from '../StyleComponets/question.module.css';

function Question({ ticket, setTicket, userAnswers, setUserAnswers, indexTicket, setIndexTicket }) {
    const { question, questionId } = ticket[indexTicket];
    const user = JSON.parse(localStorage.getItem('user'));

    const typeTest = localStorage.getItem('typeTest');
    let url = '';
    if (typeTest === 'Экзамен') {
        url = 'http://localhost:3333/api/exam';
    } else if (typeTest === 'Тренировочный экзамен') {
        url = 'http://localhost:3333/api/exam/training';
    } else {
        url = 'http://localhost:3333/api/tickets';
    }

    async function giveAnswerOnQuestion(e) {
        if (e.target.tagName !== 'LI') return;
        const id = e.target.getAttribute('answerid');
        const ticketId = ticket[indexTicket].ticketId;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                ticketId: ticketId,
                questionId: questionId,
                answerId: id,
            }),
        });

        const json = await response.json();
        const copyTicket = JSON.parse(JSON.stringify(ticket));
        const copyUserAnswers = userAnswers;
        copyUserAnswers.splice(indexTicket, 1, json.isCorrect ? 1 : 0);

        setTicket(addPropertyToTicket(copyTicket, id, json));
        setUserAnswers([...copyUserAnswers]);
        setIndexTicket(indexTicket === ticket.length - 1 ? indexTicket : indexTicket + 1);

        takeStepAfterAnswering(indexTicket);
    }

    function addPropertyToTicket(copyTicket, id, json) {
        const answers = copyTicket[indexTicket].answers;
        const indexSelectedAnswer = answers.findIndex(el => el.answerId === id);
        const indexCorrectAnswer = answers.findIndex(el => el.answerId === json.correctAnswer);

        answers[indexSelectedAnswer].userResponse = json.isCorrect;
        answers[indexCorrectAnswer].correctAnswer = true;
        copyTicket[indexTicket].help = json.help;

        return copyTicket;
    }

    function takeStepAfterAnswering(indexTicket) {
        let step = indexTicket;
        step++;
        while (userAnswers[step] !== null && userAnswers.includes(null)) {
            if (step === ticket.length) {
                step = 0;
            } else {
                step++;
            }
        }

        const navOl = document.getElementById('navOl');
        const navLi = document.getElementById(step);

        navOl.scrollBy({
            top: 0,
            left: navLi.getBoundingClientRect().right - 160,
            behavior: 'smooth',
        });

        return setIndexTicket(step);
    }

    return (
        <>
            <div className={s.divWrapperInfo}>
                <h3 className={`${s.infoCount} ${s[ModeStorage.theme]}`}>Вопрос: {indexTicket + 1}</h3>
                <h3 className={`${s.infoCount} ${s[ModeStorage.theme]}`}>
                    {typeTest === 'Экзамен' || typeTest === 'Тренировочный экзамен' ? typeTest : `Билет № ${typeTest}`}
                </h3>
            </div>

            <div className={s.divWrapperImg}>
                {ticket[indexTicket].img ? (
                    <img className={s.imgQuestion} src={ticket[indexTicket].img} alt='imgQuestion' />
                ) : (
                    <div className={`${s.divQuestionWithoutPicture} ${s[ModeStorage.theme]}`}>Вопрос без рисунка</div>
                )}
            </div>

            <h3 className={`${s.h3QuestionTitle} ${s[ModeStorage.theme]} `}>{question}</h3>

            <ol onClick={giveAnswerOnQuestion}>
                {ticket[indexTicket].answers.map((answer, i) => {
                    return (
                        <div key={answer.answerId}>
                            <div>
                                <li answerid={answer.answerId} className={`${s.liAnswer} ${s[ModeStorage.theme]}`}>
                                    {`${i + 1}. ${answer.answerText}`}
                                </li>
                            </div>
                        </div>
                    );
                })}
            </ol>
        </>
    );
}

export default observer(Question);
