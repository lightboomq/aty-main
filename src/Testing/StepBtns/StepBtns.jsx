import s from './stepBtns.module.css';
function StepBtns({ ticket, userAnswerFlags, indexTicket, setIndexTicket }) {
    function scrollNav(step) {
        const navOl = document.getElementById('navOl');
        const navLi = document.getElementById(step);

        navOl.scrollBy({
            top: 0,
            left: navLi.getBoundingClientRect().right - 160,
            behavior: 'smooth',
        });
    }

    function nextQuestion() {
        let step = indexTicket;

        step++;
        
        if (step === ticket.length) {
            step = userAnswerFlags.indexOf(null);
        }
        
        console.log('step: ', step)
        if (userAnswerFlags[step] !== null) {
            console.log('lenght: ', ticket.length-1);
            console.log('step: ', step);
            console.log(step === ticket.lenght - 1)
            step = userAnswerFlags.indexOf(null, step === ticket.lenght - 1 ? 0 : step);
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
        scrollNav(step);
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
