import React from 'react';
import Header from '../Header/Header.jsx';
import ResultAnswers from './ResultAnswers';
import ResultNotFound from './ResultNotFound.jsx';
import Input from './Input/Input.jsx';
import s from './userTestResult.module.css';
import ModeStorage from '../store/ModeStorage.js';
import { observer } from 'mobx-react-lite';

function UserResultTest({ theme, setTheme }) {
    const ticket = JSON.parse(localStorage.getItem('readyTicket'));
    const selectedTicket = localStorage.getItem('selectedTicket');
    const correctAnswers = Number(localStorage.getItem('correctAnswers'));
    const userPassed = `${selectedTicket} сдан`;
    const userDidNotPass = `${selectedTicket} не сдан`;
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
                            {selectedTicket === 'Экзамен' ? `${userDidNotPass}` : `Билет №  ${userDidNotPass}`}
                        </h2>
                    ) : (
                        <h2 className={s.passed}>{selectedTicket === 'Экзамен' ? `${userPassed}` : `Билет №  ${userPassed}`}</h2>
                    )}

                    <h3 className={s.info}>{`Правильных ответов ${correctAnswers} из ${ticket.length}`}</h3>
                    <p className={s.info}>Оставшееся время тестирования 20:00</p>
                    <h3 className={s.info}>Результат тестирование АТУ </h3>
                </div>

                <Input inputValue={inputValue} setInputValue={setInputValue} ticketsFound={ticketsFound} />

                {ticketsFound.length > 0 ? (
                    ticketsFound.map((obj, i) => {
                        return (
                            <div className={s.wrapperTicket} key={`${obj.question} ${i}`}>
                                <div className={`${s.wrapperT} ${s[ModeStorage.theme]}`}>
                                    <h3>Вопрос: {i + 1}</h3>

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
