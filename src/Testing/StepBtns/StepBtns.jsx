import s from './stepBtns.module.css';
function StepBtns({ ticket, userAnswerFlags, indexTicket, setIndexTicket }) {
    
    function nextQuestion() {
        let step = indexTicket;

        step++;
        while (userAnswerFlags[step] !== null) {
            step++;
            if (step === ticket.length) step = 0;
        }
        return setIndexTicket(step);
    }

    function prevQuestion() {
        let step = indexTicket;

        step--;
        if (step === -1) step = ticket.length - 1;
        while (userAnswerFlags[step] !== null) {
            step--;
            if (step === -1) step = ticket.length - 1;
        }
        return setIndexTicket(step);
    }

    return (
        <div className={s.divWrapperBtns}>
            <button className={s.btn} onClick={prevQuestion} type='button'>
                Предыдущий вопрос
            </button>
            <button className={s.btn} onClick={nextQuestion} type='button'>
                Следующий вопрос
            </button>
        </div>
    );
}

export default StepBtns;
