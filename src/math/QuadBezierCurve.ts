import {Point} from "dahongpao-core";

export class QuadBezierCurve {

    p0:Point;
    p1:Point;
    p2:Point;

    constructor(p0:Point,p1:Point,p2:Point) {
        this.p0=p0;
        this.p1=p1;
        this.p2=p2;
    }

    /**
     * x(t)函数驻点
     */
    xStationaryPoint(){
        return (this.p0.x-this.p1.x)/(this.p0.x-2*this.p1.x+this.p2.x);
    }

    /**
     * 导数
     * @param t
     */
    dxdt(t:number){
        return 2*t*(this.p0.x-2*this.p1.x+this.p2.x)-2*(this.p0.x-this.p1.x);
    }

    xValue(t:number){
        const a=1-t;
        return a*a*this.p0.x+2*t*a*this.p1.x+t*t*this.p2.x;
    }

    yValue(t:number){
        const a=1-t;
        return a*a*this.p0.y+2*t*a*this.p1.y+t*t*this.p2.y;
    }

    newtonSolveX(xp:number,t0:number,t1:number){
        const epson=1e-2;
        let t=0.5*(t0+t1);
        let count=0;
        while (true){
            count++;
            const f1=this.xValue(t)-xp;
            const dxdt=this.dxdt(t);
            const next_t=t-f1/dxdt;
            if(Math.abs(next_t-t)<epson){
                // console.log("njx debug,new ton solve res:",next_t);
                return next_t;
            }
            if(count>20){
                return null;
            }
            t=next_t;
        }
        return null;
    }

    solve(point:Point,buffer:number=6){
        const stationaryPoint=this.xStationaryPoint();
        //单调情况判断
        if(stationaryPoint<0||stationaryPoint>1){
            return this.monotonicSolve(point,0,1,buffer);
        }
        //非单调判断
        let res=this.monotonicSolve(point,0,stationaryPoint,buffer);
        if(res){
            return true;
        }
        res=this.monotonicSolve(point,stationaryPoint,1,buffer);
        return res;

    }

    /**
     * 单调区间内求解
     * @param point
     * @param t0
     * @param t1
     * @param buffer
     */
    monotonicSolve(point:Point,t0:number,t1:number,buffer:number){
        const x0=this.xValue(t0);
        const x1=this.xValue(t1);
        const xp=point.x;
        const yp=point.y;
        //不在单调区间
        if((xp-x0)*(xp-x1)>0){
            return false;
        }
        //在单调区间，求x值
        const t=this.newtonSolveX(xp,t0,t1);
        if(t===null){
            console.warn("newton 迭代求解贝塞尔曲线出错.");
            return false;
        }
        return Math.abs(yp-this.yValue(t))<buffer;
    }

}