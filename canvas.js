const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  console.error("browser lu cacad");
}

const vertexShaderSource = `
      attribute vec2 aPosition;
      attribute vec3 aColor;
      varying vec3 vColor;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vColor = aColor;
      }
    `;

const fragmentShaderSource = `
      precision mediump float;
      varying vec3 vColor;
      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("yg bener anj cape ni..:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(
  gl,
  fragmentShaderSource,
  gl.FRAGMENT_SHADER
);

if (!vertexShader || !fragmentShader) {
  console.error("dah lah cape");
}

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  console.error("ga bisa di link anj:", gl.getProgramInfoLog(shaderProgram));
  gl.deleteProgram(shaderProgram);
}

gl.useProgram(shaderProgram);

const vertices = new Float32Array([
  0.0, 0.8, 0.0, 1.0, 0.0, -0.8, -0.6, 1.0, 0.0, 0.0, 0.8, -0.6, 0.0, 0.0, 1.0,
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * 4, 0);
gl.enableVertexAttribArray(aPosition);

const aColor = gl.getAttribLocation(shaderProgram, "aColor");
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
gl.enableVertexAttribArray(aColor);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);
