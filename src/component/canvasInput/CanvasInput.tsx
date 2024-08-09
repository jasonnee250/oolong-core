import "./index.css"
import {useEffect, useRef} from "react";
import {InputManager} from "@/text/input/InputManager.ts";
import {Application} from "dahongpao-canvas";
interface IProp{
    inputManager:InputManager,
    auxiliaryApp:Application,
}
export const CanvasInput = ({inputManager,auxiliaryApp}:IProp) => {

    const ref=useRef();
    const renderRef=useRef();

    useEffect(() => {
        if(ref.current){
            inputManager.init(ref.current,auxiliaryApp,renderRef.current);
        }
    }, [ref]);

    return (
        <>
            <div ref={renderRef} className='render-input'/>
            <input ref={ref} className='canvas-input'/>
        </>
    )
}

