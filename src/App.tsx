import './index.css'
import {CanvasContainer} from "@/component/canvas/CanvasContainer.tsx";
import {ToolBar} from "@/component/toolBar/ToolBar.tsx";
import {OolongApp} from "@/app/OolongApp.ts";
import React, {MouseEvent, useEffect, useMemo, useState} from "react";
import store from "@/store/RootStore.ts";
import {updateBackgroundColor, updateDocMode, updateTool} from "@/store/reducer/GlobalStateReducer.ts";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {CanvasInput} from "@/component/canvasInput/CanvasInput.tsx";
import {ToolMenu} from "@/component/toolMenu/ToolMenu.tsx";
import {PopMenu} from "@/component/popMenu/PopMenu.tsx";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {RightBottomTool} from "@/component/rightBottomTool/RightBottomTool.tsx";
import {OolongModal} from "@/component/modal/OolongModal.tsx";
import {QuickMenu} from "@/component/quickMenu/QuickMenu.tsx";
import {DBClickQuickMenu} from "@/component/dbClickQuickMenu/DBClickQuickMenu.tsx";

export const App = () => {

    const mainApp = useMemo(()=>new OolongApp(),[]);

    const [modalShow,setModalShow]=useState(false);
    const [offlineData,setOfflineData]=useState(null);
    const [remoteSeq,setRemoteSeq]=useState(0);

    useEffect(() => {
        mainApp.start();

        return () => {
            mainApp.stop();
            // window.removeEventListener("onbeforeunload",unloadToast);
        }

    }, []);

    const onClick=(event:MouseEvent)=>{
        const canvasDomList=document.getElementsByClassName('normal-canvas');
        if(canvasDomList && canvasDomList.length>0 && event.target===canvasDomList[0]){
            return;
        }
        store.dispatch(updateTool({tool:ToolEnum.DEFAULT,shapeType:OolongShapeType.Rect}));
        mainApp.toolManager.setCurrentTool(ToolEnum.DEFAULT);
    }

    return (

            <div className='app'>
                <OolongModal oolongApp={mainApp} setShow={setModalShow} show={modalShow} offlineData={offlineData} seq={remoteSeq}/>
                <ToolBar oolongApp={mainApp}/>
                <ToolMenu oolongApp={mainApp}/>
                <PopMenu oolongApp={mainApp}/>
                <QuickMenu oolongApp={mainApp}/>
                <DBClickQuickMenu oolongApp={mainApp}/>
                <RightBottomTool oolongApp={mainApp}/>
                <CanvasContainer
                    gmlRender={mainApp.application.gmlRender}
                    pageGmlRender={mainApp.pageManager.pageApplication.gmlRender}
                    auxiliaryGmlRender={mainApp.auxiliaryApplication.gmlRender}
                />
                <CanvasInput inputManager={mainApp.inputManager} auxiliaryApp={mainApp.auxiliaryApplication}/>
            </div>
    )
}

// export const App=React.memo(BaseApp);