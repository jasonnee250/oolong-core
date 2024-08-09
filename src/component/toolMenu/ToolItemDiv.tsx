import "./index.css"
import Check from '@/resource/icons/check.svg?react';

interface IProps{
    isSelected?:boolean;
    children?:any;
    onClick?:any;
    dark?:boolean
}
export const ToolItemDiv = ({isSelected,children,onClick,dark}:IProps) => {


    return (
        <div className="tool-item-div" onClick={onClick}>
            {children}
            {isSelected && <Check style={{
                position: "absolute",width: "22px",height: "22px",
                color:dark?"#ffffff":"#000000"
            }}/>}
            {/*<div className="hover-button"/>*/}
        </div>
    )
}