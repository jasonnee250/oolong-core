import {HotKey} from "@/hotkey/HotKey";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";
import {RedoKey} from "@/hotkey/common/RedoKey.ts";
import {UndoKey} from "@/hotkey/common/UndoKey.ts";
import {EnterHotKey} from "@/hotkey/normal/EnterHotKey.ts";
import {ArrowRightKey} from "@/hotkey/normal/ArrowRightKey.ts";
import {ArrowLeftKey} from "@/hotkey/normal/ArrowLeftKey.ts";
import {ArrowUpKey} from "@/hotkey/normal/ArrowUpKey.ts";
import {ArrowDownKey} from "@/hotkey/normal/ArrowDownKey.ts";
import {DeleteKey} from "@/hotkey/normal/DeleteKey.ts";
import {TabKey} from "@/hotkey/normal/TabKey.ts";
import {RKey} from "@/hotkey/normal/RKey.ts";
import {EscHotKey} from "@/hotkey/normal/EscHotKey.ts";
import {LKey} from "@/hotkey/normal/LKey.ts";
import {AKey} from "@/hotkey/normal/AKey.ts";
import {DKey} from "@/hotkey/normal/DKey.ts";

export const normalKeyMap = new Map<string, HotKey[]>([

    [KeyCode.Backspace, [new DeleteKey()]],
    [KeyCode.ArrowRight, [new ArrowRightKey()]],
    [KeyCode.ArrowLeft, [new ArrowLeftKey()]],
    [KeyCode.ArrowUp, [new ArrowUpKey()]],
    [KeyCode.ArrowDown, [new ArrowDownKey()]],
    [KeyCode.Enter, [new EnterHotKey()]],
    [KeyCode.Tab,[new TabKey()]],
    [KeyCode.KeyA,[new AKey()]],
    [KeyCode.KeyL,[new LKey()]],
    [KeyCode.KeyR,[new RKey()]],
    [KeyCode.KeyZ, [new RedoKey(), new UndoKey()]],
    [KeyCode.KeyD,[new DKey()]],
    [KeyCode.Escape,[new EscHotKey()]],

]);