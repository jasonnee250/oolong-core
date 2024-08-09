import {AbsMainMode} from "dahongpao-canvas";
import {EventContext, InteractiveEvent} from "dahongpao-canvas";
import {DragMode} from "@/interact/default/drag/DragMode";
import {CreateRectMode} from "@/interact/default/create/CreateRectMode.ts";
import {DefaultClickMode} from "@/interact/default/click/DefaultClickMode.ts";
import {NormalMode} from "@/interact/default/normal/NormalMode.ts";
import {DragSelectTextMode} from "@/interact/default/dragSelectText/DragSelectTextMode.ts";
import {StretchMode} from "@/interact/default/stretch/StretchMode.ts";
import {GroupMode} from "@/interact/default/group/GroupMode.ts";
import {DefaultDbClickMode} from "@/interact/default/dbClick/DefaultDbClickMode.ts";
import {CreateLineMode} from "@/interact/default/create/CreateLineMode.ts";
import {DragLinePointMode} from "@/interact/default/dragLinePoint/DragLinePointMode.ts";
import {DragCurvePointMode} from "@/interact/default/dragLinePoint/DragCurvePointMode.ts";
import {DragLineEndMode} from "@/interact/default/lineEnd/DragLineEndMode.ts";
import {ConnectLineMode} from "@/interact/default/connectLine/ConnectLineMode.ts";
import {CreateTextMode} from "@/interact/default/create/CreateTextMode.ts";
import {RotateMode} from "@/interact/default/rotate/RotateMode.ts";
import {SingleStretchMode} from "@/interact/default/stretch/SingleStretchMode.ts";

export class DefaultMode extends AbsMainMode{

    constructor() {
        super([
            /** 创建相关交互 */
            new CreateRectMode(),
            new CreateLineMode(),
            new CreateTextMode(),
            /** 连线相关交互 */
            new DragCurvePointMode(),
            new DragLinePointMode(),
            new DragLineEndMode(),
            new ConnectLineMode(),
            /** 拖选文字相关交互 */
            new DragSelectTextMode(),
            /** 节点相关交互 */
            new SingleStretchMode(),
            new StretchMode(),
            new RotateMode(),
            new DragMode(),
            /** 框选相关交互 */
            new GroupMode(),
            /** 点击相关交互 */
            new DefaultDbClickMode(),
            new DefaultClickMode(),
            /** 缺省交互 */
            new NormalMode(),
        ]);
    }
    canBeEnable(_event: InteractiveEvent, _ctx: EventContext): boolean {
        return true;
    }
    canBeExit(event: InteractiveEvent, ctx: EventContext): boolean {
        return this.currentSubMode.canBeExit(event,ctx);
    }

    /** 当前模式执行之后判断要不要退出该模式 */
    work(event:InteractiveEvent,ctx:EventContext):void{
        this.detect(event,ctx);
        this.currentSubMode.work(event, ctx);
    }

    detect(event:InteractiveEvent,ctx:EventContext):void{
        /** 当前子模式不能退出，仍在当前子模式下执行事件 */
        if(!this.currentSubMode.canBeExit(event, ctx)){
            return;
        }
        /** 当前子模式能退出，重新寻找能够执行的子模式 */
        for(const submode of this.subModes){
            if(submode.canBeEnable(event,ctx)){
                this.currentSubMode=submode;
                return;
            }
        }
    }

}