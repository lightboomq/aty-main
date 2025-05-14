import s from '../StyleComponets/loader.module.css';

function Loader({ color, width, height, positionRight }) {
    return (
        <span
            className={s.loader}
            width={width}
            height={height}
            style={{
                border: `5px dotted ${color}`,
                width: `${width}px`,
                height: `${height}px`,
                right: positionRight
            }}
        >
            {' '}
        </span>
    );
}

export default Loader;
