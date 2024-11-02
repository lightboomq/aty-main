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
    const [userAnswers, setUserAnswers] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        function getTicketFromLocaleStorage() {
            const localeStorageTicket = JSON.parse(localStorage.getItem('ticketJson'));
            const flags = [];
            for (let i = 0; i < localeStorageTicket.length; i++) {
                flags.push(null);
            }
            setUserAnswers([...flags]);
            setTicket(localeStorageTicket);
        }
        getTicketFromLocaleStorage();
    }, []);
   
    React.useEffect(() => {
        if (!userAnswers.includes(null) && ticket.length > 2) {
            const correctAnswers = userAnswers.reduce((sum, num) => sum + num, 0);
            localStorage.setItem('readyTicket', JSON.stringify(ticket));
            localStorage.setItem('correctAnswers', correctAnswers);
            return navigate('/result');
        }
    }, [ticket, userAnswers, navigate]);

    return (
        <div className={`${s.divWrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.divWrapperContent} ${s[ModeStorage.theme]}`}>
                <Header />
                <NavOfQuestion ticket={ticket} userAnswers={userAnswers} indexTicket={indexTicket} setIndexTicket={setIndexTicket} />
                <Timer ticket={ticket} userAnswers={userAnswers} />
                <Question
                    ticket={ticket}
                    userAnswers={userAnswers}
                    indexTicket={indexTicket}
                    setTicket={setTicket}
                    setUserAnswers={setUserAnswers}
                    setIndexTicket={setIndexTicket}
                />
                <StepBtns ticket={ticket} userAnswers={userAnswers} indexTicket={indexTicket} setIndexTicket={setIndexTicket} />
            </div>
        </div>
    );
}

export default observer(Testing);
