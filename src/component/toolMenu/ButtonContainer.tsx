
import "./index.css"
import {ExpandArrowIcon} from "@/component/toolMenu/ExpandArrowIcon.tsx";
interface IProps{
    noneExpand?:boolean;
    children:any;
    onClick?:any;
    isSelected?:boolean
}
export const ButtonContainer =({children,noneExpand,onClick,isSelected}:IProps)=>{

    const click=()=> {
        if(onClick){
            onClick();
        }
    }

    const cln=isSelected?"button-container button-container-selected":"button-container";

    return (
        <div className={cln} onClick={click}>
            <div className="button-icon">
                {children}
            </div>
            {!noneExpand && <ExpandArrowIcon/>}
        </div>

    )

}