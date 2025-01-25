import React from 'react';
import Header from '../Header/Header.jsx';
import ResultAnswers from './ResultAnswers';
import ResultNotFound from './ResultNotFound.jsx';
import Input from './Input/Input.jsx';
import s from './userTestResult.module.css';
import ModeStorage from '../store/ModeStorage.js';
import { observer } from 'mobx-react-lite';

function UserResultTest({ theme, setTheme }) {
    const user = JSON.parse(localStorage.getItem('user'));
    React.useEffect(() => { 
        async function setExam() {
            await fetch('http://localhost:3333/api/exam/getResult', { //запрос на снятия экзамена 
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
        }
        setExam();
    }, [user.token]);

    const ticket = JSON.parse(localStorage.getItem('readyTicket'));
    const ticketNumber = localStorage.getItem('ticketNumber');
    const correctAnswers = Number(localStorage.getItem('correctAnswers'));
    const timer = localStorage.getItem('timer');

    const [inputValue, setInputValue] = React.useState('');

    const ticketsFound = ticket.filter(byQuestion => {
        return byQuestion.question.toLowerCase().includes(inputValue.toLowerCase());
    });

    return (
        <div className={`${s.divWrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.divWrapperContent} ${s[ModeStorage.theme]}`}>
                <Header theme={theme} setTheme={setTheme} />

                <div className={s.divWrapperInfo}>
                    {correctAnswers < ticket.length - 2 ? (
                        <h2 className={s.didNotPass}>
                            {ticketNumber === 'Экзамен' ? 'Экзамен не сдан' : `Билет № ${ticketNumber} не сдан`}
                        </h2>
                    ) : (
                        <h2 className={s.passed}>{ticketNumber === 'Экзамен' ? 'Экзамен сдан' : `Билет № ${ticketNumber} сдан`}</h2>
                    )}

                    <h3 className={s.info}>{`Правильных ответов ${correctAnswers} из ${ticket.length}`}</h3>
                    <p className={s.info}>Оставшееся время тестирования {timer}</p>
                </div>

                <Input inputValue={inputValue} setInputValue={setInputValue} ticketsFound={ticketsFound} />

                {ticketsFound.length > 0 ? (
                    ticketsFound.map((obj, i) => {
                        return (
                            <div className={s.wrapperTicket} key={`${obj.question} ${i}`}>
                                <div className={`${s.wrapperT} ${s[ModeStorage.theme]}`}>
                                    <h3>Вопрос: {obj.questionNumber}</h3>

                                    <div className={s.divWrapperImg}>
                                        {obj.img ? (
                                            <img className={s.imgQuestion} src={obj.img} alt='imgQuestion' />
                                        ) : (
                                            <div className={s.divQuestionWithoutPicture}>Вопрос без рисунка</div>
                                        )}
                                    </div>

                                    <h3 className={s.h3QuestionTitle}>{obj.question}</h3>

                                    <ol className={s.olWrapperAnswers}>
                                        {obj.answers.map((el, i) => {
                                            return (
                                                <li key={`${el.answerText}${i}`} className={s.liAnswer}>
                                                    <ResultAnswers el={el} />
                                                </li>
                                            );
                                        })}
                                    </ol>

                                    <div className={s.wrapperHelp}>
                                        {obj.help ? (
                                            <h4>
                                                Правильный ответ: {obj.answers.findIndex(answer => answer.id === obj.correctAnswer) + 1}
                                            </h4>
                                        ) : (
                                            ''
                                        )}
                                        <p>{obj.help}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <ResultNotFound />
                )}
            </div>
        </div>
    );
}

export default observer(UserResultTest);
