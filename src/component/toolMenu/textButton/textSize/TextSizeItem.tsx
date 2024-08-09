import "./index.css"

interface IProps{
    title:string;
    click?:any;
    selected?:boolean;
}
export const TextSizeItem = ({title,click,selected}:IProps) => {

    const onClick=()=>{
        if(click){
            click();
        }
    }

    const cln=()=>{
        if(selected){
            return "text-size-item text-size-item-selected"
        }
        return "text-size-item";
    }

    return <div className={cln()} onClick={onClick}>
        {title}
    </div>
}