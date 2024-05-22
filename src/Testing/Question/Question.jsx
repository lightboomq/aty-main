import React from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import ModeStorage from '../../store/ModeStorage.js';
import s from './question.module.css';

function Question({ ticket, setTicket, userAnswerFlags, setUserAnswerFlags, indexTicket, setIndexTicket }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const selectedTicket = localStorage.getItem('selectedTicket');

    React.useEffect(() => {
        if (!userAnswerFlags.includes(null) && userAnswerFlags.length === ticket.length) {
            const correctAnswers = userAnswerFlags.reduce((sum, num) => sum + num, 0);
            localStorage.setItem('readyTicket', JSON.stringify(ticket));
            localStorage.setItem('correctAnswers', correctAnswers);
            return navigate('/result');
        }
    }, [navigate, ticket, userAnswerFlags]);

    
    async function giveAnswerOnQuestion(e) {
        if (e.target.tagName !== 'LI') return;
        const selectedTicket = localStorage.getItem('selectedTicket');

        const ticketNumber = Number(ticket[indexTicket].ticketNumber);

        console.log(ticketNumber);
        const indexAnswer = Number(e.target.getAttribute('index'));
        const idAnswer = e.target.getAttribute('id');

        const url = selectedTicket === 'Экзамен' ? `http://localhost:3333/exam/${ticketNumber}` : 'http://localhost:3333/tickets/3';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                answerId: idAnswer,
                questionNumber: indexTicket + 1,
            }),
        });

        const json = await response.json();

        console.log(json);

        userAnswerFlags.splice(indexTicket, 1, json.isCorrect ? 1 : 0);
        setUserAnswerFlags([...userAnswerFlags]);
        setIndexTicket(indexAnswer + 1);

        const copyTicket = JSON.parse(JSON.stringify(ticket));

        copyTicket[indexTicket].answers[indexAnswer].userResponse = json.isCorrect;

        copyTicket[indexTicket].correctAnswer = json.correctAnswer;
        copyTicket[indexTicket].help = json.help;

        const foundId = copyTicket[indexTicket].correctAnswer;
        const test = copyTicket[indexTicket].answers.findIndex(el => el.id === foundId);
        copyTicket[indexTicket].answers[test].correctAnswer = true;

        console.log(copyTicket);
        setTicket(copyTicket);

        takeStepAfterAnswering();
    }

    function takeStepAfterAnswering() {
        let step = indexTicket;

        if (step === ticket.length - 1) step = -1;
        step++;
        while (userAnswerFlags[step] !== null) {
            if (step === ticket.length - 1) step = -1;
            step++;
            if (step === ticket.length - 1) break;
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
                <h3 className={`${s.infoCount} ${s[ModeStorage.theme]}`}>{selectedTicket}</h3>
            </div>

            <div className={s.divWrapperImg}>
                {ticket[indexTicket].img ? (
                    <img className={s.imgQuestion} src={ticket[indexTicket].img} alt='imgQuestion' />
                ) : (
                    <div className={`${s.divQuestionWithoutPicture} ${s[ModeStorage.theme]}`}>Вопрос без рисунка</div>
                )}
            </div>

            <h3 className={`${s.h3QuestionTitle} ${s[ModeStorage.theme]} `}>{ticket[indexTicket].question}</h3>

            <ol onClick={giveAnswerOnQuestion}>
                {ticket[indexTicket].answers.map((answer, i) => {
                    return (
                        <div key={`${answer.answer_text} ${i}`}>
                            <div>
                                <li id={answer.id} index={i} className={`${s.liAnswer} ${s[ModeStorage.theme]}`}>
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
