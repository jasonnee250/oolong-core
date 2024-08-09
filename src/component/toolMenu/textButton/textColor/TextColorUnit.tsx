import TextPropIcon from '@/resource/icons/TextColor.svg?react'
import EmptyTextIcon from '@/resource/icons/textButton/emptyText.svg?react'
import "./index.css"
interface IProps {
    color: string;
    click?:(color:string)=>void;
    isSelected?:boolean;
}

export const TextColorUnit = ({color,click,isSelected}: IProps) => {

    const onClick=()=>{
        if(click){
            click(color);
        }
    }

    const cln=isSelected?
        "text-color-unit text-color-unit-selected":"text-color-unit"
    return (
            <div className={cln} onClick={onClick}>
                {color === "#ffffff" ? <EmptyTextIcon/> : <TextPropIcon style={{color}}/>}
            </div>
    )
}