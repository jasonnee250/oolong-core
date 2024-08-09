import {Point} from "dahongpao-core";

export interface trimSVGInfo{
    svgCode:string;
    width:number;
    height:number;
}

export enum ISvgLineType{
    Line,
    CubicCurve,
}



export interface ISvgPointInfo{
    control1: Point,
    control2: Point,
    end: Point,
}

export class OolongSVGUtils {

    static getNumFromString(stringValue:string){
        try{
            const match = stringValue.match(/(\d+)/);
            // 如果匹配成功，返回第一个捕获组（数字）
            if (match && match[1]) {
                return parseInt(match[1], 10); // 将字符串转换为整数
            }
            // 如果没有匹配到，返回null或你希望的默认值
            return 100;
        }catch (e){
            console.error("从字符串中获取num出错：",stringValue);
            return 100;
        }
    }

    static trimSvgCode(originSvgCode:string):trimSVGInfo{
        const parser=new DOMParser();
        const cache=parser.parseFromString(originSvgCode,"image/svg+xml").documentElement;
        const widthValue=cache.getAttribute("width");
        const heightValue=cache.getAttribute("height");
        cache.removeAttribute("width");
        cache.removeAttribute("height");
        const widthStyleValue=cache.style.width;
        const heightStyleValue=cache.style.height;
        cache.style.removeProperty("width");
        cache.style.removeProperty("height");

        let width=100;
        let height=100;
        if(widthValue!==null){
            width=this.getNumFromString(widthValue);
        }else if(widthStyleValue!==''){
            width=this.getNumFromString(widthStyleValue);
        }
        if(heightValue!==null){
            height=this.getNumFromString(heightValue);
        }else if(heightStyleValue!==''){
            height=this.getNumFromString(heightStyleValue);
        }
        const svgCode=cache.outerHTML;
        return {svgCode,width,height};
    }

    static extractPathInfo(pathD:string) {
        // Regular expression to match commands and coordinates
        const pattern = /([MLCZH])([^MLCZH]*)/g;
        let matches;
        const points :(ISvgPointInfo|Point)[]= []

        while ((matches = pattern.exec(pathD)) !== null) {
            const command = matches[1];
            const coords = matches[2].trim();
            const pairs = coords.match(/-?\d*\.?\d+/g)!;

            if (command === 'M' || command === 'L') {
                for (let i = 0; i < pairs.length; i += 2) {
                    points.push({
                        x: parseFloat(pairs[i]),
                        y: parseFloat(pairs[i + 1])
                    });
                }
            } else if (command === 'C') {
                for (let i = 0; i < pairs.length; i += 6) {
                    points.push({
                        control1: { x: parseFloat(pairs[i]), y: parseFloat(pairs[i + 1]) },
                        control2: { x: parseFloat(pairs[i + 2]), y: parseFloat(pairs[i + 3]) },
                        end: { x: parseFloat(pairs[i + 4]), y: parseFloat(pairs[i + 5]) }
                    });
                }
            }
        }
        console.log("===>",points);
        return this.normailizeControlPoint(points);
    }

    static extractCoordinates(pathD:string) {
        // Regular expression to match coordinate pairs
        const pattern = /([MLCZH])([^MLCZH]*)/g;
        let matches;
        const points = [];

        while ((matches = pattern.exec(pathD)) !== null) {
            const command = matches[1];
            const coords = matches[2].trim();
            if (['M', 'L', 'C'].includes(command)) {
                const pairs = coords.match(/-?\d*\.?\d+/g)!;
                for (let i = 0; i < pairs.length; i += 2) {
                    points.push({
                        x: parseFloat(pairs[i]),
                        y: parseFloat(pairs[i + 1])
                    });
                }
            }
        }
        const xList=points.map(p=>p.x);
        const yList=points.map(p=>p.y);
        const xMin=Math.min(...xList);
        const xMax=Math.max(...xList);
        const yMin=Math.min(...yList);
        const yMax=Math.max(...yList);
        const disX=xMax-xMin;
        const disY=yMax-yMin;
        const cPoints:Point[]=[];
        for(const p of points){
            cPoints.push({x:(p.x-xMin)/disX,y:(p.y-yMin)/disY});
        }

        return cPoints;
    }

    static normailizeControlPoint(points:(ISvgPointInfo|Point)[]):(ISvgPointInfo|Point)[]{
        const xList:number[]=[];
        const yList:number[]=[];
        for(const p of points){
            if(p.control1){
                xList.push(p.control1.x);
                xList.push(p.control2.x);
                xList.push(p.end.x);
                yList.push(p.control1.y);
                yList.push(p.control2.y);
                yList.push(p.end.y);
            }else{
                xList.push(p.x);
                yList.push(p.y);
            }
        }


        const xMin=Math.min(...xList);
        const xMax=Math.max(...xList);
        const yMin=Math.min(...yList);
        const yMax=Math.max(...yList);
        const disX=xMax-xMin;
        const disY=yMax-yMin;

        const dealPoint=(p:Point)=>{
            return {x:(p.x-xMin)/disX,y:(p.y-yMin)/disY}
        }

        const cPoints:(Point|ISvgPointInfo)[]=[];
        for(const p of points){
            if(p.control1){
                cPoints.push({
                    control1: dealPoint(p.control1),
                    control2: dealPoint(p.control2),
                    end: dealPoint(p.end),
                });
            }else{
                cPoints.push(dealPoint(p));
            }
        }

        return cPoints;
    }


    static normalizePoint(points:Point[]):Point[]{
        const xList:number[]=[];
        const yList:number[]=[];
        for(const p of points){

                xList.push(p.x);
                yList.push(p.y);

        }
        const xMin=Math.min(...xList);
        const xMax=Math.max(...xList);
        const yMin=Math.min(...yList);
        const yMax=Math.max(...yList);
        const disX=xMax-xMin;
        const disY=yMax-yMin;
        const dealPoint=(p:Point)=>{
            return {x:(p.x-xMin)/disX,y:(p.y-yMin)/disY}
        }
        const cPoints:Point[]=[];
        for(const p of points){
            cPoints.push(dealPoint(p));
        }

        return cPoints;
    }

}