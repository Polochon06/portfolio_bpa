import { useEffect, useRef } from 'react'

const VERT = `
attribute vec2 aP;   /* NDC position */
attribute float aS;  /* base seed */
attribute float aSz; /* point size px */
uniform float uT;
uniform vec2  uM;    /* mouse NDC */
void main() {
  vec2 p = aP;
  p.x += sin(uT * 0.22 + aS * 9.42)  * 0.055;
  p.y += cos(uT * 0.17 + aS * 7.13)  * 0.040;
  /* gentle mouse repulsion */
  vec2 d = p - uM;
  float r = length(d);
  if (r < 0.28) p += normalize(d) * (0.28 - r) * 0.14;
  gl_Position  = vec4(p, 0.0, 1.0);
  gl_PointSize = aSz;
}
`

const FRAG = `
precision mediump float;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.15, d) * 0.55;
  /* warm gold #c9a84c */
  gl_FragColor = vec4(0.788, 0.659, 0.298, a);
}
`

const COUNT = 220

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src); gl.compileShader(s); return s
}

export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current!
    const gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
    if (!gl) return

    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER,   VERT))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)

    const pos   = new Float32Array(COUNT * 2)
    const seeds = new Float32Array(COUNT)
    const sizes = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i*2]   = (Math.random() - 0.5) * 2
      pos[i*2+1] = (Math.random() - 0.5) * 2
      seeds[i]   = Math.random()
      sizes[i]   = 1.5 + Math.random() * 3
    }

    function attr(name: string, data: Float32Array, size: number) {
      const buf = gl.createBuffer()!
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, name)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
    }

    gl.useProgram(prog)
    attr('aP',  pos,   2)
    attr('aS',  seeds, 1)
    attr('aSz', sizes, 1)

    const uT = gl.getUniformLocation(prog, 'uT')!
    const uM = gl.getUniformLocation(prog, 'uM')!

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    let mx = 0, my = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2
      my = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    let raf = 0
    function frame(ms: number) {
      if (c.width  !== window.innerWidth)  { c.width  = window.innerWidth  }
      if (c.height !== window.innerHeight) { c.height = window.innerHeight }
      gl.viewport(0, 0, c.width, c.height)
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(prog)
      gl.uniform1f(uT, ms * 0.001)
      gl.uniform2f(uM, mx, my)
      gl.drawArrays(gl.POINTS, 0, COUNT)
      raf = requestAnimationFrame(frame)
    }
    c.width = window.innerWidth; c.height = window.innerHeight
    gl.viewport(0, 0, c.width, c.height)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 1, pointerEvents: 'none', display: 'block',
      }}
    />
  )
}
