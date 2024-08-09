import {GraphicNode, GraphicUtils, IGraphicElement, Point, RectNode} from "dahongpao-core";
import {Rect} from "@/text/base/Rect.ts";
import {ExecutorContext} from "@/action/executor/ExecutorContext.ts";
import {OolongNode} from "@/graphics/OolongNode.ts";
import {OolongLineType} from "@/graphics/OolongLineType.ts";
import {OolongLineDO} from "@/file/OolongLineDO.ts";
import {UpdateLineLog} from "@/action/log/line/UpdateLineLog.ts";
import {OolongLine} from "@/graphics/OolongLine.ts";
import {OolongNodeManager} from "@/app/OolongNodeManager.ts";
import {LineLayoutWorker} from "@/interact/default/connectLine/layout/LineLayoutWorker.ts";

export class InteractiveUtils {
    /**
     * 将角度处理到0-360度范围
     * @param angle
     */
    static trimAngle(angle: number): number {
        const a = Math.floor(angle / 360);
        return angle - a * 360;
    }

    static calculateAngle(start: Point, end: Point): number {
        if (Math.abs(start.x - end.x) < 1e-2) {
            if (end.y > start.y) {
                return 90;
            } else {
                return -90;
            }
        }
        const kAngle = Math.atan2(end.y - start.y, end.x - start.x);
        return kAngle / Math.PI * 180;


    }

    static calculateAngle2(start: Point, end: Point): number {
        if (Math.abs(start.x - end.x) < 1e-2) {
            if (end.y > start.y) {
                return 0.5 * Math.PI;
            } else {
                return -0.5 * Math.PI;
            }
        }
        const kAngle = Math.atan2(end.y - start.y, end.x - start.x);
        return kAngle;
    }

    static overlapRect(rect1: RectNode, rect2: RectNode): boolean {
        return !(rect1.maxX < rect2.minX || rect1.minX > rect2.maxX
            || rect1.maxY < rect2.minY || rect1.minY > rect2.maxY);
    }

    static trimPoint(p: Point): Point {
        return new Point(Math.floor(p.x), Math.floor(p.y));
    }

    static overlapHorizonVertical(p: Point, q: Point, rect: RectNode): boolean {
        const isHorizon = InteractiveUtils.judgeHorizon(p, q);
        if (isHorizon) {
            if (p.y < rect.minY || p.y > rect.maxY) {
                return false;
            }
            const minX = p.x > q.x ? q.x : p.x;
            const maxX = p.x < q.x ? q.x : p.x;
            if (minX > rect.maxX || maxX < rect.minX) {
                return false;
            }
        } else {
            if (p.x < rect.minX || p.x > rect.maxX) {
                return false;
            }
            const minY = p.y > q.y ? q.y : p.y;
            const maxY = p.y < q.y ? q.y : p.y;
            if (minY > rect.maxY || maxY < rect.minY) {
                return false;
            }
        }
        return true;
    }

    static overlapHorizon(minX: number, maxX: number, y: number, p: Point, q: Point) {
        const minY = p.y > q.y ? q.y : p.y;
        const maxY = p.y < q.y ? q.y : p.y;
        if (minY > y || maxY < y) {
            return false;
        }
        const xMin = p.x > q.x ? q.x : p.x;
        const xMax = p.x < q.x ? q.x : p.x;
        if (xMin > maxX || xMax < minX) {
            return false;
        }
        return true;
    }

    static overlapVertical(minY: number, maxY: number, x: number, p: Point, q: Point) {
        const minX = p.x > q.x ? q.x : p.x;
        const maxX = p.x < q.x ? q.x : p.x;
        if (minX > x || maxX < x) {
            return false;
        }
        const yMin = p.y > q.y ? q.y : p.y;
        const yMax = p.y < q.y ? q.y : p.y;
        if (yMin > maxY || yMax < minY) {
            return false;
        }
        return true;
    }

    static overlapOolongLine(line: OolongLine, rect: RectNode): boolean {
        if (line.shapeType === OolongLineType.PolyLine) {
            return this.overlapPolyLine(line.points, rect);
        }
        if (line.shapeType === OolongLineType.Line || line.shapeType === OolongLineType.LineArrow) {
            const points = line.points;
            return this.overlapSimpleLine(points[0], points[points.length - 1], rect);
        }
        if (line.shapeType === OolongLineType.Curve) {
            return this.overlapRect(line.getRectNode(), rect);
        }
    }

    static overlapSimpleLine(a: Point, b: Point, rect: RectNode): boolean {
        if (this.overlapHorizon(rect.minX, rect.maxX, rect.minY, a, b)) {
            return true;
        }
        if (this.overlapHorizon(rect.minX, rect.maxX, rect.maxY, a, b)) {
            return true;
        }
        if (this.overlapVertical(rect.minY, rect.maxY, rect.maxX, a, b)) {
            return true;
        }
        if (this.overlapVertical(rect.minY, rect.maxY, rect.minX, a, b)) {
            return true;
        }
        //全覆盖
        const minX = a.x > b.x ? b.x : a.x;
        const maxX = a.x < b.x ? b.x : a.x;
        const minY = a.y > b.y ? b.y : a.y;
        const maxY = a.y < b.y ? b.y : a.y;
        if (maxX <= rect.maxX && minX >= rect.minX && maxY <= rect.maxY && minY >= rect.minY) {
            return true;
        }
        return false;
    }

    static overlapPolyLine(points: Point[], rect: RectNode): boolean {
        for (let i = 0; i < points.length - 1; i++) {
            const p = points[i];
            const q = points[i + 1];
            const overlap = this.overlapHorizonVertical(p, q, rect);
            if (overlap) {
                return true;
            }
        }
        return false;
    }

    static interactRect(rect1: RectNode, rect2: RectNode): RectNode {
        return {
            id: 'interactNode',
            minX: Math.max(rect1.minX, rect2.minX),
            maxX: Math.min(rect1.maxX, rect2.maxX),
            minY: Math.max(rect1.minY, rect2.minY),
            maxY: Math.min(rect1.maxY, rect2.maxY),
        }
    }

    static rectNode2Rect(rectNode: RectNode): Rect {
        const {minX, minY, maxX, maxY} = rectNode;
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        }
    }

    static needDrawByDelete(ctx: ExecutorContext, bounds: RectNode, relatedLinks: Set<string>, targetNode: IGraphicElement, exclude: boolean): IGraphicElement[] {
        const result = ctx.nodeManager.tree.search(bounds);
        const graphicSet = new Set<IGraphicElement>();
        for (const treeNode of result) {
            const node = ctx.nodeManager.nodeMap.get(treeNode.id);
            if (node) {
                graphicSet.add(node);
            }
            const line = ctx.nodeManager.lineMap.get(treeNode.id);
            if (line) {
                graphicSet.add(line);
            }
        }
        for (const lineId of relatedLinks) {
            const line = ctx.nodeManager.lineMap.get(lineId);
            if (line) {
                graphicSet.add(line);
            }
        }
        if (!exclude) {
            graphicSet.add(targetNode!);
        }
        const graphicList = [...graphicSet];
        graphicList.sort((a, b) => a.zIndex - b.zIndex);
        return graphicList;
    }

    static layout(start: Point, end: Point): Point[] {
        const points: Point[] = [];
        GraphicUtils.doubleMiddleInsertPoint(
            start,
            end,
            points,
        );
        //属性
        return points;
    }

    static curveLayout(start: Point, end: Point): Point[] {


        const isParallel = true;

        const rect = new GraphicNode("cache");
        rect.x = Math.min(start.x, end.x);
        rect.y = Math.min(start.y, end.y);
        rect.w = Math.max(start.x, end.x) - rect.x;
        rect.h = Math.max(start.y, end.y) - rect.y;
        const points: Point[] = [];
        //points
        if (isParallel) {
            if (start.y < end.y) {
                points.push(start);
                points.push(GraphicUtils.topPoint(rect));
                points.push(GraphicUtils.centerPoint(rect));
                points.push(GraphicUtils.bottomPoint(rect));
                points.push(end);
            } else {
                points.push(start);
                points.push(GraphicUtils.bottomPoint(rect));
                points.push(GraphicUtils.centerPoint(rect));
                points.push(GraphicUtils.topPoint(rect));
                points.push(end);
            }
        } else {
            if (start.y <= end.y && start.x > end.x) {
                //第一象限
                points.push(start);
                points.push(GraphicUtils.bottomRight(rect));
                points.push(end);
            } else if (start.y < end.y && start.x < end.x) {
                //第2象限
                points.push(start);
                points.push(GraphicUtils.bottomLeft(rect));
                points.push(end);
            } else if (start.y >= end.y && start.x < end.x) {
                //第3象限
                points.push(start);
                points.push(GraphicUtils.topLeft(rect));
                points.push(end);
            } else if (start.y > end.y && start.x > end.x) {
                //第4象限
                points.push(start);
                points.push(GraphicUtils.topRight(rect));
                points.push(end);
            }
        }
        //属性

        return points;
    }


    static judgeHorizon(p1: Point, p2: Point, delta: number = 1e-2): boolean {
        if (Math.abs(p1.y - p2.y) < delta) {
            return true;
        }
        return false;
    }

    static judgeVertical(p1: Point, p2: Point, delta: number = 1e-2): boolean {
        if (Math.abs(p1.x - p2.x) < delta) {
            return true;
        }
        return false;
    }

    static generateDrivenUpdateLineMsg(lineId: string, nodeManager: OolongNodeManager) {
        const linkLine = nodeManager.oolongLinkMap.get(lineId);
        if (!linkLine) {
            return null;
        }
        const line = nodeManager.lineMap.get(lineId) as OolongLine;
        if (!line) {
            return null;
        }
        let points: Point[] = [];
        const hasStart = linkLine.start !== undefined;
        const hasEnd = linkLine.end !== undefined;
        if (hasStart && hasEnd) {
            const startLink = linkLine.start!;
            const endLink = linkLine.end!;

            const startNode = nodeManager.nodeMap.get(startLink.id)! as OolongNode;
            const endNode = nodeManager.nodeMap.get(endLink.id)! as OolongNode;

            const start = startLink.connectPoint;
            const end = endLink.connectPoint;

            startNode.updateConnectorPoint(start);
            endNode.updateConnectorPoint(end);

            if (line.shapeType === OolongLineType.PolyLine) {
                points = LineLayoutWorker.getInstance().layout(start, end, startNode, endNode);
            } else if (line.shapeType === OolongLineType.Curve) {
                points = InteractiveUtils.curveLayout(start, end);
            } else {
                points = [start, end];
            }
        } else if (hasStart) {
            const startLink = linkLine.start!;
            startLink.updatePos(nodeManager);
            const start = startLink.connectPoint;
            const startNode = nodeManager.nodeMap.get(startLink.id)! as OolongNode;
            startNode.updateConnectorPoint(start);

            const end = line.points[line.points.length - 1];
            if (line.shapeType === OolongLineType.PolyLine) {
                points = LineLayoutWorker.getInstance().layoutFreeEndPoint(start, end, startNode);
            } else if (line.shapeType === OolongLineType.Curve) {
                points = InteractiveUtils.curveLayout(start, end);
            } else {
                points = [start, end];
            }

        } else if (hasEnd) {
            const endLink = linkLine.end!;
            endLink.updatePos(nodeManager);
            const end = endLink.connectPoint;
            const endNode = nodeManager.nodeMap.get(endLink.id)! as OolongNode;
            endNode.updateConnectorPoint(end);

            const start = line.points[0];
            if (line.shapeType === OolongLineType.PolyLine) {
                points = LineLayoutWorker.getInstance().layoutFreeStartPoint(start, end, endNode);
            } else if (line.shapeType === OolongLineType.Curve) {
                points = InteractiveUtils.curveLayout(start, end);
            } else {
                points = [start, end];
            }

        }
        if (points.length === 0) {
            return null;
        }
        const updateData = {} as Partial<OolongLineDO>;
        updateData.id = line.id;
        updateData.points = points;
        const updateLog = new UpdateLineLog(updateData);
        return updateLog;
    }

}