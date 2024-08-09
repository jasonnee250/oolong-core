import {DHPCanvas} from "dahongpao-canvas";
import './index.css'
import {GMLRender} from "dahongpao-core/dist/render/GMLRender";
import {useAppSelector} from "@/store/hooks.ts";
import {DocMode} from "@/file/DocSettingDO.ts";

interface IProps {
    gmlRender: GMLRender;
    pageGmlRender: GMLRender;
    auxiliaryGmlRender: GMLRender;
}

export const CanvasContainer = ({gmlRender, pageGmlRender, auxiliaryGmlRender}: IProps) => {

    const backgroundColor = useAppSelector((state) => state.globalState.backgroundColor);

    const style={
        backgroundColor,
    }
    return (
        <div className='canvas-container'>
            <div className='auxiliary-canvas'>
                <DHPCanvas gmlRender={auxiliaryGmlRender}/>
            </div>
            <div className='content-canvas'>
                <DHPCanvas gmlRender={gmlRender}/>
            </div>
            <div className='page-canvas' style={style}>
                <DHPCanvas gmlRender={pageGmlRender}/>
            </div>
        </div>
    )

}