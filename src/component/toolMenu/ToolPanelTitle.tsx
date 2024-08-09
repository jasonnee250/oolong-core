import "./index.css"

interface IProps{
    title:string;
}
export const ToolPanelTitle = ({title}:IProps) => {
    return <div className={"border-panel-title"}>{title}</div>
}