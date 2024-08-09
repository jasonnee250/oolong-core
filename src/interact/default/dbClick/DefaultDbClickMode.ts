import {DbClickMode} from "dahongpao-canvas";
import {DbClickProcessor} from "@/interact/default/dbClick/DbClickProcessor";

export class DefaultDbClickMode extends DbClickMode{

    constructor() {
        super([
            new DbClickProcessor()
        ]);
    }
}