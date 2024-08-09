import {AbsActionExecutor} from "@/action/executor/AbsActionExecutor";
import {FocusTextExecutor} from "@/action/executor/text/FocusTextExecutor";
import {EditTextExecutor} from "@/action/executor/text/EditTextExecutor";
import {MoveCursorTextExecutor} from "@/action/executor/text/MoveCursorTextExecutor";
import {DeleteTextExecutor} from "@/action/executor/text/DeleteTextExecutor.ts";
import {AddExecutor} from "@/action/executor/node/AddExecutor.ts";
import {RemoveExecutor} from "@/action/executor/node/RemoveExecutor.ts";
import {UpdateExecutor} from "@/action/executor/node/UpdateExecutor.ts";
import {StartExecutor} from "@/action/executor/common/StartExecutor.ts";
import {EndExecutor} from "@/action/executor/common/EndExecutor.ts";
import {SelectNodeExecutor} from "@/action/executor/node/SelectNodeExecutor.ts";
import {EditCharPropExecutor} from "@/action/executor/text/EditCharPropExecutor.ts";
import {TextParagraphPropExecutor} from "@/action/executor/text/TextParagraphPropExecutor.ts";
import {TextParagraphListExecutor} from "@/action/executor/text/TextParagraphListExecutor.ts";
import {MoveNodeExecutor} from "@/action/executor/node/MoveNodeExecutor.ts";
import {AddLineExecutor} from "@/action/executor/line/AddLineExecutor.ts";
import {UpdateLineExecutor} from "@/action/executor/line/UpdateLineExecutor.ts";
import {AddLinkExecutor} from "@/action/executor/line/AddLinkExecutor.ts";
import {RemoveLinkExecutor} from "@/action/executor/line/RemoveLinkExecutor.ts";

export const actionExecutors:AbsActionExecutor[]=[
    new FocusTextExecutor(),
    new EditTextExecutor(),
    new EditCharPropExecutor(),
    new TextParagraphPropExecutor(),
    new TextParagraphListExecutor(),
    new DeleteTextExecutor(),
    new MoveCursorTextExecutor(),
    new AddLineExecutor(),
    new AddExecutor(),
    new RemoveExecutor(),
    new UpdateExecutor(),
    new UpdateLineExecutor(),
    new AddLinkExecutor(),
    new RemoveLinkExecutor(),
    new MoveNodeExecutor(),
    new SelectNodeExecutor(),
    new StartExecutor(),
    new EndExecutor(),
]