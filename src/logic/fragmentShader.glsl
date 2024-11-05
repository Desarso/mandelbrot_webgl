precision highp float;

varying vec2 v_position;
uniform int u_maxIterations;
uniform float width_per_pixel;
uniform float u_width;
uniform float u_height;
uniform vec2 u_shift;

#define MAX_REF_ITER 40
uniform vec2 u_referenceOrbit[MAX_REF_ITER];

// Function to convert HSL to RGB
vec3 hslToRgb(vec3 hsl) {
    float c = hsl.z * hsl.y;
    float x = c * (1.0 - abs(mod(hsl.x * 6.0, 2.0) - 1.0));
    float m = hsl.z - c;
    vec3 rgb;

    if(hsl.x < 1.0 / 6.0) {
        rgb = vec3(c, x, 0.0);
    } else if(hsl.x < 1.0 / 3.0) {
        rgb = vec3(x, c, 0.0);
    } else if(hsl.x < 0.5) {
        rgb = vec3(0.0, c, x);
    } else if(hsl.x < 2.0 / 3.0) {
        rgb = vec3(0.0, x, c);
    } else if(hsl.x < 5.0 / 6.0) {
        rgb = vec3(x, 0.0, c);
    } else {
        rgb = vec3(c, 0.0, x);
    }

    return rgb + vec3(m);
}

void main() {
    vec2 delta_z = vec2(0.0 , 0.0);

    highp float x = gl_FragCoord.x + u_shift.x;
    highp float y = gl_FragCoord.y+ u_shift.y;
    vec2 ref = vec2(u_width/2.0, u_height/2.0);
  
   // Calculate the current view center in the complex plane, including the shift
    vec2 center = vec2(ref.x * width_per_pixel + u_shift.x, ref.y * width_per_pixel + u_shift.y);


    vec2 d = vec2(x - ref.x, y - ref.y);
    vec2 delta_0 = vec2(d.x * width_per_pixel, d.y * width_per_pixel);

//    vec2 new_position = center + delta_0;

    vec2 z = vec2(-0.67292990169123676967, -0.39453993456454988183);
    int ref_iteration = 0;
    int max_sub_iter = 38;
    int iteration = 0;
    float delta_z_x = 0.0;
    float delta_z_y = 0.0;
    float z_x = 0.0;
    float z_y = 0.0;

    for(int i = 0; i < 1000; i++) {

        //break if loop is bigger than actual max iterations which is 
        if(iteration >= u_maxIterations) {
            break;
        }

        if(ref_iteration == 0) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[0].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[0].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[1].x + delta_z.x;
            z_y = u_referenceOrbit[1].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 1) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[1].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[1].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[2].x + delta_z.x;
            z_y = u_referenceOrbit[2].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 2) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[2].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[2].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[3].x + delta_z.x;
            z_y = u_referenceOrbit[3].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 3) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[3].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[3].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[4].x + delta_z.x;
            z_y = u_referenceOrbit[4].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 4) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[4].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[4].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[5].x + delta_z.x;
            z_y = u_referenceOrbit[5].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 5) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[5].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[5].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[6].x + delta_z.x;
            z_y = u_referenceOrbit[6].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 6) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[6].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[6].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[7].x + delta_z.x;
            z_y = u_referenceOrbit[7].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 7) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[7].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[7].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[8].x + delta_z.x;
            z_y = u_referenceOrbit[8].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 8) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[8].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[8].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[9].x + delta_z.x;
            z_y = u_referenceOrbit[9].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 9) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[9].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[9].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[10].x + delta_z.x;
            z_y = u_referenceOrbit[10].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 10) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[10].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[10].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[11].x + delta_z.x;
            z_y = u_referenceOrbit[11].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 11) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[11].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[11].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[12].x + delta_z.x;
            z_y = u_referenceOrbit[12].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 12) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[12].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[12].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[13].x + delta_z.x;
            z_y = u_referenceOrbit[13].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 13) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[13].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[13].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[14].x + delta_z.x;
            z_y = u_referenceOrbit[14].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 14) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[14].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[14].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[15].x + delta_z.x;
            z_y = u_referenceOrbit[15].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 15) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[15].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[15].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[16].x + delta_z.x;
            z_y = u_referenceOrbit[16].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 16) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[16].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[16].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[17].x + delta_z.x;
            z_y = u_referenceOrbit[17].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 17) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[17].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[17].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[18].x + delta_z.x;
            z_y = u_referenceOrbit[18].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 18) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[18].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[18].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[19].x + delta_z.x;
            z_y = u_referenceOrbit[19].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 19) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[19].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[19].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[20].x + delta_z.x;
            z_y = u_referenceOrbit[20].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 20) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[20].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[20].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[21].x + delta_z.x;
            z_y = u_referenceOrbit[21].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 21) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[21].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[21].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[22].x + delta_z.x;
            z_y = u_referenceOrbit[22].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 22) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[22].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[22].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[23].x + delta_z.x;
            z_y = u_referenceOrbit[23].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 23) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[23].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[23].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[24].x + delta_z.x;
            z_y = u_referenceOrbit[24].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 24) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[24].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[24].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[25].x + delta_z.x;
            z_y = u_referenceOrbit[25].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 25) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[25].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[25].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[26].x + delta_z.x;
            z_y = u_referenceOrbit[26].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 26) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[26].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[26].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[27].x + delta_z.x;
            z_y = u_referenceOrbit[27].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 27) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[27].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[27].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[28].x + delta_z.x;
            z_y = u_referenceOrbit[28].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 28) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[28].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[28].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[29].x + delta_z.x;
            z_y = u_referenceOrbit[29].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 29) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[29].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[29].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[30].x + delta_z.x;
            z_y = u_referenceOrbit[30].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 30) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[30].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[30].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[31].x + delta_z.x;
            z_y = u_referenceOrbit[31].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 31) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[31].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[31].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[32].x + delta_z.x;
            z_y = u_referenceOrbit[32].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 32) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[32].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[32].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[33].x + delta_z.x;
            z_y = u_referenceOrbit[33].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 33) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[33].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[33].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[34].x + delta_z.x;
            z_y = u_referenceOrbit[34].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 34) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[34].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[34].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[35].x + delta_z.x;
            z_y = u_referenceOrbit[35].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 35) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[35].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[35].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[36].x + delta_z.x;
            z_y = u_referenceOrbit[36].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 36) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[36].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[36].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[37].x + delta_z.x;
            z_y = u_referenceOrbit[37].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 37) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[37].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[37].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[38].x + delta_z.x;
            z_y = u_referenceOrbit[38].y + delta_z.y;
            z = vec2(z_x, z_y);

        } else if(ref_iteration == 38) {
            delta_z_x = (2.0 * delta_z.x * u_referenceOrbit[38].x) + (delta_z.x * delta_z.x) - (delta_z.y * delta_z.y) + delta_0.x;
            delta_z_y = (2.0 * delta_z.y * u_referenceOrbit[38].y) + (2.0 * delta_z.x * delta_z.y) + delta_0.y;
            delta_z = vec2(delta_z_x, delta_z_y);

            z_x = u_referenceOrbit[39].x + delta_z.x;
            z_y = u_referenceOrbit[39].y + delta_z.y;
            z = vec2(z_x, z_y);

        }
        ref_iteration++;

        if(length(z) > 2.0) {
            break;
        }

        if(length(z) < length(delta_z)) {
            delta_z = z;
            ref_iteration = 0;
        } else if(ref_iteration >= max_sub_iter) {
            delta_z = z;
            ref_iteration = 0;
        }

        iteration++;
    }

    float mu = 0.0;
    float modulus = length(z);

    if(modulus > 1.0 && iteration < u_maxIterations) {
        mu = float(iteration);
    } else {
        mu = float(u_maxIterations);
    }

    if(mu == float(u_maxIterations)) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
         //gl_FragColor = vec4(v_position, 0.0, 1.0);
    } else {
        // float hue = mix(0.0, 1.0, mu / float(u_maxIterations));
        // vec3 hsl = vec3(hue, 1.0, 0.5);
        // vec3 rgb = hslToRgb(hsl);
        // gl_FragColor = vec4(rgb, 1.0);
        float hue = mu / float(u_maxIterations); // Calculate hue based on iteration
        vec3 hsl = vec3(hue, 1.0, 1.0); // Full saturation and mid-lightness
        vec3 rgb = hslToRgb(hsl);
        gl_FragColor = vec4(rgb, 1.0); // Output calculated color
    }
}