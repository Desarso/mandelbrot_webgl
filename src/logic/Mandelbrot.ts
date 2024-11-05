import Decimal from "decimal.js";
import { Complex } from "./Complex";
import { Color } from "./Colors";
import { FastComplex } from "./FastComplex";
import { Accessor, createSignal, Setter } from "solid-js";





export class Mandelbrot {
    max_iterations: number = 800;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;  
    width: Accessor<Decimal>;
    setWidth: Setter<Decimal>;
    height: Accessor<Decimal>;
    setHeight: Setter<Decimal>;
    startX: Accessor<Decimal>;
    setStartX: Setter<Decimal>;
    startY: Accessor<Decimal>;
    setStartY: Setter<Decimal>;
    endX: Accessor<Decimal>;
    setEndX: Setter<Decimal>;
    endY: Accessor<Decimal>;
    setEndY: Setter<Decimal>;
    constructor() {
        const canvasHolder = document.querySelector('.canvas-holder');
        const canvas = document.createElement('canvas');
        this.canvas = canvas;
        const [width, setWidth] = createSignal(new Decimal(800));
        this.setWidth = setWidth;
        this.width = width;
        const [height, setHeight] = createSignal(new Decimal(800));
        this.setHeight = setHeight;
        this.height = height;
        const [startX, setStartX] = createSignal(new Decimal(-2.5345));
        this.setStartX = setStartX;
        this.startX = startX;
        const [endX, setEndX] = createSignal(new Decimal(2.52353));
        this.endX = endX;
        this.setEndX = setEndX;
        const [startY, setStartY] = createSignal(new Decimal(-2.5345));
        this.startY = startY;
        this.setStartY = setStartY;
        const [endY, setEndY] = createSignal(new Decimal(2.5456));
        this.endY = endY;
        this.setEndY = setEndY;

        //add a scroll event listener to the canvas that zooms in and out
        this.canvas.addEventListener('wheel', (e) => {
            //console.log(e.deltaY);
            e.preventDefault();
            let delta = e.deltaY;
            if (delta > 0) {
                this.setWidth(this.width().times(1.1));
                this.setHeight(this.height().times(1.1));
            } else {
                this.setWidth(this.width().dividedBy(1.1));
                this.setHeight(this.height().dividedBy(1.1));
            }
            this.render();
        });
        

        this.canvas.width = this.width().toNumber();
        this.canvas.height = this.height().toNumber();
        //append the canvas to the body of the document
        canvasHolder?.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;
    }








    render(){
        Decimal.set({ precision: 20})

        // this.setStartX(new Decimal( -0.7451581436740010));
        // this.setEndX(new Decimal(-0.7451581436739864));
        // this.setStartY(new Decimal(0.12397760041487654));
        // this.setEndY(new Decimal(0.12397760041489125));


        //width per pixel
        let width_per_pixel = (this.endX().minus(this.startX())).dividedBy(this.width());

        console.log("distance between pixels",width_per_pixel.toString());


        //turn width and height into numbers
        let width = this.width().toNumber();
        let height = this.height().toNumber();

        //choose a point in the middle of the screen
        //the pixel location would be width/2, height/2

        //choose reference point as the center
        let startpoint = new Complex(
            this.endX(), 
            this.endY());

        console.log("startpoint", startpoint.toString());
       

        //generate high presision orbit around reference point
        let series = this.high_precision_series(startpoint, 40);





        //for some reason we turn the series into fast complex numbers here aka f32
        let x_n: FastComplex[] = [];
        for (let i = 0; i < 40; i++) {
            x_n.push(series[i].to_fast_complex());
        }

        console.log("x_n", x_n);


        //we generate pixels
        let pixels: Number[][] = []
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let fastC = new FastComplex(i, j);
                let ref = new FastComplex(width / 2, height / 2);
                let delta_0 = fastC.minus(ref).times(new FastComplex(width_per_pixel.toNumber(), 0));
                console.log("diff", fastC.minus(ref).toString());
                console.log("fastC", fastC,toString());
                console.log("delta_0", delta_0);
                //let color = this.calculate_pixel(x_n, delta_0);
                //pixels.push(color)
                break;
            }
            //render the pixels in that row
        }

        //console.log("pixels", pixels);


      for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
              let color = pixels[i * width + j];
              this.ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
              this.ctx.fillRect(i, j, 1, 1);
          }
    }
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(1, 1, 10, 10);
}


    calculate_pixel(x_n: FastComplex[], delta_0 : FastComplex):  Number[]{
        let delta_z = new FastComplex(0,0);
        let two = new FastComplex(2,0);
        let ref_iteration = 0;
        let iteration = 0;
        let z = new FastComplex(0,0)
        let lastZ = x_n[0].add(delta_0);
        let max_sub_iter = x_n.length -2;
        // console.log("Z: ", lastZ);
        // console.log("delta:", delta_0);

        while (iteration < this.max_iterations) {
            delta_z = two.times(delta_z).times(x_n[ref_iteration]).add(delta_z.square()).add(delta_0);
            ref_iteration++;
            //lastZ = z;
            z = x_n[ref_iteration].add(delta_z);
            if (z.abs() > 2.0) {
                break;
            }
            if(
                z.abs() < delta_z.abs() 
                || 
                ref_iteration == max_sub_iter){
                //re looping
                delta_z = z;
                ref_iteration = 0;
            }
            iteration++;
        }

         let dotprod = z.dot(z);
         let modulus = Math.sqrt(dotprod);
        // let precal = -0.52139022765;
        // let inverserlog2 = 3.32192809489;
        // let p = Math.log(dotprod) / Math.log(lastZ.dot(lastZ));
        let mu : number = 0;
        if(modulus > 1 && iteration < this.max_iterations){
            //mu = iteration - (Math.log(0.5 * dotprod) -precal) / p;
            //mu = iteration - Math.log(Math.log(modulus)) * inverserlog2;
            mu = iteration;
        }else{
            mu = this.max_iterations;
        }

        if (mu == this.max_iterations) {
            return [0, 0, 0];
        }
        let hue = mix(0, 1.0, mu/this.max_iterations);
        let saturation = 1.0;
        let lightness = 0.5;
        let color = new Color(hue, saturation, lightness);
        let rgb = color.hsl_to_rgb();
        return rgb;
    }



    high_precision_series(c: Complex, max_iterations: number): Complex[] {
        let z = new Complex(c.real, c.imag);
        let iteration: number = 0;
        let bailout: number = 4.0;
        let series: Complex[] = [];
        let zero = new Complex(new Decimal(0), new Decimal(0));
        series.push(zero);
    
        while (iteration < max_iterations && z.dot(z).toNumber() < bailout) {
        series.push(z);
        z = z.square().add(c);
        iteration++;
        }
        return series;
    }






}

function mix(value1: number, value2: number, ratio: number) {
    return value1 * (1 - ratio) + value2 * ratio;
}



