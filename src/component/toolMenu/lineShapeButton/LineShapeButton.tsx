import {ButtonContainer} from "@/component/toolMenu/ButtonContainer";
import {Popover} from "antd";
import {OolongApp} from "@/app/OolongApp";
import {OolongLineType} from "@/graphics/OolongLineType";
import {changeLineConfig, lineConfig} from "@/component/toolBar/line/lineConfig";
import {ToolEnum} from "@/tool/ToolEnum";
import {LinePanel} from "@/component/toolBar/line/LinePanel";
import {OolongLineDO} from "@/file/OolongLineDO";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {InteractiveUtils} from "@/interact/InteractiveUtils.ts";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {GraphicNode} from "dahongpao-core";
import {LineLayoutWorker} from "@/interact/default/connectLine/layout/LineLayoutWorker.ts";
import {MIXED_PROP} from "@/select/view/SelectViewProps.ts";
import LineIcon from '@/resource/icons/LineTool.svg?react';
import {StartLog} from "@/action/log/common/StartLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";

interface IProps{
    oolongApp:OolongApp;
    shapeType:OolongLineType|MIXED_PROP;
}
export const LineShapeButton = ({oolongApp,shapeType}:IProps) => {

    const showIcon = () => {
        if(shapeType===MIXED_PROP){
            return <LineIcon/>;
        }
        const res = lineConfig.filter(p => p.shape === shapeType);
        return res[0].icon;
    }
    const shapeIcon = showIcon();

    const click=(shape:OolongLineType)=>{
        const nodes=oolongApp.auxiliaryManager.selectManager.selectNodes;
        if(nodes.size===0){
            return;
        }
        oolongApp.actionManager.execAction(new StartLog());
        for(const node of nodes){
            if(node instanceof OolongLine){
                const updateData:Partial<OolongLineDO>={
                    id:node.id,
                    shapeType:shape,
                }
                let points=node.points;
                const oolongNodeManager=oolongApp.application.nodeManager as OolongNodeManager;

                const linkLineInfo=oolongNodeManager.oolongLinkMap.get(node.id);

                if(shape===OolongLineType.PolyLine){
                    if(linkLineInfo){
                        let startNode:GraphicNode|undefined;
                        let endNode:GraphicNode|undefined;
                        if(linkLineInfo.start){
                            startNode=oolongNodeManager.nodeMap.get(linkLineInfo.start.id);
                        }
                        if(linkLineInfo.end){
                            endNode=oolongNodeManager.nodeMap.get(linkLineInfo.end.id);
                        }
                        if(startNode && endNode){
                            points=LineLayoutWorker.getInstance().layout(linkLineInfo.start!.connectPoint,
                                linkLineInfo.end!.connectPoint,startNode,endNode);
                        }else if(startNode){
                            points=LineLayoutWorker.getInstance().layoutFreeEndPoint(linkLineInfo.start!.connectPoint,
                                points[points.length-1],startNode);
                        }else if(endNode){
                            points=LineLayoutWorker.getInstance().layoutFreeStartPoint(points[0],
                                linkLineInfo.end!.connectPoint,endNode);
                        }else{
                            points=InteractiveUtils.layout(points[0],points[points.length-1]);
                        }
                    }else{
                        points=InteractiveUtils.layout(points[0],points[points.length-1]);
                    }
                }else if(shape===OolongLineType.Curve){
                    points=InteractiveUtils.curveLayout(points[0],points[points.length-1]);
                }else{
                    points=[points[0],points[points.length-1]];
                }
                updateData.points=points;
                const updateLog=new UpdateLineLog(updateData);
                oolongApp.actionManager.execAction(updateLog);
            }
        }
        oolongApp.actionManager.execAction(new EndLog());

    }

    const panel=<LinePanel lineConfig={changeLineConfig} shapeType={shapeType} currentTool={ToolEnum.LINE} click={click}/>

    return (
        <Popover placement={"top"}
                 content={panel}
                 trigger="click"
        >
            <div>
                <ButtonContainer>
                    {shapeIcon}
                </ButtonContainer>
            </div>
        </Popover>
    )
}