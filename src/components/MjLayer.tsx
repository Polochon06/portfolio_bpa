import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { gsap } from 'gsap'

// ── GLSL ─────────────────────────────────────────────────────────────────
const VERT = `
attribute vec2 a;
varying   vec2 v;
void main(){ v = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform sampler2D uA, uB;
uniform float     uP, uT, uOp;
uniform vec2      uM;
varying vec2      v;

// Value noise
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1,0)), f.x),
             mix(h(i + vec2(0,1)), h(i + vec2(1)), f.x), f.y);
}

void main(){
  vec2 uv = v;
  // Mouse-driven UV parallax
  uv += uM * -0.022;
  // Organic noise distortion (time-animated)
  uv += (n(uv * 3.5 + uT * 0.06) - 0.5) * 0.009;

  // Noise-based dissolve between A and B
  float d    = n(uv * 6.0 + uT * 0.10);
  float edge = smoothstep(d - 0.07, d + 0.07, uP);

  vec4 col = mix(texture2D(uA, uv), texture2D(uB, uv), edge);
  gl_FragColor = col * uOp;
}
`

// ── Types ─────────────────────────────────────────────────────────────────
export type MjLayerHandle = {
  crossfadeTo: (idx: number) => void
  reveal:      ()            => void
}

type Props = { base?: string }

// ── Helpers ───────────────────────────────────────────────────────────────
function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  return s
}

function loadTex(gl: WebGLRenderingContext, src: string): Promise<WebGLTexture> {
  return new Promise(res => {
    const img  = new Image()
    img.onload = () => {
      const t = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      res(t)
    }
    img.onerror = () => res(gl.createTexture()!)  // silent fallback
    img.crossOrigin = ''
    img.src = src
  })
}

// ── Component ─────────────────────────────────────────────────────────────
export const MjLayer = forwardRef<MjLayerHandle, Props>(({ base = '' }, ref) => {
  const cvs   = useRef<HTMLCanvasElement>(null)
  const glR   = useRef<WebGLRenderingContext | null>(null)
  const pgR   = useRef<WebGLProgram | null>(null)
  const ta    = useRef<WebGLTexture | null>(null)   // scene being shown
  const tb    = useRef<WebGLTexture | null>(null)   // scene being faded to
  const uLoc  = useRef<Record<string, WebGLUniformLocation>>({})
  const st    = useRef({ p: 0, op: 0, mx: 0, my: 0, t: 0, busy: false })
  const rafR  = useRef(0)

  useImperativeHandle(ref, () => ({
    crossfadeTo(idx) {
      const g = glR.current
      if (!g || st.current.busy) return
      st.current.busy = true
      loadTex(g, `${base}/footage/mj-${idx + 1}.png`).then(newTex => {
        // Delete old "next" texture if it isn't "current"
        if (tb.current && tb.current !== ta.current) g.deleteTexture(tb.current)
        tb.current  = newTex
        st.current.p = 0
        gsap.to(st.current, {
          p: 1, duration: 1.6, ease: 'power2.inOut',
          onComplete: () => {
            // After dissolve: promote next → current, reset
            if (ta.current && ta.current !== newTex) g.deleteTexture(ta.current)
            ta.current   = newTex
            st.current.p = 0
            st.current.busy = false
          },
        })
      })
    },
    reveal() {
      gsap.to(st.current, { op: 0.28, duration: 1.8, delay: 0.35 })
    },
  }))

  useEffect(() => {
    const c = cvs.current!
    const g = c.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
    if (!g) return
    glR.current = g

    // Build program
    const prog = g.createProgram()!
    g.attachShader(prog, mkShader(g, g.VERTEX_SHADER,   VERT))
    g.attachShader(prog, mkShader(g, g.FRAGMENT_SHADER, FRAG))
    g.linkProgram(prog)
    pgR.current = prog

    // Full-screen quad
    const buf = g.createBuffer()
    g.bindBuffer(g.ARRAY_BUFFER, buf)
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), g.STATIC_DRAW)
    const aLoc = g.getAttribLocation(prog, 'a')
    g.enableVertexAttribArray(aLoc)
    g.vertexAttribPointer(aLoc, 2, g.FLOAT, false, 0, 0)

    // Uniform locations
    uLoc.current = {
      uA:  g.getUniformLocation(prog, 'uA')!,
      uB:  g.getUniformLocation(prog, 'uB')!,
      uP:  g.getUniformLocation(prog, 'uP')!,
      uT:  g.getUniformLocation(prog, 'uT')!,
      uOp: g.getUniformLocation(prog, 'uOp')!,
      uM:  g.getUniformLocation(prog, 'uM')!,
    }

    g.enable(g.BLEND)
    g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA)

    // 1×1 transparent texture as placeholder
    const empty = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, empty)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array([0,0,0,0]))
    ta.current = empty; tb.current = empty

    // Mouse tracking
    const onMouse = (e: MouseEvent) => {
      st.current.mx = e.clientX / window.innerWidth  - 0.5
      st.current.my = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMouse, { passive: true })

    // Render loop
    function frame(ms: number) {
      if (c.width !== window.innerWidth || c.height !== window.innerHeight) {
        c.width = window.innerWidth; c.height = window.innerHeight
        g.viewport(0, 0, c.width, c.height)
      }
      const s = st.current
      s.t = ms * 0.001
      g.clearColor(0,0,0,0); g.clear(g.COLOR_BUFFER_BIT)
      g.useProgram(prog)

      g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, ta.current!); g.uniform1i(uLoc.current.uA, 0)
      g.activeTexture(g.TEXTURE1); g.bindTexture(g.TEXTURE_2D, tb.current!); g.uniform1i(uLoc.current.uB, 1)
      g.uniform1f(uLoc.current.uP,  s.p)
      g.uniform1f(uLoc.current.uT,  s.t)
      g.uniform1f(uLoc.current.uOp, s.op)
      g.uniform2f(uLoc.current.uM,  s.mx, s.my)
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4)

      rafR.current = requestAnimationFrame(frame)
    }
    c.width = window.innerWidth; c.height = window.innerHeight
    g.viewport(0, 0, c.width, c.height)
    rafR.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafR.current)
      window.removeEventListener('mousemove', onMouse)
      g.deleteProgram(prog)
    }
  }, [base])

  return (
    <canvas
      ref={cvs}
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 2,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
})
MjLayer.displayName = 'MjLayer'
