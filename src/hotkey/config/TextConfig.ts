import {HotKey} from "@/hotkey/HotKey";
import {EnterHotKey} from "@/hotkey/text/EnterHotKey";
import {EscHotKey} from "@/hotkey/text/EscHotKey.ts";
import {DeleteKey} from "@/hotkey/text/DeleteKey.ts";
import {KeyCode} from "@/hotkey/config/KeyCodeConfig.ts";
import {ArrowRightKey} from "@/hotkey/text/ArrowRightKey.ts";
import {ArrowLeftKey} from "@/hotkey/text/ArrowLeftKey.ts";
import {ArrowUpKey} from "@/hotkey/text/ArrowUpKey.ts";
import {ArrowDownKey} from "@/hotkey/text/ArrowDownKey.ts";
import {RedoKey} from "@/hotkey/common/RedoKey.ts";
import {UndoKey} from "@/hotkey/common/UndoKey.ts";
import {TabKey} from "@/hotkey/text/TabKey.ts";

export const textKeyMap = new Map<string, HotKey[]>([
    [KeyCode.Enter, [new EnterHotKey()]],
    [KeyCode.Escape, [new EscHotKey()]],
    [KeyCode.Backspace, [new DeleteKey()]],
    [KeyCode.ArrowRight, [new ArrowRightKey()]],
    [KeyCode.ArrowLeft, [new ArrowLeftKey()]],
    [KeyCode.ArrowUp, [new ArrowUpKey()]],
    [KeyCode.ArrowDown, [new ArrowDownKey()]],
    [KeyCode.Tab,[new TabKey()]],
    [KeyCode.KeyZ, [new RedoKey(), new UndoKey()],
    ],

]);