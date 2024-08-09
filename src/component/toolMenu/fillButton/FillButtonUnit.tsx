import "@/component/toolMenu/index.css"
import {ToolItemDiv} from "@/component/toolMenu/ToolItemDiv.tsx";
import EmptyFillIcon from '@/resource/icons/EmptyFillIcon.svg?react'

interface IProp {
    color: string;
    isSelected?: boolean;
    onClick?: any;
    onMouseEnter?: any;
    onMouseLeave?: any
}

export const FillButtonUnit = ({color,isSelected, onClick, onMouseEnter, onMouseLeave}: IProp) => {

    const styleProp = {
        backgroundColor: color,
    }

    const clickColor = () => {
        onClick && onClick(color);
    }

    // const cname=["fill-button",className].join(" ");

    const mouseEnter = () => {
        onMouseEnter && onMouseEnter(color);
    }
    const mouseLeave = () => {
        onMouseLeave && onMouseLeave();
    }

    return (
        <ToolItemDiv onClick={clickColor} isSelected={isSelected} dark={color==="#000000"}>
            {color === "none" ?
                <EmptyFillIcon/>
                : <div className="fill-button"
                       style={styleProp}
                       onMouseLeave={mouseLeave}
                       onMouseEnter={mouseEnter}
                />
            }
        </ToolItemDiv>

    )
}