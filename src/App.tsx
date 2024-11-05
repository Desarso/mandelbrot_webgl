import { createSignal, onMount, type Component } from "solid-js";
import { Color } from "./logic/Colors";
import { Mandelbrot } from "./logic/Mandelbrot";
import { MandelbrotGL } from "./logic/Mandelbrotgl";
import pixels from "./pixels.json";

const App: Component = () => {
  const width = 800;
  const height = 800;
  const [maxIterations, setMaxIterations] = createSignal(800);
  const [roundingFactor, setRoundingFactor] = createSignal(1000000000000000);

  const [startX, setStartX] = createSignal(-2.5);
  const [endX, setEndX] = createSignal(2.0);
  const [startY, setStartY] = createSignal(-2.5);
  const [endY, setEndY] = createSignal(2.5);
  const [mouseA, setMouseA] = createSignal(0);
  const [mouseB, setMouseB] = createSignal(0);
  const [returnValue, setReturnValue] = createSignal(20);
  const [mouseDown, setMouseDown] = createSignal(false);
  const inverserLog2 = 1 / Math.log(2);
  let canvas;

  // function mandelbrot(a: number, b: number, maxIter: number) {
  //   let ac = a;
  //   let bc = b;
  //   let iter_count = 0;
  //   while (true) {
  //     iter_count++;
  //     let aa = a * a - b * b;
  //     let bb = (a + a) * b;

  //     a = aa + ac;
  //     b = bb + bc;

  //     let floatmod = Math.sqrt(a * a + b * b);
  //     if (floatmod > returnValue()) {
  //       break;
  //     }
  //     if (iter_count >= maxIter) {
  //       break;
  //     }
  //   }
  //   let aa = a * a - b * b;
  //   let bb = 2 * a * b;
  //   a = aa + ac;
  //   b = bb + bc;
  //   aa = a * a - b * b;
  //   bb = 2 * a * b;
  //   a = aa + ac;
  //   b = bb + bc;
  //   let modulus = Math.sqrt(a * a + b * b);
  //   let log = Math.log(modulus);
  //   let mu = iter_count + 1 - Math.log(log) * inverserLog2;
  //   if (Number.isNaN(mu)) {
  //     mu = maxIter;
  //   }
  //   if (iter_count === maxIter) {
  //     mu = maxIter;
  //   }
  //   //mu = N - log (log  |Z(N)|^2) * (1 / log 2)
  //   let hue = mix(0, 1.0, mu / maxIter);
  //   let saturation = 1.0;
  //   let lightness = 0.5;
  //   let color = new Color(hue, saturation, lightness);
  //   let rgb = color.hsl_to_rgb();
  //   return rgb;
  // }

  onMount(() => {

    const mandelbrot = new MandelbrotGL();
    //const mandelbrot2 = new Mandelbrot();
    mandelbrot.render();
    //mandelbrot2.render();

     //load pixels.json
     //console.log(pixels);
     console.log(pixels.length);
  });

  return (
    <div>
      <label for="startX">Start X: {startX()}</label>
      <input
        type="range"
        step="0.01"
        max="2.5"
        min="-2.5"
        id="startX"
        value={startX()}
        onChange={(e) => setStartX(+e.target.value)}
      />
      <label for="endX">End X: {endX()}</label>
      <input
        type="range"
        step="0.01"
        max="2.5"
        min="-2.5"
        id="endX"
        value={endX()}
      />
      <label for="startY">Start Y: {startY()}</label>
      <input
        type="range"
        step="0.01"
        max="2.5"
        min="-2.5"
        id="startY"
        value={startY()}
      />
      <label for="endY">End Y: {endY()}</label>
      <input
        type="range"
        step="0.01"
        max="2.5"
        min="-2.5"
        id="endY"
        value={endY()}
      />
      {/* <label for="roundingFactor">Rounding Factor: {roundingFactor()}</label>
      <input type="range" step="10" max="100000" min="10" id="roundingFactor" value={roundingFactor()} /> */}
      <label for="returnValue">Return Value: {returnValue()}</label>
      <input
        type="range"
        step="1"
        max="100"
        min="1"
        id="returnValue"
        value={returnValue()}
      />
      <label for="maxIterations">Max Iterations: {maxIterations()}</label>
      <input
        type="range"
        step="1"
        max="2000"
        min="10"
        id="maxIterations"
        value={maxIterations()}
      />
      <div class="canvas-holder">
      </div>
    </div>
  );
};

export default App;
