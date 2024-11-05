import Decimal from "decimal.js";
import { FastComplex } from "./FastComplex";
import { vec2 } from "gl-matrix";

export class Complex {
  real: Decimal;
  imag: Decimal;

  constructor(real: Decimal, imag: Decimal) {
    this.real = real;
    this.imag = imag;
  }

  add(c: Complex): Complex {
    return new Complex(this.real.plus(c.real), this.imag.plus(c.imag));
  }
  minus(c: Complex): Complex {
    return new Complex(this.real.minus(c.real), this.imag.minus(c.imag));
  }
  times(c: Complex): Complex {
    return new Complex(
      this.real.times(c.real).minus(this.imag.times(c.imag)),
      this.real.times(c.imag).plus(this.imag.times(c.real))
    );
  }
  abs(): Decimal {
    return this.real.times(this.real).plus(this.imag.times(this.imag)).sqrt();
  }
  square(): Complex {
    return this.times(this)
  }
  toString(): string {
    return this.real.toString() + " + " + this.imag.toString() + "i";
  }
  dot(c: Complex): Decimal {
    return this.real.times(c.real).plus(this.imag.times(c.imag));
  }

  divide(c: Complex): Complex {
    const denominator = c.real.times(c.real).plus(c.imag.times(c.imag));
    const realPart = this.real.times(c.real).plus(this.imag.times(c.imag)).dividedBy(denominator);
    const imagPart = this.imag.times(c.real).minus(this.real.times(c.imag)).dividedBy(denominator);
    return new Complex(realPart, imagPart);
}

  to_fast_complex(): FastComplex {
    return new FastComplex(this.real.toNumber(), this.imag.toNumber());
  }

  static series_to_vec2(series: Complex[]): vec2[] {
    let vec2_series: vec2[] = [];
    for (let i = 0; i < series.length; i++) {
      vec2_series.push(vec2.fromValues(series[i].real.toNumber(), series[i].imag.toNumber()));
    }
    return vec2_series;
  }

  static series_to_f32(series: Complex[], max_size: number): Float32Array {
    let flat = new Float32Array(series.length * 2);
    for (let i = 0; i < max_size; i++) {
      flat[i * 2] = series[i].real.toNumber();
      flat[i * 2 + 1] = series[i].imag.toNumber();
    }
    return flat;
  }

}
