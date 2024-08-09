import {Point} from "dahongpao-core";

export class OolongGraphicUtils {

    static clonePoints(points:Point[]):Point[]{
        const res:Point[]=[];
        for(const p of points){
            res.push(new Point(p.x,p.y));
        }
        return res;
    }

}