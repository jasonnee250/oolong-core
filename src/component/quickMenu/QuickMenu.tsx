import {useAppSelector} from "@/store/hooks";
import {MenuType} from "@/store/reducer/ToolMenuStateReducer";
import {OolongApp} from "@/app/OolongApp.ts";
import {changeShapeConfig} from "@/component/toolBar/shape/shapeConfig.tsx";
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {ShapePanel} from "@/component/toolBar/shape/ShapePanel.tsx";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {DefaultBorderColorShape, DefaultColorShape} from "@/interact/default/create/CreateColorConfig.ts";
import {TextAlignType} from "dahongpao-core";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {AddLinkLog, LinkEndType} from "@/action/log/line/AddLinkLog.ts";
import {OolongLinkInfo} from "@/graphics/OolongLinkLine.ts";
import {ConnectorPoint, NodeSideEnum} from "@/graphics/ConnectorPoint.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import "./index.css"
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";

interface IProps {
    oolongApp: OolongApp;
}

export const QuickMenu = ({oolongApp}: IProps) => {

    const toolMenuInfo = useAppSelector((state) => state.toolMenuState.info);

    const click = (type: OolongShapeType) => {

        const selectNodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
        if(selectNodes.size!==1){
            return;
        }
        const selectNode=[...selectNodes][0];
        if(!(selectNode instanceof OolongLine)){
            return;
        }
        const selectLine=selectNode as OolongLine;
        const points=selectLine.points;
        const endPoint=points[points.length-1];
        const prevEndPoint=points[points.length-2];

        const nodeManager=oolongApp.application.nodeManager as OolongNodeManager;
        const linkLineInfo=nodeManager.oolongLinkMap.get(selectLine.id);
        let width=100;
        let height=100;
        if(linkLineInfo && linkLineInfo.start){
            const node=nodeManager.nodeMap.get(linkLineInfo.start.id);
            if(node){
                width=node.w;
                height=node.h;
            }
        }

        const isHorizon=InteractiveUtils.judgeHorizon(endPoint,prevEndPoint);
        const nodeSide=isHorizon?
            (endPoint.x>prevEndPoint.x?NodeSideEnum.LEFT:NodeSideEnum.RIGHT)
            :
            (endPoint.y>prevEndPoint.y?NodeSideEnum.TOP:NodeSideEnum.BOTTOM);

        const nodeId=IdGenerator.genId(OolongNodeType.Shape);
        const shapeType=type;
        const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId,shapeType as OolongShapeType);
        nodeDO.color=DefaultColorShape[shapeType]||"#ffffff";
        nodeDO.borderColor=DefaultBorderColorShape[shapeType]||"#000000";
        nodeDO.borderWidth=2;
        nodeDO.zIndex = IdGenerator.genZIndex();
        if(nodeSide===NodeSideEnum.TOP){
            nodeDO.x = endPoint.x-0.5*width;
            nodeDO.y = endPoint.y;
        }else if(nodeSide===NodeSideEnum.BOTTOM){
            nodeDO.x = endPoint.x-0.5*width;
            nodeDO.y = endPoint.y-height;
        }else if(nodeSide===NodeSideEnum.RIGHT){
            nodeDO.x = endPoint.x-width;
            nodeDO.y = endPoint.y-0.5*height;
        }else{
            nodeDO.x = endPoint.x;
            nodeDO.y = endPoint.y-0.5*height;
        }
        nodeDO.w=width;
        nodeDO.h=height;
        nodeDO.horizonAlign=TextAlignType.CENTER;
        nodeDO.verticalAlign=TextAlignType.CENTER;

        oolongApp.actionManager.execAction(new StartLog());
        const addLog=new AddNodeLog(nodeDO);
        oolongApp.actionManager.execAction(addLog);
        const connectPoint=new ConnectorPoint(endPoint,0,0.5,nodeSide);
        if(nodeSide===NodeSideEnum.TOP){
            connectPoint.xPos=0.5;
            connectPoint.yPos=0;
        }else if(nodeSide===NodeSideEnum.BOTTOM){
            connectPoint.xPos=0.5;
            connectPoint.yPos=1;
        }else if(nodeSide===NodeSideEnum.RIGHT){
            connectPoint.xPos=1;
            connectPoint.yPos=0.5;
        }
        oolongApp.actionManager.execAction(new AddLinkLog(
            selectLine.id,LinkEndType.End,
            new OolongLinkInfo(nodeId, connectPoint)
            )
        );
        oolongApp.actionManager.execAction(new SelectNodeLog([nodeId]));
        oolongApp.actionManager.execAction(new EndLog());
    }

    const style = {
        left: toolMenuInfo.x + "px",
        top: toolMenuInfo.y + "px",
    }


    return (
        <>
            {toolMenuInfo.menuType === MenuType.QuickMenu &&
                <div className={"quick-menu"} style={style}>
                    <ShapePanel
                        shapeConfig={changeShapeConfig}
                        currentTool={ToolEnum.SHAPE}
                        cLick={click}/>

                </div>}

        </>
    )
}