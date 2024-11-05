export class Color{
    hue: number;
    saturation: number;
    brightness: number;

    constructor(hue: number, saturation: number, brightness: number){
        this.hue = hue;
        this.saturation = saturation;
        this.brightness = brightness;
    }

    hue_to_rgb(p: number, q: number, t: number): number{
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }


    hsl_to_rgb(): number[]{
        let h = this.hue;
        let s = this.saturation;
        let l = this.brightness;
        let r: number;
        let g: number;
        let b: number;
        if(s == 0){
            r = g = b = l;
        }else{
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = this.hue_to_rgb(p, q, h + 1/3);
            g = this.hue_to_rgb(p, q, h);
            b = this.hue_to_rgb(p, q, h - 1/3);
        }
        //scale to 0-255
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        return [r, g, b];
    }

    
}