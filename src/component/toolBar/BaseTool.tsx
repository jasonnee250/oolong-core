import "./index.css"

interface IProp{
    selected:boolean;
    children:any;
    onClick?:any;
}
export const BaseTool = ({selected,children,onClick}:IProp) => {

    let clName="base-tool";
    if(selected){
        clName+=" base-tool-selected";
    }

    return <div className={clName} onClick={onClick}>
        {children}
    </div>
}