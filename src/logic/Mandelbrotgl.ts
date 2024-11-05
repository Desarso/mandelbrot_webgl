import Decimal from "decimal.js";
import { Complex } from "./Complex";
import { Color } from "./Colors";
import { FastComplex } from "./FastComplex";
import { Accessor, createEffect, createSignal, onMount, Setter } from "solid-js";
import fragmentShader from "./fragmentShader.glsl?raw";
import { vec2 } from "gl-matrix";

// Vertex shader source code
const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_position;

      void main() {
        v_position = a_position;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

// Fragment shader source code with perturbation
const fragmentShaderSource = fragmentShader;

// TypeScript: Define a type for WebGL context object
interface GLContext {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  startLocation: WebGLUniformLocation | null;
  endLocation: WebGLUniformLocation | null;
  maxIterationsLocation: WebGLUniformLocation | null;
  referenceOrbitLocation: WebGLUniformLocation | null;
}

export class MandelbrotGL {
  max_iterations: number = 100;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  viewPortScale: Accessor<Decimal>;
  setViewPortScale: Setter<Decimal>;
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
  shift: Accessor<vec2>;
  setShift: Setter<vec2>;
  baseShift: Accessor<number[]>;
  setBaseShift: Setter<number[]>;
  positionLocation: number | undefined;
  widthPerPixelLocation: WebGLUniformLocation | undefined;
  maxIterationsLocation: WebGLUniformLocation | undefined;
  referenceOrbitLocation: WebGLUniformLocation | undefined;
  widthLocation: WebGLUniformLocation | undefined;
  heightLocation: WebGLUniformLocation | undefined;
  shiftLocation: WebGLUniformLocation | undefined;
  mousedown: boolean = false;
  mousestart: number[] = [0, 0];
  scaleLocation: WebGLUniformLocation | undefined;
  constructor() {
    const canvasHolder = document.querySelector(".canvas-holder");
    const canvas = document.createElement("canvas");
    this.canvas = canvas;
    const [viewPortScale, setViewPortScale] = createSignal(new Decimal(0.0065));
    this.viewPortScale = viewPortScale;
    this.setViewPortScale = setViewPortScale;

    const [width, setWidth] = createSignal(new Decimal(800));
    this.setWidth = setWidth;
    this.width = width;
    const [height, setHeight] = createSignal(new Decimal(800));
    this.setHeight = setHeight;
    this.height = height;
    const [startX, setStartX] = createSignal(new Decimal(-2.5));
    this.setStartX = setStartX;
    this.startX = startX;
    const [endX, setEndX] = createSignal(new Decimal(2.5));
    this.endX = endX;
    this.setEndX = setEndX;
    const [startY, setStartY] = createSignal(new Decimal(-2.5));
    this.startY = startY;
    this.setStartY = setStartY;
    const [endY, setEndY] = createSignal(new Decimal(2.5));
    this.endY = endY;
    this.setEndY = setEndY;
    const [shift, setShift] = createSignal(vec2.create());
    this.shift = shift;
    this.setShift = setShift;
    const [baseShift, setBaseShift] = createSignal([0, 0]);
    this.baseShift = baseShift;
    this.setBaseShift = setBaseShift;

    this.canvas.width = this.width().toNumber();
    this.canvas.height = this.height().toNumber();
    //append the canvas to the body of the document
    canvasHolder?.appendChild(this.canvas);
    this.gl = this.canvas.getContext("webgl2")!;
    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    // Compile shaders and link program
    const vertexShader = this.createShader(
      this.gl,
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this.gl,
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) {
      console.error("Failed to create shaders");
      return;
    }
    const program = this.createProgram(this.gl, vertexShader, fragmentShader);

    if (!program) {
      console.error("Failed to create WebGL program");
      return;
    }

    this.gl.useProgram(program);

    // Look up attribute and uniform locations
    const positionLocation = this.gl.getAttribLocation(program, "a_position");
    const widthPerPixelLocation = this.gl.getUniformLocation(
      program,
      "width_per_pixel"
    );
    const maxIterationsLocation = this.gl.getUniformLocation(
      program,
      "u_maxIterations"
    );
    const referenceOrbitLocation = this.gl.getUniformLocation(
      program,
      "u_referenceOrbit"
    );

    const shiftLocation = this.gl.getUniformLocation(
      program,
      "u_shift"
    )

    const widthLocation = this.gl.getUniformLocation(program, "u_width");
    const heigthLocation = this.gl.getUniformLocation(program, "u_height");
    const scaleLocation = this.gl.getUniformLocation(program, "u_scale");


    if (
      widthPerPixelLocation === null ||
      maxIterationsLocation === null ||
      referenceOrbitLocation === null ||
      widthLocation === null ||
      heigthLocation === null ||
      // scaleLocation === null || 
      shiftLocation === null
    ) {
      //log all the locations
      // console.log({
      //   widthPerPixelLocation,
      //   maxIterationsLocation,
      //   referenceOrbitLocation,
      // });
      throw new Error("Failed to get uniform location");
    }
    this.widthPerPixelLocation = widthPerPixelLocation;
    this.maxIterationsLocation = maxIterationsLocation;
    this.referenceOrbitLocation = referenceOrbitLocation;
    this.widthLocation = widthLocation;
    this.heightLocation = heigthLocation;
    //this.scaleLocation = scaleLocation;
    this.positionLocation = positionLocation;
    this.shiftLocation = shiftLocation

    // Set up buffer with clip space positions for a fullscreen quad
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      this.gl.STATIC_DRAW
    );

    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(
      positionLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    //create effect
    createEffect(() => {
      //skip the first render
      if (this.shift()[0] == 0 && this.shift()[1] == 0 && this.viewPortScale().toNumber() == 0.0065) {
        return;
      }
      console.log("Rendering");
      console.log("Shift: ", this.shift());
      console.log("Scale: ", this.viewPortScale().toNumber());

      //set shift as url param
      //set scale as url param
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      searchParams.set("shift", `${this.shift()[0]},${this.shift()[1]}`);
      searchParams.set("scale", this.viewPortScale().toNumber().toString());

      window.history.replaceState({}, "", url.toString());


    });

    onMount(() => {
      //check if there are any url params if shift and scale are present set them
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      if (searchParams.has("shift")) {
        let shift = searchParams.get("shift")?.split(",");
        if (shift) {
          this.setShift(vec2.fromValues(parseFloat(shift[0]), parseFloat(shift[1])));
        }
      }
      if (searchParams.has("scale")) {
        let scale = searchParams.get("scale");
        if (scale) {
          this.setViewPortScale(new Decimal(parseFloat(scale)));
        }
      }

      this.render();
    });


    //add a scroll event listener to the canvas that zooms in and out
    this.canvas.addEventListener("wheel", (e) => {
      //console.log(e.deltaY);
      //console.log(new Float32Array([this.viewPortScale().toNumber()])[0]);
      e.preventDefault();
      //max scale is 5 
      // if (this.viewPortScale().toNumber() > 40) {
      //   this.setViewPortScale(new Decimal(40));
      //   return;
      // }

      let delta = e.deltaY;
      if (delta > 0) {
        this.setViewPortScale(this.viewPortScale().times(1.1));
        //scale shift as well
        //console.log("zoom: ", this.shift());
        let shift = vec2.fromValues(this.shift()[0] / 1.1, this.shift()[1] / 1.1);;
        this.setShift(shift);
      } else {
        this.setViewPortScale(this.viewPortScale().dividedBy(1.1));
        //scale shift as well
        let shift = vec2.fromValues(this.shift()[0] * 1.1, this.shift()[1] * 1.1);
        this.setShift(shift);
      }
      this.render();
    });

    canvas.addEventListener("mousedown", (event) => {
      this.mousedown = true;
      //get relative position within canvas
      let x = event.clientX;
      let y = event.clientY;
      let rect = this.canvas.getBoundingClientRect();
      let xrel = x - rect.left;
      let yrel = y - rect.top;

      //normalize into the position of the mandelbrot set normalize between -2.5 and 2.5
      let newX = ((x) - this.width().toNumber() / 2.0) * this.viewPortScale().toNumber();
      let  newY = ((y) - this.height().toNumber() / 2.0) * this.viewPortScale().toNumber();
    
      //console.log("Xrel: ", newX, "Yrel: ", newY);

      this.mousestart =([xrel, yrel]);
    });

    let lastFrameTime = 0;
    canvas.addEventListener("mousemove", (event) => {
      //cap this at 60fps
      requestAnimationFrame((currentTime) => {
        // Check if enough time has passed (1000ms / 60fps ≈ 16.67ms)
        if (currentTime - lastFrameTime >= 1000 / 60) {
            lastFrameTime = currentTime;
            if (this.mousedown) {
              let x = event.clientX;
              let y = event.clientY;
              let rect = this.canvas.getBoundingClientRect();
              let xrel = x - rect.left;
              let yrel = y - rect.top;
      
            
              //get diff from mouse start
              let diffx = xrel - this.mousestart[0];
              let diffy = yrel - this.mousestart[1];

              //change base shift
              this.setBaseShift([this.baseShift()[0] - diffx, this.baseShift()[1] + diffy]);
      
              let shift = vec2.fromValues(this.shift()[0] - (diffx * this.viewPortScale().toNumber()), this.shift()[1] + (diffy * this.viewPortScale().toNumber()));
              this.setShift(shift);
              this.mousestart = [xrel, yrel];

              //change start and end points
              //calculate actual center of the image, based on the shift and width per pixel
              // let center = {x : (new Decimal(this.shift()[0])), y: (new Decimal(this.shift()[1]))};
              // let adjusted = {x: center.x.mul(this.viewPortScale()), y: center.y.mul(this.viewPortScale())};
              // console.log("Adjusted: ", adjusted.x.toNumber(), adjusted.y.toNumber());


      
              this.render();
            }
        }
    });

     
    });

    canvas.addEventListener("mouseup", (event) => {
      this.mousedown = false;
    });
  }

  // Helper function to compile a shader
  createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile failed:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  // Helper function to create a WebGL program
  createProgram(
    gl: WebGLRenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram | null {
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link failed:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  render() {
    Decimal.set({ precision: 20 });

    // this.setStartX(new Decimal( -0.7451581436740010));
    // this.setEndX(new Decimal(-0.7451581436739864));
    // this.setStartY(new Decimal(0.12397760041487654));
    // this.setEndY(new Decimal(0.12397760041489125));

    const gl = this.gl;
    const program = gl.getParameter(gl.CURRENT_PROGRAM);
    const {
      widthPerPixelLocation,
      maxIterationsLocation,
      referenceOrbitLocation,
      widthLocation,
      heightLocation,
      scaleLocation,
      shiftLocation
    } = this;

    //("StartX: ", this.startX().toNumber());
    //console.log("StartY: ", this.startY().toNumber());
    let width_per_pixel = this.endX()
      .minus(this.startX())
      .dividedBy(this.width())
      .toNumber();

    //console.log("Width per pixel: ", width_per_pixel);

    
      //let start point be adjusted by shift
    //let startpoint = new Complex(
    //   this.endX().minus(this.startX()).div(2).add(this.startX()),
    //   this.endY().minus(this.startY()).div(2).add(this.startY())
    // );


      //let startpoint = new Complex(this.endX(), this.endY());
      //map base shift values to scale from -400 to 400 to -2.5 to 2.5
      let mapped = mapPoint(this.baseShift()[0], this.baseShift()[1], [-400, 400],[-400, 400], [-2.5, 2.5], [-2.5, 2.5]);
      let startpoint = new Complex(
        new Decimal(mapped[0]),
        new Decimal(mapped[1])
      );

    console.log("Base Shift: ", this.baseShift());

    console.log("Startpoint: ", startpoint.toString());

    let width = this.endX().minus(this.startX());
    let height = this.endY().minus(this.startY());

    //choose 20 points evenly spaced around the display
    let possible_points = [
      [
        this.startX().plus(width.times(0.1)),
        this.startY().plus(height.times(0.1)),
      ],
      [
        this.startX().plus(width.times(0.1)),
        this.startY().plus(height.times(0.3)),
      ],
      [
        this.startX().plus(width.times(0.1)),
        this.startY().plus(height.times(0.5)),
      ],
      [
        this.startX().plus(width.times(0.1)),
        this.startY().plus(height.times(0.7)),
      ],
      [
        this.startX().plus(width.times(0.1)),
        this.startY().plus(height.times(0.9)),
      ],
      [
        this.startX().plus(width.times(0.3)),
        this.startY().plus(height.times(0.1)),
      ],
      [
        this.startX().plus(width.times(0.3)),
        this.startY().plus(height.times(0.3)),
      ],
      [
        this.startX().plus(width.times(0.3)),
        this.startY().plus(height.times(0.5)),
      ],
      [
        this.startX().plus(width.times(0.3)),
        this.startY().plus(height.times(0.7)),
      ],
      [
        this.startX().plus(width.times(0.3)),
        this.startY().plus(height.times(0.9)),
      ],
      [
        this.startX().plus(width.times(0.5)),
        this.startY().plus(height.times(0.1)),
      ],
      [
        this.startX().plus(width.times(0.5)),
        this.startY().plus(height.times(0.3)),
      ],
      [
        this.startX().plus(width.times(0.5)),
        this.startY().plus(height.times(0.5)),
      ],
      [
        this.startX().plus(width.times(0.5)),
        this.startY().plus(height.times(0.7)),
      ],
      [
        this.startX().plus(width.times(0.5)),
        this.startY().plus(height.times(0.9)),
      ],
      [
        this.startX().plus(width.times(0.7)),
        this.startY().plus(height.times(0.1)),
      ],
      [
        this.startX().plus(width.times(0.7)),
        this.startY().plus(height.times(0.3)),
      ],
      [
        this.startX().plus(width.times(0.7)),
        this.startY().plus(height.times(0.5)),
      ],
      [
        this.startX().plus(width.times(0.7)),
        this.startY().plus(height.times(0.7)),
      ],
      [
        this.startX().plus(width.times(0.7)),
        this.startY().plus(height.times(0.9)),
      ],
      [
        this.startX().plus(width.times(0.9)),
        this.startY().plus(height.times(0.1)),
      ],
      [
        this.startX().plus(width.times(0.9)),
        this.startY().plus(height.times(0.3)),
      ],
      [
        this.startX().plus(width.times(0.9)),
        this.startY().plus(height.times(0.5)),
      ],
      [
        this.startX().plus(width.times(0.9)),
        this.startY().plus(height.times(0.7)),
      ],
      [
        this.startX().plus(width.times(0.9)),
        this.startY().plus(height.times(0.9)),
      ],
    ];


    //generate series from all points choose the one with the lowest number of iterations or the one that repeats
    let series = this.high_precision_series(startpoint, 40);
    ///let series = this.high_precision_series(startpoint, 40);
    let x_n: FastComplex[] = [];
    for (let i = 0; i < series.length; i++) {
      x_n.push(series[i].to_fast_complex());
      //exit at 40 iterations
      if (i >= 40) {
        break;
      }
    }
    let referenceOrbit = x_n.map((point) => [point.real, point.imag]);

    //console.log("Reference Orbit: ", x_n);
    // console.log("Canvas Size:", this.canvas.width, this.canvas.height);
    // console.log("Width per pixel: ", width_per_pixel);
    // console.log("Uniform Locations:", {
    //   widthPerPixelLocation,
    //   maxIterationsLocation,
    //   referenceOrbitLocation,
    // });

    if (
      widthPerPixelLocation &&
      maxIterationsLocation &&
      referenceOrbitLocation &&
      widthLocation &&
      heightLocation &&
      // scaleLocation && 
      shiftLocation
    ) {
      gl.uniform1f(widthPerPixelLocation, this.viewPortScale().toNumber());
      gl.uniform1f(widthLocation, this.width().toNumber());
      gl.uniform1f(heightLocation, this.height().toNumber());
      //gl.uniform1f(scaleLocation, this.viewPortScale().toNumber());
      gl.uniform1i(maxIterationsLocation, this.max_iterations);
      gl.uniform2fv(shiftLocation, new Float32Array(this.shift()));
      gl.uniform2fv(
        referenceOrbitLocation,
        new Float32Array(referenceOrbit.flat())
      );
    } else {
      console.warn("Uniform locations are not initialized.");
    }

    // Ensure viewport matches canvas size

    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  calculate_pixel(x_n: FastComplex[], delta_0: FastComplex): Number[] {
    let delta_z = new FastComplex(0, 0);
    let two = new FastComplex(2, 0);
    let ref_iteration = 0;
    let iteration = 0;
    let z = new FastComplex(0, 0);
    let max_sub_iter = x_n.length - 2;

    while (iteration < this.max_iterations) {
      delta_z = two
        .times(delta_z)
        .times(x_n[ref_iteration])
        .add(delta_z.square())
        .add(delta_0);
      ref_iteration++;
      z = x_n[ref_iteration].add(delta_z);
      if (z.abs() > 2.0) {
        break;
      }
      if (z.abs() < delta_z.abs() || ref_iteration == max_sub_iter) {
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
    let mu: number = 0;
    if (modulus > 1 && iteration < this.max_iterations) {
      //mu = iteration - (Math.log(0.5 * dotprod) -precal) / p;
      //mu = iteration - Math.log(Math.log(modulus)) * inverserlog2;
      mu = iteration;
    } else {
      mu = this.max_iterations;
    }

    if (mu == this.max_iterations) {
      return [0, 0, 0];
    }
    let hue = mix(0, 1.0, mu / this.max_iterations);
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
      //I want to exit once the series starts repeating
      if (series.includes(z)) {
        break;
      }
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

function mapPoint(
  x: number,
  y: number,
  oldXRange: [number, number],
  oldYRange: [number, number],
  newXRange: [number, number],
  newYRange: [number, number]
): [number, number] {
  const [oldXMin, oldXMax] = oldXRange;
  const [oldYMin, oldYMax] = oldYRange;
  const [newXMin, newXMax] = newXRange;
  const [newYMin, newYMax] = newYRange;

  // Map x coordinate
  const newX = newXMin + ((x - oldXMin) * (newXMax - newXMin)) / (oldXMax - oldXMin);

  // Map y coordinate
  const newY = newYMin + ((y - oldYMin) * (newYMax - newYMin)) / (oldYMax - oldYMin);

  return [newX, newY];
}