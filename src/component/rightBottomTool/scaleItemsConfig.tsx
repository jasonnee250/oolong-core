import "./index.css"

interface IScaleItemProp{
    scale:string;
    onClick?:any;
}
const ScaleItem=({scale,onClick}:IScaleItemProp)=>{
    return (
        <div className='rb-scale' onClick={onClick}>
            {scale}
        </div>
        )

}

export const scaleItemsConfig =(onClick:any)=>   [
    {
        key: '1',
        label: <ScaleItem scale="400%" onClick={()=>onClick(8)}/>,
    },
    {
        key: '2',
        label: <ScaleItem scale="200%" onClick={()=>onClick(4)}/>,
    },
    {
        key: '3',
        label: <ScaleItem scale="150%" onClick={()=>onClick(3)}/>,
    },
    {
        key: '4',
        label: <ScaleItem scale="100%" onClick={()=>onClick(2)}/>,
    },
    {
        key: '5',
        label: <ScaleItem scale="50%" onClick={()=>onClick(1)}/>,
    },
]