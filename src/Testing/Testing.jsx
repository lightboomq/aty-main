import React from 'react';
import Header from '../Header/Header.jsx';
import NavOfQuestion from './NavOfQuestion/NavOfQuestion.jsx';
import Timer from './Timer/Timer.jsx';
import Question from './Question/Question.jsx';
import StepBtns from './StepBtns/StepBtns.jsx';
import s from './testing.module.css';
import ModeStorage from '../store/ModeStorage.js';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
function Testing() {
    const [ticket, setTicket] = React.useState([{ question: '', answers: [], img: '' }]);
    const [indexTicket, setIndexTicket] = React.useState(0);
    const [userAnswerFlags, setUserAnswerFlags] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        function getTicketFromLocaleStorage() {
            const localeStorageTicket = JSON.parse(localStorage.getItem('ticketJson'));

            const flags = [];

            for (let i = 0; i < localeStorageTicket.length; i++) {
                flags.push(null);
            }

            setUserAnswerFlags([...flags]);
            setTicket(localeStorageTicket);
        }
        getTicketFromLocaleStorage();
    }, []);

    console.log(userAnswerFlags)
    React.useEffect(() => {
        if (!userAnswerFlags.includes(null) && ticket.length > 2) {  
            const correctAnswers = userAnswerFlags.reduce((sum, num) => sum + num, 0);
            localStorage.setItem('readyTicket', JSON.stringify(ticket));
            localStorage.setItem('correctAnswers', correctAnswers);
            return navigate('/result');
        }
    }, [ticket, userAnswerFlags, navigate]);

    return (
        <div className={`${s.divWrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.divWrapperContent} ${s[ModeStorage.theme]}`}>
                <Header />
                <NavOfQuestion
                    ticket={ticket}
                    userAnswerFlags={userAnswerFlags}
                    indexTicket={indexTicket}
                    setIndexTicket={setIndexTicket}
                />
                <Timer ticket={ticket} userAnswerFlags={userAnswerFlags} />
                <Question
                    ticket={ticket}
                    userAnswerFlags={userAnswerFlags}
                    indexTicket={indexTicket}
                    setTicket={setTicket}
                    setUserAnswerFlags={setUserAnswerFlags}
                    setIndexTicket={setIndexTicket}
                />
                <StepBtns ticket={ticket} userAnswerFlags={userAnswerFlags} indexTicket={indexTicket} setIndexTicket={setIndexTicket} />
            </div>
        </div>
    );
}

export default observer(Testing);
