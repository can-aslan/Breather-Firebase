/* function generateBreatherVertices(aa, uIncrement, vIncrement, uMax, vMax) {
    let vertices = [];

    for (let i = -uMax; i < uMax; i = i + uIncrement) {
        for (let j = -vMax; j < vMax; j = j + vIncrement) {
            const vertex = calculateBreather2(i, j, aa);
            
            vertices.push(...vertex);
        }
    }

    return vertices;
} */

function generateBreatherVertices2(aa, uIncrement, vIncrement, uMax, vMax) {
    let vertices = [];
    let normals = [];

    for (let u = -uMax; u < uMax; u += uIncrement) {
        for (let v = -vMax; v < vMax; v += vIncrement) {
            // Calculate four vertices of the current grid square
            let v1 = calculateBreather2(u, v, aa);
            let v2 = calculateBreather2(u + uIncrement, v, aa);
            let v3 = calculateBreather2(u, v + vIncrement, aa);
            let v4 = calculateBreather2(u + uIncrement, v + vIncrement, aa);

            // First triangle
            let normal1 = calculateNormalFromVertices(v1, v2, v3);
            vertices.push(...v1, ...v2, ...v3);
            normals.push(...normal1, ...normal1, ...normal1);

            // Second triangle
            let normal2 = calculateNormalFromVertices(v2, v3, v4);
            vertices.push(...v2, ...v3, ...v4);
            normals.push(...normal2, ...normal2, ...normal2);
        }
    }

    return { vertices, normals };
}

function calculateNormalFromVertices(v1, v2, v3) {
    const a = vec3(v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]);
    const b = vec3(v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]);

    return normalize(cross(a, b));
}

/* function calculateBreather(u, v, aa) {
    const w = Math.sqrt(1 - (aa * aa));
    const denom = (aa * aa) * (Math.pow(w * Math.cosh(aa * u), 2) + Math.pow(aa * Math.sin(w * v), 2));

    const x = -u + ((2 * (1 - (aa * aa)) * Math.cosh(aa * u) * Math.sinh(aa * u)) / denom);
    const y = ((2 * w * Math.cosh(aa * u)) / denom) * ((-w * Math.cos(v) * Math.cos(w * v)) - (Math.sin(v) * Math.sin(w * v)));
    const z = ((2 * w * Math.cosh(aa * u)) / denom) * ((-w * Math.sin(v) * Math.cos(w * v)) + (Math.cos(v) * Math.sin(w * v)));
    
    return [x, y, z, 1];
} */

function calculateBreather2(u, v, aa) {
    const wsqr = 1 - aa * aa;
    const w = Math.sqrt(wsqr);
    const denom =
        aa *
        (Math.pow(w * Math.cosh(aa * u), 2) +
            Math.pow(aa * Math.sin(w * v), 2));

    const x = -u + (2 * wsqr * Math.cosh(aa * u) * Math.sinh(aa * u)) / denom;
    const y =
        (2 *
            w *
            Math.cosh(aa * u) *
            (-(w * Math.cos(v) * Math.cos(w * v)) -
                Math.sin(v) * Math.sin(w * v))) /
        denom;
    const z =
        (2 *
            w *
            Math.cosh(aa * u) *
            (-(w * Math.sin(v) * Math.cos(w * v)) +
                Math.cos(v) * Math.sin(w * v))) /
        denom;

    return [x, y, z, 1];
}

/* function calculateBreatherWikipedia(u, v, a) {
    const oneMinusAA = 1 - (a * a);
    const oSqrt = Math.sqrt(oneMinusAA);
    const oSqrtV = oSqrt * v;
    const AA = a * a;
    const denom = a * ((oneMinusAA * sqr(Math.cosh(a*u))) + AA * sqr(Math.sin(oSqrtV)));

    const xUp = 2 * oneMinusAA * Math.cosh(a*u) * Math.sinh(a*u);
    const x = (xUp / denom) - u;

    const yUp = (2*oSqrt * Math.cosh(a*u)) * (((-oSqrt) * Math.cos(v) * Math.cos(oSqrtV)) - (Math.sin(v) * Math.sin(oSqrtV)));
    const y = yUp / denom;

    const zUp = (2*oSqrt * Math.cosh(a*u)) * (((-oSqrt) * Math.sin(v) * Math.cos(oSqrtV)) - (Math.cos(v) * Math.sin(oSqrtV)));
    const z = zUp / denom;

    return [x, y, z, 1];
} */

function sqr(val) {
    return Math.pow(val, 2);
}
