import {ClickProcessor} from "dahongpao-canvas";
import {DbClickEditTextHandler} from "@/interact/default/dbClick/handler/DbClickEditTextHandler";
import {DbClickEditNodeTextHandler} from "@/interact/default/dbClick/handler/DbClickEditNodeTextHandler.ts";
import {DbClickQuickCreateHandler} from "@/interact/default/dbClick/handler/DbClickQuickCreateHandler.ts";

export class DbClickProcessor extends ClickProcessor{

    constructor() {
        super();
        this.registerDownHandler(new DbClickEditNodeTextHandler());
        this.registerDownHandler(new DbClickEditTextHandler());
        this.registerDownHandler(new DbClickQuickCreateHandler());
    }
}