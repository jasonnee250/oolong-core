import "./index.css"

interface IProp {
    btnText?: string;
    className?: string;
    icon?:any;
    onClick?:any;
}

export const BaseButton = ({btnText, className,icon,onClick}: IProp) => {

    let btnClassName = 'base-button';
    if (className) {
        btnClassName = btnClassName + " " + className
    }
    return (
        <button className={btnClassName} onClick={onClick}>
            {icon && icon}
            {btnText && btnText}
        </button>
    )
}