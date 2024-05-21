import React from 'react';
import NavOfQuestion from './NavOfQuestion/NavOfQuestion.jsx';
import Question from './Question/Question.jsx';
import StepBtns from './StepBtns/StepBtns.jsx';
import s from './testing.module.css';
import Header from '../Header/Header.jsx';
import ModeStorage from '../store/ModeStorage.js';
import { observer } from 'mobx-react-lite';

//import Timer from './Timer.jsx';

function Testing() {
    const [ticket, setTicket] = React.useState([{ question: '', answers: [], img: '' }]);
    const [indexTicket, setIndexTicket] = React.useState(0);
    const [userAnswerFlags, setUserAnswerFlags] = React.useState([]);

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

    return (
        <div className={`${s.divWrapper} ${s[ModeStorage.theme]}`}>
            <div className={`${s.divWrapperContent} ${s[ModeStorage.theme]}`}>
                <Header />
                <NavOfQuestion ticket={ticket} userAnswerFlags={userAnswerFlags} indexTicket={indexTicket} setIndexTicket={setIndexTicket} />
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
