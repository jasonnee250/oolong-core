import "./index.css"

interface IProp {
    radius: number;
    onClick: any;
    isSelected?:boolean;
}

export const BorderWidthUnit = ({radius, onClick,isSelected}: IProp) => {

    const style = {
        width: 2 * radius,
        height: 2 * radius,
        borderRadius: radius,
        backgroundColor:isSelected?"#95B2F6":"#d8d8d8"
    }

    const click = () => {
        onClick && onClick(radius);
    }

    return (
        <div className="border-width-unit" onClick={click}>
            <div style={style} />
        </div>
    )
}