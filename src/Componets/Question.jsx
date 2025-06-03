import { observer } from 'mobx-react-lite';
import ModeStorage from '../store/ModeStorage.js';
import errors from '../store/Errors.js';
import s from '../StyleComponets/question.module.css';

function Question({ ticket, setTicket, userAnswers, setUserAnswers, indexTicket, setIndexTicket, setIsLoaderOfNav }) {
    const { question, questionId } = ticket[indexTicket];
    const user = JSON.parse(localStorage.getItem('user'));

    let url = '';
    const typeTest = localStorage.getItem('typeTest');

    if (typeTest === 'Экзамен') {
        url = 'http://localhost:3333/api/exam';
    } else if (typeTest === 'Тренировочный экзамен') {
        url = 'http://localhost:3333/api/exam/training';
    } else {
        url = 'http://localhost:3333/api/tickets';
    }

    const giveAnswerOnQuestion = async e => {
        if (e.target.tagName !== 'LI') return;
        const id = e.target.getAttribute('answerid');
        const ticketId = ticket[indexTicket].ticketId;

        try {
            setIsLoaderOfNav(true);
            const res = await fetch(url, {
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

            if (!res.ok) {
                const err = await res.json();
                throw err || 'Ошибка запроса повторите позже';
            }
            const data = await res.json();

            const nextIndex = indexTicket === ticket.length - 1 ? indexTicket : indexTicket + 1;
            setUserAnswers(prev => [...prev.slice(0, indexTicket), data.isCorrect ? 1 : 0, ...prev.slice(indexTicket + 1)]);
            setTicket(prev => addPropertyToTicket(structuredClone(prev), id, data));
            setIndexTicket(nextIndex);
            takeStepAfterAnswering(indexTicket);
            setIsLoaderOfNav(false);
        } catch (err) {
            errors.setMessage(err.message);
        }
    };

    const addPropertyToTicket = (copyTicket, id, json) => {
        const answers = copyTicket[indexTicket].answers;
        const indexSelectedAnswer = answers.findIndex(el => el.answerId === id);
        const indexCorrectAnswer = answers.findIndex(el => el.answerId === json.correctAnswer);

        answers[indexSelectedAnswer].userResponse = json.isCorrect;
        answers[indexCorrectAnswer].correctAnswer = true;
        copyTicket[indexTicket].help = json.help;

        return copyTicket;
    };

    const takeStepAfterAnswering = indexTicket => {
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
    };

    return (
        <>
            <div className={s.divWrapperInfo}>
                <h3 className={`${s.infoCount} ${s[ModeStorage.theme]}`}>Вопрос: {indexTicket + 1}</h3>
                <h3 className={`${s.infoCount} ${s[ModeStorage.theme]}`}>{typeTest}</h3>
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
