export class FastComplex{
    real: number;
    imag: number;
    constructor(real: number, imag: number) {
        this.real = real;
        this.imag = imag;
    }
    add(c: FastComplex): FastComplex {
        return new FastComplex(this.real + c.real, this.imag + c.imag);
    }
    minus(c: FastComplex): FastComplex {
        return new FastComplex(this.real - c.real, this.imag - c.imag);
    }
    times(c: FastComplex): FastComplex {
        return new FastComplex(
            this.real * c.real - this.imag * c.imag,
            this.real * c.imag + this.imag * c.real
        );
    }
    abs(): number {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
    square(): FastComplex {
        return new FastComplex(
            this.real * this.real - this.imag * this.imag,
            this.real * this.imag + this.imag * this.real
        );
    }
    divide(c: FastComplex){
        const denominator = c.real *c.real + c.imag *c.imag;
        //const realPart = this.real.times(c.real).plus(this.imag.times(c.imag)).dividedBy(denominator);
        const realPart = (this.real * c.real + this.imag * c.imag)/denominator;
        //const imagPart = this.imag.times(c.real).minus(this.real.times(c.imag)).dividedBy(denominator);
        const imagPart = (this.imag * c.real - this.real * c.imag) / denominator;
        return new FastComplex(realPart, imagPart);
    }


    toString(): string {
        return this.real.toString() + " + " + this.imag.toString() + "i";
    }
    dot(c: FastComplex): number {
        return this.real * c.real + this.imag * c.imag;
    }
}

// export class FastComplex {
//     private data: Float32Array;

//     constructor(real: number, imag: number) {
//         this.data = new Float32Array(2);
//         this.data[0] = real; // real part
//         this.data[1] = imag; // imaginary part
//     }

//     get real(): number {
//         return this.data[0];
//     }

//     get imag(): number {
//         return this.data[1];
//     }

//     add(c: FastComplex): FastComplex {
//         return new FastComplex(this.real + c.real, this.imag + c.imag);
//     }

//     minus(c: FastComplex): FastComplex {
//         return new FastComplex(this.real - c.real, this.imag - c.imag);
//     }

//     times(c: FastComplex): FastComplex {
//         return new FastComplex(
//             this.real * c.real - this.imag * c.imag,
//             this.real * c.imag + this.imag * c.real
//         );
//     }

//     abs(): number {
//         return Math.sqrt(this.real * this.real + this.imag * this.imag);
//     }

//     square(): FastComplex {
//         return new FastComplex(
//             this.real * this.real - this.imag * this.imag,
//             this.real * this.imag + this.imag * this.real
//         );
//     }

//     divide(c: FastComplex): FastComplex {
//         const denominator = c.real * c.real + c.imag * c.imag;
//         const realPart = (this.real * c.real + this.imag * c.imag) / denominator;
//         const imagPart = (this.imag * c.real - this.real * c.imag) / denominator;
//         return new FastComplex(realPart, imagPart);
//     }

//     toString(): string {
//         return this.real.toString() + " + " + this.imag.toString() + "i";
//     }

//     dot(c: FastComplex): number {
//         return this.real * c.real + this.imag * c.imag;
//     }
// }
