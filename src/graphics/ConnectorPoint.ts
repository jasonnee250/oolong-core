import {Point} from "dahongpao-core";

export enum NodeSideEnum{
    LEFT="LEFT",
    TOP="TOP",
    RIGHT="RIGHT",
    BOTTOM="BOTTOM",
}

export class ConnectorPoint extends Point{

    xPos:number;
    yPos:number;
    nodeSide:NodeSideEnum;

    constructor(p:Point,xPos:number,yPos:number,nodeSide:NodeSideEnum) {
        super(p.x,p.y);
        this.xPos=xPos;
        this.yPos=yPos;
        this.nodeSide=nodeSide;
    }
}