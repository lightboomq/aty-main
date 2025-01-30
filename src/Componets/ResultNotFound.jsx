
import s from '../StyleComponets/resultNotFound.module.css';
function ResultNotFound() {
    return (
        <div className={s.wrapper}>
            <p>К сожалению ничего не найдено...
              <br />
              Необходимо искать вопрос на который вы дали ответ.
            </p>
        </div>
    );
}

export default ResultNotFound;
