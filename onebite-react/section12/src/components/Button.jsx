import "./Button.css";

const button = ({text, type, onClick}) => {
    return <button onClick={onClick} className={`Button Button_${type}`}>{text}</button>
};

export default button;