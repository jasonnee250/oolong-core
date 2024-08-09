import '@/component/toolBar/index.css'
import {ToolEnum} from "@/tool/ToolEnum.ts";
import {useRef} from "react";
import ImageIcon from '@/resource/icons/ImageIcon.svg?react'
import {BaseTool} from "@/component/toolBar/BaseTool.tsx";
import "../index.css"
import {Tooltip} from "antd";
import {IdGenerator} from "@/utils/IdGenerator.ts";
import {OolongNodeType} from "@/graphics/OolongNodeType.ts";
import {Point} from "dahongpao-core";
import {generateDefaultNodeDO, OolongNodeDO} from "@/file/OolongNodeDO.ts";
import {AddNodeLog} from "@/action/log/node/AddNodeLog.ts";
import {OolongApp} from "@/app/OolongApp.ts";
import {OolongSVGUtils} from "@/graphics/OolongSVGUtils.ts";

interface IProp {
    oolongApp:OolongApp;
    clickCb: (tool: ToolEnum) => void;
}

export const ImageTool = ({clickCb,oolongApp}: IProp) => {

    const inputRef=useRef();
    const onClick = () => {
        clickCb(ToolEnum.IMAGE);
        inputRef.current?.click();
    }

    const upload=(event:any)=>{
        const files=event.target.files;
        const file=files[0] as File;
        const viewBounds=oolongApp.application.gmlRender.getViewPortBounds();
        const centerPoint=new Point(0.5*(viewBounds.minX+viewBounds.maxX),
            0.5*(viewBounds.minY+viewBounds.maxY));
        if(file.type==="image/svg+xml"){
            file.text().then(p=>{
                const svgInfo=OolongSVGUtils.trimSvgCode(p);
                const nodeId=IdGenerator.genId(OolongNodeType.SVG);
                const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId);
                nodeDO.type=OolongNodeType.SVG;
                nodeDO.zIndex = IdGenerator.genZIndex();
                nodeDO.x = centerPoint.x;
                nodeDO.y = centerPoint.y;
                nodeDO.w=svgInfo.width;
                nodeDO.h=svgInfo.height;
                nodeDO.svgCode=svgInfo.svgCode;
                const addLog=new AddNodeLog(nodeDO);
                oolongApp.actionManager.execAction(addLog);
            });
            return;
        }
        const blob=new Blob([file]);
        const nodeId=IdGenerator.genId(OolongNodeType.IMG);
        oolongApp.imageManager.uploadBlobImg(nodeId,blob)
            .then((url)=>{
                const nodeDO: OolongNodeDO = generateDefaultNodeDO(nodeId);
                nodeDO.type=OolongNodeType.IMG;
                nodeDO.zIndex = IdGenerator.genZIndex();
                nodeDO.x = centerPoint.x;
                nodeDO.y = centerPoint.y;
                nodeDO.w=100;
                nodeDO.h=100;
                nodeDO.imgSrc=url;
                const addLog=new AddNodeLog(nodeDO);
                oolongApp.actionManager.execAction(addLog);
            });

    }



    return (
        <Tooltip title="图片" mouseEnterDelay={0.3}>
            <div>
                <BaseTool selected={false} onClick={onClick}>
                    <input className='file-upload'
                           type='file'
                           accept="image/gif,image/jpg,image/jpeg,image/png,image/svg+xml"
                           multiple={true}
                           ref={inputRef}
                           onChange={upload}
                    />
                    <ImageIcon/>
                </BaseTool>
            </div>
        </Tooltip>
    )
}