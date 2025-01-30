import s from '../StyleComponets/registration.module.css';
function InputFieldReg({ value, i, text, type, regexp, err, isCorrect, setFormData }) {
    
    return (
        <div className={s.wrapperDiv}>
            <label className={`${s.wrapperInput} ${isCorrect ? s.highlightingInput : ''}`}>
                {text}
                <input
                    value={value}
                    onChange={e => {
                        const newRegExp = new RegExp(regexp);
                        
                        setFormData(prev =>
                            prev.map((obj, index) =>
                                index === i
                                    ? {
                                          ...obj,
                                          value: e.target.value,
                                          isCorrect: e.target.value === '' ? false : !newRegExp.test(e.target.value),
                                      }
                                    : obj,
                            ),
                        );
                    }}
                    className={s.input}
                    type={type}
                    autoComplete='off'
                />
            </label>
            <span className={s.highlightingTextErr}>{isCorrect && err}</span>
        </div>
    );
}

export default InputFieldReg;
