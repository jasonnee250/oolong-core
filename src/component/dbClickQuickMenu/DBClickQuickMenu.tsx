import {MenuType} from "@/store/reducer/ToolMenuStateReducer";
import {ShapePanel} from "@/component/toolBar/shape/ShapePanel";
import {changeShapeConfig} from "@/component/toolBar/shape/shapeConfig";
import {ToolEnum} from "@/tool/ToolEnum";
import {useAppSelector} from "@/store/hooks";
import {OolongApp} from "@/app/OolongApp";
import {OolongShapeType} from "@/graphics/OolongShapeType.ts";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {DefaultBorderColorShape, DefaultColorShape} from "@/interact/default/create/CreateColorConfig.ts";
import {Point, TextAlignType} from "dahongpao-core";
import {StartLog} from "@/action/log/common/StartLog.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {EndLog} from "@/action/log/common/EndLog.ts";
import {SelectNodeLog} from "@/action/log/node/SelectNodeLog.ts";
import "./index.css"

interface IProps {
    oolongApp: OolongApp;
}

export const DBClickQuickMenu = ({oolongApp}: IProps) => {

    const toolMenuInfo = useAppSelector((state) => state.toolMenuState.info);


    const click = (type: OolongShapeType,event:PointerEvent) => {
        const nodeId = IdGenerator.genId(OolongNodeType.Shape);
        const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId, type);

        const width = 100;
        const height = 100;
        const clientPoint = new Point(
            toolMenuInfo.x,
            toolMenuInfo.y
        );
        const globalPoint=oolongApp.application.gmlRender.transformToGlobal(clientPoint);
        nodeDO.color = DefaultColorShape[type] || "#ffffff";
        nodeDO.borderColor = DefaultBorderColorShape[type] || "#000000";
        nodeDO.borderWidth = 2;
        nodeDO.zIndex = IdGenerator.genZIndex();
        nodeDO.x = globalPoint.x-0.5*width;
        nodeDO.y = globalPoint.y-0.5*height;
        nodeDO.w = width;
        nodeDO.h = height;
        nodeDO.horizonAlign = TextAlignType.CENTER;
        nodeDO.verticalAlign = TextAlignType.CENTER;
        oolongApp.actionManager.execAction(new StartLog());
        const addLog = new AddNodeLog(nodeDO);
        oolongApp.actionManager.execAction(addLog);
        oolongApp.actionManager.execAction(new SelectNodeLog([nodeId]));
        oolongApp.actionManager.execAction(new EndLog());

    }

    const style = {
        left: toolMenuInfo.x + "px",
        top: toolMenuInfo.y + "px",
    }

    return (
        <>
            {
                toolMenuInfo.menuType === MenuType.DbClickQuickMenu &&
                <div className={"db-quick-menu"} style={style}>
                    <ShapePanel
                        shapeConfig={changeShapeConfig}
                        currentTool={ToolEnum.SHAPE}
                        cLick={click}/>

                </div>
            }
        </>
    )
}