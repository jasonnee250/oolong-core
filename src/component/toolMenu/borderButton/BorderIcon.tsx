import "./index.css"
interface IProps{
    color:string;
}
export const BorderIcon = ({color}:IProps) => {
    return <div className="border-button" style={{borderColor:color}}/>
}