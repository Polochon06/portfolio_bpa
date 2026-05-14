import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { Player } from '@remotion/player'
import { CinematicFX } from '../remotion/compositions/CinematicFX'
import { SplineScene } from './components/SplineScene'
import { MjLayer, MjLayerHandle } from './components/MjLayer'

const BASE = '/portfolio_bpa'
const SCENE_COUNT = 8

// ── SPLINE 3D SCENES ───────────────────────────────────────────────────────
// Crée tes scènes sur spline.design → Exporter → "Viewer Link" →
// copie l'URL prod.spline.design/.../scene.splinecode
const SPLINE = {
  hero:    '',   // S1 — ex: particules 3D / titre holographique
  about:   '',   // S3 — ex: sphère flottante / géométrie abstraite
  stack:   '',   // S6 — ex: orbite tech / cubes 3D
  contact: '',   // S8 — ex: géométrie interactive (pointer-events actifs)
}

const TINTS = [
  'rgba(201,168,76,0.07)',
  'rgba(180,110,30,0.11)',
  'rgba(30,55,110,0.10)',
  'rgba(15,35,90,0.13)',
  'rgba(25,75,50,0.10)',
  'rgba(55,15,95,0.10)',
  'rgba(115,15,20,0.11)',
  'rgba(201,168,76,0.06)',
]

const NAV_LABELS  = ['Home', 'Vision', 'Profil', 'MT-Congés', 'Gymnova', 'Stack', 'Taste', 'Contact']
const STATUSES    = [
  'Développeur Créatif',
  'Vision',
  'Profil',
  'Projet 01 — MT-Congés',
  'Projet 02 — Gymnova',
  'Stack Technique',
  'Taste · Direction Artistique',
  'Contact',
]

export function Portfolio() {
  const activeRef    = useRef(0)
  const lastNavRef   = useRef(0)
  const heroInitDone = useRef(false)
  const charMap      = useRef(new Map<number, HTMLElement[]>())
  const wVelRef      = useRef(0)
  const wRafRef      = useRef(0)
  const abObj        = useRef({ val: 0 })
  const mjLayerRef   = useRef<MjLayerHandle>(null)

  // Aberration value fed into Remotion Player
  const [aberration, setAberration] = useState(0)
  const setAbRef = useRef(setAberration)
  setAbRef.current = setAberration

  // Spike aberration on scene transition, GSAP animates it back to 0
  const triggerAberration = useCallback(() => {
    abObj.current.val = 1
    setAbRef.current(1)
    gsap.to(abObj.current, {
      val: 0, duration: 0.55, ease: 'power2.out',
      onUpdate: () => setAbRef.current(abObj.current.val),
    })
  }, [])
  const triggerAbRef = useRef(triggerAberration)
  triggerAbRef.current = triggerAberration

  useEffect(() => {
    const scenes    = Array.from(document.querySelectorAll<HTMLElement>('.scene'))
    const navDots   = Array.from(document.querySelectorAll<HTMLButtonElement>('.nav-dot'))
    const barStatus = document.getElementById('bar-status')!
    const progBar   = document.getElementById('progress-bar')!
    const overlay   = document.getElementById('scene-overlay')!
    const tintEl    = document.getElementById('scene-tint')!
    const sfCur     = document.getElementById('sf-cur')!
    const fracEl    = document.getElementById('scene-fraction')!

    const VP = Array.from({ length: SCENE_COUNT }, (_, i) => [
      document.getElementById(`v${i + 1}i`) as HTMLVideoElement,
      document.getElementById(`v${i + 1}l`) as HTMLVideoElement,
    ] as const)

    type SD = { el: HTMLElement; lines: HTMLElement[]; fades: HTMLElement[] }
    const SD: SD[] = scenes.map(el => ({
      el,
      lines: Array.from(el.querySelectorAll<HTMLElement>('.ti')),
      fades: Array.from(el.querySelectorAll<HTMLElement>('.fade-in')),
    }))

    // ── Char split avec blur cinématique ───────────────────────────────────
    function buildChars(lines: HTMLElement[]): HTMLElement[] {
      const all: HTMLElement[] = []
      lines.forEach(li => {
        const isEm = li.classList.contains('is-em')
        const text = li.textContent ?? ''
        li.innerHTML = ''
        for (const ch of text) {
          const clip  = document.createElement('span')
          clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;line-height:inherit'
          const inner = document.createElement('span')
          inner.style.cssText = 'display:inline-block;filter:blur(14px);opacity:0'
          if (isEm) inner.style.cssText += ';font-style:italic;color:rgba(240,235,224,0.45)'
          inner.textContent = ch === ' ' ? ' ' : ch
          clip.appendChild(inner); li.appendChild(clip); all.push(inner)
        }
      })
      return all
    }

    // ── Scramble text (remplace typeTag) ───────────────────────────────────
    const SCRAMBLE = '!<>—_/[]{}=+*?@&%#$ABCDEFabcdef0123456789'
    function scrambleText(el: HTMLElement, delay: number) {
      if (!el.dataset.text) el.dataset.text = el.textContent ?? ''
      const target = el.dataset.text
      let frame = 0
      const SETTLE = 4
      const tick = () => {
        let out = ''
        for (let i = 0; i < target.length; i++) {
          if (target[i] === ' ' || target[i] === '·' || target[i] === '—') { out += target[i]; continue }
          out += frame >= i * SETTLE + 10
            ? target[i]
            : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
        }
        el.textContent = out
        if (frame++ < target.length * SETTLE + 16) requestAnimationFrame(tick)
        else el.textContent = target
      }
      setTimeout(() => { el.textContent = ''; requestAnimationFrame(tick) }, delay * 1000)
    }

    // ── Count-up pour les chiffres ──────────────────────────────────────────
    function countUp(el: HTMLElement, delay: number) {
      const raw = el.textContent ?? ''
      if (!el.dataset.origText) el.dataset.origText = raw
      const m   = raw.match(/(\d+)/)
      if (!m) return
      const target = parseInt(m[1])
      const pre    = raw.slice(0, m.index!)
      const suf    = raw.slice(m.index! + m[1].length)
      setTimeout(() => {
        const t0  = performance.now()
        const dur = 1600
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1)
          const e = 1 - Math.pow(1 - p, 4)
          el.textContent = pre + Math.round(e * target) + suf
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }, delay * 1000)
    }

    // ── Word reveal pour le body text ───────────────────────────────────────
    function wordReveal(el: HTMLElement, delay: number): HTMLElement[] {
      if (!el.dataset.origHtml) el.dataset.origHtml = el.innerHTML
      const text = el.textContent ?? ''
      el.innerHTML = ''
      const spans: HTMLElement[] = []
      text.split(' ').forEach((word, i, arr) => {
        const clip  = document.createElement('span')
        clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:baseline'
        const inner = document.createElement('span')
        inner.style.cssText = 'display:inline-block;transform:translateY(105%)'
        inner.textContent   = word + (i < arr.length - 1 ? ' ' : '')
        clip.appendChild(inner); el.appendChild(clip); spans.push(inner)
        gsap.to(inner, { y: '0%', duration: 0.6, delay: delay + i * 0.055, ease: 'power3.out' })
      })
      return spans
    }

    const wordMap = new Map<number, HTMLElement[]>()

    function showText(sd: SD, idx: number) {
      const chars = buildChars(sd.lines)
      charMap.current.set(idx, chars)

      // Chars : blur + slide vers le haut
      gsap.fromTo(chars,
        { y: '120%', filter: 'blur(14px)', opacity: 0 },
        { y: '0%',   filter: 'blur(0px)',  opacity: 1,
          duration: 0.88, stagger: 0.022, ease: 'expo.out', delay: 0.15 }
      )

      if (idx === 0) {
        gsap.fromTo(['.hero-eyebrow', '.hero-sub'], { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.18, ease: 'power2.out', delay: 0.65 })
        gsap.to('.scroll-hint', { opacity: 0.85, duration: 0.7, ease: 'power2.out', delay: 1.1 })
        return
      }

      // Ligne gold
      sd.fades.filter(el => el.classList.contains('gold-line'))
        .forEach(el => gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out' }))

      // Tags : scramble
      sd.fades.filter(el => el.classList.contains('scene-tag'))
        .forEach(el => scrambleText(el, 0.04))

      // Stats : countUp
      sd.fades.filter(el => el.classList.contains('stat-val'))
        .forEach((el, i) => countUp(el, 0.7 + i * 0.12))

      // Body text : word reveal
      const bodyEls = sd.fades.filter(el =>
        el.classList.contains('scene-body') && !el.classList.contains('gold-line') && !el.classList.contains('scene-tag'))
      const allWords: HTMLElement[] = []
      bodyEls.forEach((el, i) => {
        gsap.set(el, { opacity: 1, y: 0 })   // parent visible; inner spans handle motion
        const ws = wordReveal(el, 1.0 + i * 0.08)
        allWords.push(...ws)
      })
      if (allWords.length) wordMap.set(idx, allWords)

      // Reste des fade-in (proj-num, tags, cta, feat-list…)
      sd.fades.filter(el =>
        !el.classList.contains('gold-line') &&
        !el.classList.contains('scene-tag') &&
        !el.classList.contains('stat-val') &&
        !el.classList.contains('scene-body')
      ).forEach((el, i) =>
        gsap.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.82, ease: 'power3.out', delay: 0.9 + i * 0.1 })
      )
    }

    function hideText(sd: SD, idx: number) {
      gsap.killTweensOf([...sd.lines, ...sd.fades, ...(charMap.current.get(idx) ?? []), ...(wordMap.get(idx) ?? [])])
      sd.lines.forEach(li => {
        gsap.killTweensOf(li)
        const t = li.textContent ?? ''
        li.textContent = t
        gsap.set(li, { clearProps: 'transform' })
      })
      charMap.current.delete(idx)
      wordMap.delete(idx)
      sd.fades.forEach(el => {
        if (el.classList.contains('gold-line')) gsap.set(el, { scaleX: 0 })
        else gsap.set(el, { opacity: 0, y: 20 })
        if (el.classList.contains('scene-tag') && el.dataset.text) el.textContent = el.dataset.text
        if (el.classList.contains('stat-val') && el.dataset.origText) { el.textContent = el.dataset.origText; delete el.dataset.origText }
        if (el.classList.contains('scene-body') && el.dataset.origHtml) { el.innerHTML = el.dataset.origHtml; delete el.dataset.origHtml }
      })
      if (idx === 0) gsap.set(['.hero-eyebrow', '.hero-sub', '.scroll-hint'], { opacity: 0 })
    }

    function setTint(idx: number) {
      gsap.to(tintEl, { backgroundColor: TINTS[idx] ?? 'transparent', duration: 1.4, ease: 'power2.out' })
    }

    function enterScene(idx: number) {
      const [intro, loop] = VP[idx]
      gsap.set([intro, loop], { opacity: 0 })
      gsap.set(loop, { scale: 1.08, x: 0, y: 0, force3D: true })
      intro.currentTime = 0; loop.currentTime = 0
      if (loop.preload === 'none') { loop.preload = 'auto'; loop.load() }
      if (idx + 1 < VP.length) {
        const ni = VP[idx + 1][0]
        if (ni.preload === 'none') { ni.preload = 'metadata'; ni.load() }
      }
      gsap.to(intro, { opacity: 1, duration: 0.5, ease: 'power1.out' })
      intro.play().catch(() => {})
      intro.addEventListener('ended', function () {
        if (activeRef.current !== idx) return
        gsap.to(intro, { opacity: 0, duration: 0.9, ease: 'power1.out' })
        gsap.fromTo(loop, { opacity: 0 }, { opacity: 1, duration: 1.1, ease: 'power1.out' })
        loop.play().catch(() => {})
        if (idx === 0 && !heroInitDone.current) { heroInitDone.current = true; return }
        showText(SD[idx], idx)
      }, { once: true })
    }

    function leaveScene(idx: number) {
      const [intro, loop] = VP[idx]
      intro.pause(); loop.pause()
      gsap.set([intro, loop], { opacity: 0, x: 0, y: 0 })
    }

    function goTo(toIdx: number) {
      if (Date.now() - lastNavRef.current < 900) return
      if (toIdx === activeRef.current || toIdx < 0 || toIdx >= SCENE_COUNT) return
      lastNavRef.current = Date.now()
      const prevIdx = activeRef.current
      activeRef.current = toIdx
      hideText(SD[prevIdx], prevIdx)
      navDots.forEach((d, j) => d.classList.toggle('active', j === toIdx))
      barStatus.textContent = STATUSES[toIdx]
      progBar.style.width = `${(toIdx / (SCENE_COUNT - 1)) * 100}%`
      sfCur.textContent = String(toIdx + 1).padStart(2, '0')
      setTint(toIdx)
      triggerAbRef.current()  // ← Remotion aberration spike
      mjLayerRef.current?.crossfadeTo(toIdx)
      gsap.to(overlay, {
        opacity: 1, duration: 0.3, ease: 'power2.inOut',
        onComplete() {
          SD[prevIdx].el.classList.remove('active')
          SD[toIdx].el.classList.add('active')
          leaveScene(prevIdx)
          enterScene(toIdx)
          gsap.to(overlay, { opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.05 })
        },
      })
    }

    const eyebrow = document.querySelector<HTMLElement>('.hero-eyebrow')!
    const sub     = document.querySelector<HTMLElement>('.hero-sub')!
    const hint    = document.querySelector<HTMLElement>('.scroll-hint')!
    gsap.set([eyebrow, sub, hint], { opacity: 0 })

    function startSite() {
      navDots[0]?.classList.add('active')
      barStatus.textContent = STATUSES[0]
      enterScene(0); setTint(0)
      gsap.to(fracEl, { opacity: 1, duration: 1, delay: 0.6 })

      mjLayerRef.current?.crossfadeTo(0)
      mjLayerRef.current?.reveal()

      const heroChars = buildChars(SD[0].lines)
      charMap.current.set(0, heroChars)
      const siteTl = gsap.timeline({ delay: 0.4 })
      siteTl.fromTo(eyebrow,
        { opacity: 0, filter: 'blur(8px)', y: 8 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.85, ease: 'power3.out' })
      siteTl.fromTo(heroChars,
        { y: '120%', filter: 'blur(14px)', opacity: 0 },
        { y: '0%',   filter: 'blur(0px)',  opacity: 1, duration: 0.88, stagger: 0.022, ease: 'expo.out' },
        '-=0.42')
      siteTl.fromTo(sub,
        { opacity: 0, filter: 'blur(8px)', y: 8 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.85, ease: 'power3.out' },
        '-=0.52')
      siteTl.to(hint, {
        opacity: 1, duration: 0.7, ease: 'power2.out',
        onComplete: () => gsap.to(hint, { opacity: 0.85, y: -5, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut', delay: 2 }),
      }, '-=0.48')
    }

    // ── LOADER ─────────────────────────────────────────────────────────
    const loaderEl   = document.getElementById('loader')!
    const loaderBar  = document.getElementById('loader-bar-fill')!
    const loaderEye  = document.getElementById('loader-eyebrow-lbl')!
    const loaderName = document.querySelectorAll<HTMLElement>('#loader-name > *')

    gsap.timeline({
      onComplete: () =>
        gsap.to(loaderEl, {
          opacity: 0, duration: 0.65, ease: 'power2.inOut',
          onComplete: () => { loaderEl.style.display = 'none'; startSite() },
        }),
    })
      .to(loaderEye,  { opacity: 1, y: 0, duration: 0.7,  ease: 'power3.out' }, 0.15)
      .to(loaderName, { opacity: 1, y: 0, duration: 0.85, stagger: 0.16, ease: 'power3.out' }, 0.35)
      .to(loaderBar,  { width: '100%', duration: 1.9, ease: 'power1.inOut' }, 0.25)
      .to({}, { duration: 0.35 })

    function wheelTick() {
      if (Math.abs(wVelRef.current) > 8) { goTo(activeRef.current + (wVelRef.current > 0 ? 1 : -1)); wVelRef.current = 0; wRafRef.current = 0; return }
      wVelRef.current *= 0.78
      if (Math.abs(wVelRef.current) > 0.4) wRafRef.current = requestAnimationFrame(wheelTick)
      else { wVelRef.current = 0; wRafRef.current = 0 }
    }
    const onWheel      = (e: WheelEvent)      => { wVelRef.current += e.deltaY * 0.45; if (!wRafRef.current) wRafRef.current = requestAnimationFrame(wheelTick) }
    let ty0 = 0
    const onTouchStart = (e: TouchEvent)      => { ty0 = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent)      => { const d = ty0 - e.changedTouches[0].clientY; if (Math.abs(d) > 40) goTo(activeRef.current + (d > 0 ? 1 : -1)) }
    const onKeyDown    = (e: KeyboardEvent)   => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(activeRef.current + 1)
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goTo(activeRef.current - 1)
    }
    const onMouseMove  = (e: MouseEvent)      => {
      gsap.set('#cursor-dot',  { x: e.clientX, y: e.clientY })
      gsap.to('#cursor-ring',  { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(VP[activeRef.current][1], { x: nx * 24, y: ny * 24, duration: 1.8, ease: 'power2.out', overwrite: 'auto' })
    }

    navDots.forEach((d, i) => d.addEventListener('click', () => goTo(i)))
    document.getElementById('logo-btn')?.addEventListener('click', () => goTo(0))
    window.addEventListener('wheel', onWheel, { passive: true })
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Cursor hover expand on interactive elements
    Array.from(document.querySelectorAll<HTMLElement>('a, button, .nav-dot')).forEach(el => {
      el.addEventListener('mouseenter', () => gsap.to('#cursor-ring', { scale: 1.7, duration: 0.22 }))
      el.addEventListener('mouseleave', () => gsap.to('#cursor-ring', { scale: 1,   duration: 0.22 }))
    })
    const onCursorShow = () => gsap.to(['#cursor-dot', '#cursor-ring'], { opacity: 1, duration: 0.3 })
    const onCursorHide = () => gsap.to(['#cursor-dot', '#cursor-ring'], { opacity: 0, duration: 0.3 })
    document.addEventListener('mouseenter', onCursorShow)
    document.addEventListener('mouseleave', onCursorHide)

    return () => {
      window.removeEventListener('wheel', onWheel)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onCursorShow)
      document.removeEventListener('mouseleave', onCursorHide)
    }
  }, [])

  return (
    <>
      {/* LOADER */}
      <div id="loader">
        <div className="loader-inner">
          <p id="loader-eyebrow-lbl">Développeur Créatif</p>
          <h1 id="loader-name">
            <span>Paul</span>
            <em>Blanc</em>
          </h1>
          <div id="loader-bar-track">
            <div id="loader-bar-fill" />
          </div>
        </div>
      </div>

      {/* CURSOR */}
      <div id="cursor-dot"  aria-hidden="true" />
      <div id="cursor-ring" aria-hidden="true" />

      {/* MIDJOURNEY ATMOSPHERIC LAYER — WebGL shader */}
      <MjLayer ref={mjLayerRef} base={BASE} />

      <div id="cinematic-bg">
        {Array.from({ length: SCENE_COUNT }, (_, i) => <VideoGroup key={i} idx={i + 1} base={BASE} />)}
      </div>

      <div id="scene-tint" aria-hidden="true" />

      {/* Remotion CinematicFX — animated grain + aberration */}
      <div id="remotion-fx" aria-hidden="true">
        <Player
          component={CinematicFX}
          inputProps={{ aberration }}
          durationInFrames={200}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          loop
          autoPlay
          style={{ width: '100%', height: '100%' }}
          acknowledgeRemotionLicense
        />
      </div>

      <div id="top-bar">
        <button className="bar-logo" id="logo-btn">Paul Blanc</button>
        <span id="bar-status" />
      </div>

      <nav id="scene-nav">
        {NAV_LABELS.map((label, i) => (
          <button key={i} className="nav-dot" data-scene={i} data-label={label} aria-label={label} />
        ))}
      </nav>

      <div id="progress-bar" />

      <div id="scene-fraction" aria-hidden="true">
        <span className="sf-cur" id="sf-cur">01</span>
        <span className="sf-dash" />
        <span>08</span>
      </div>

      {/* S1 HERO */}
      <section className="scene active" id="s1">
        <SplineScene scene={SPLINE.hero} className="spline-layer spline-hero" />
        <div className="scene-inner">
          <p className="hero-eyebrow">Normandie · France · 2025</p>
          <h1 className="hero-title">
            <span className="tl"><span className="ti">Paul</span></span>
            <span className="tl"><span className="ti is-em">Blanc</span></span>
          </h1>
          <p className="hero-sub">Développeur Créatif &amp; Motion Designer</p>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-hint-line" />Découvrir
        </div>
      </section>

      {/* S2 VISION */}
      <section className="scene" id="s2">
        <div className="scene-inner">
          <div className="scene-tag fade-in">Manifeste · 01</div>
          <div className="gold-line fade-in" />
          <h2 className="scene-title">
            <span className="tl"><span className="ti">L'interface</span></span>
            <span className="tl"><span className="ti">est une</span></span>
            <span className="tl"><span className="ti is-em">mise en scène.</span></span>
          </h2>
          <p className="scene-body fade-in">Je ne construis pas des pages — je <strong>choreographie des expériences</strong>. Chaque animation a un rythme, chaque transition raconte quelque chose. Du back-end rigoureux à l'interface cinématique, tout est conçu pour provoquer une réaction.</p>
        </div>
      </section>

      {/* S3 À PROPOS */}
      <section className="scene" id="s3">
        <SplineScene scene={SPLINE.about} className="spline-layer spline-right" />
        <div className="scene-inner">
          <div className="scene-tag fade-in">BTS SIO SLAM · Normandie · 2025</div>
          <h2 className="scene-title">
            <span className="tl"><span className="ti">Trois</span></span>
            <span className="tl"><span className="ti">disciplines,</span></span>
            <span className="tl"><span className="ti is-em">une signature.</span></span>
          </h2>
          <p className="scene-body fade-in">Java pour la rigueur architecturale. React pour l'interface vivante. Motion Design pour l'âme. Je pense en <strong>systèmes complets</strong> — de la base de données jusqu'à l'animation finale.</p>
          <div className="stat-row fade-in">
            <div><div className="stat-val">5+</div><div className="stat-lbl">Projets livrés</div></div>
            <div><div className="stat-val">3</div><div className="stat-lbl">Disciplines</div></div>
            <div><div className="stat-val">∞</div><div className="stat-lbl">Curiosité</div></div>
          </div>
        </div>
      </section>

      {/* S4 MT-CONGÉS */}
      <section className="scene" id="s4">
        <div className="scene-inner">
          <div className="proj-num-bg fade-in">01</div>
          <div className="proj-meta fade-in">Java 17 · Architecture MVC · 2024</div>
          <h2 className="scene-title proj-title">
            <span className="tl"><span className="ti">MT-</span></span>
            <span className="tl"><span className="ti is-em">Congés</span></span>
          </h2>
          <p className="scene-body fade-in">Système RH conçu pour la production — rôles hiérarchiques, workflow de validation multi-niveaux et <strong>traçabilité intégrale</strong> de chaque action. Architecture pensée pour durer.</p>
          <ul className="feat-list fade-in">
            <li>Authentification JWT — admin · manager · employé</li>
            <li>Workflow de validation avec notifications email</li>
            <li>Dashboard analytique — exports PDF &amp; CSV</li>
            <li>Audit trail — historique immuable de chaque action</li>
          </ul>
          <div className="proj-tags fade-in">
            {['Java 17', 'MySQL', 'MVC / DAO', 'RBAC', 'JWT', 'Servlet'].map(t => <span key={t} className="proj-tag">{t}</span>)}
          </div>
          <a href={`${BASE}/mt-conges`} className="scene-cta fade-in">Voir le projet <span className="arr">↗</span></a>
        </div>
      </section>

      {/* S5 GYMNOVA */}
      <section className="scene" id="s5">
        <div className="scene-inner">
          <div className="proj-num-bg fade-in">02</div>
          <div className="proj-meta fade-in">React · Node.js · E-Commerce · 2024</div>
          <h2 className="scene-title proj-title">
            <span className="tl"><span className="ti">Gym-</span></span>
            <span className="tl"><span className="ti is-em">nova</span></span>
          </h2>
          <p className="scene-body fade-in">Plateforme e-commerce premium pour équipements de sport — catalogue filtrable 50+ articles, <strong>paiement Stripe 3DS</strong> et back-office analytique complet.</p>
          <ul className="feat-list fade-in">
            <li>Catalogue filtrable — 50+ produits avec gestion des stocks</li>
            <li>Panier temps réel · paiement Stripe sécurisé 3DS</li>
            <li>Espace client — historique, factures, suivi commandes</li>
            <li>Back-office — analytics, gestion produits &amp; utilisateurs</li>
          </ul>
          <div className="proj-tags fade-in">
            {['React 18', 'Node.js', 'Express', 'Stripe', 'JWT', 'MySQL'].map(t => <span key={t} className="proj-tag">{t}</span>)}
          </div>
          <a href={`${BASE}/gymnova`} className="scene-cta fade-in">Voir le projet <span className="arr">↗</span></a>
        </div>
      </section>

      {/* S6 STACK */}
      <section className="scene" id="s6">
        <SplineScene scene={SPLINE.stack} className="spline-layer spline-ambient" />
        <div className="scene-inner">
          <div className="scene-tag fade-in">Stack Technique</div>
          <h2 className="scene-title" style={{ fontSize: 'clamp(3rem,6vw,6.5rem)' }}>
            <span className="tl"><span className="ti">Du back-end</span></span>
            <span className="tl"><span className="ti">au pixel —</span></span>
            <span className="tl"><span className="ti is-em">sans compromis.</span></span>
          </h2>
          <div className="skills-row">
            <div className="skill-col fade-in">
              <div className="skill-col-title">Backend</div>
              {['Java 17 · Spring Boot', 'Node.js · Express', 'MySQL · PostgreSQL', 'API REST · JWT', 'Architecture MVC'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
            <div className="skill-col fade-in">
              <div className="skill-col-title">Frontend</div>
              {['React 19 · TypeScript', 'Three.js · R3F · Spline', 'GSAP · Remotion', 'TailwindCSS · SCSS', 'Next.js'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
            <div className="skill-col fade-in">
              <div className="skill-col-title">Créatif</div>
              {['After Effects · Premiere', 'Element 3D · Trapcode', 'Motion Design · VFX', 'Figma · Spline 3D', 'Compositing'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
            <div className="skill-col skill-col--taste fade-in">
              <div className="skill-col-title">Taste</div>
              {['Direction artistique', 'Typographie éditoriale', 'Composition · Cadrage', 'Palette · Couleur', 'Storytelling visuel'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* S7 TASTE */}
      <section className="scene" id="s7">
        <div className="taste-grid fade-in">
          {([
            { n: 5, label: 'Motion Design' },
            { n: 6, label: 'VFX' },
            { n: 7, label: 'Compositing' },
            { n: 8, label: 'Direction Art.' },
            { n: 1, label: 'Identité' },
          ] as { n: number; label: string }[]).map(({ n, label }) => (
            <div key={n} className="taste-item">
              <img src={`${BASE}/footage/photo-${n}.webp`} alt={label} loading="lazy"
                   onError={e => { (e.target as HTMLImageElement).src = `${BASE}/footage/photo-${n}.png` }} />
              <span className="taste-item-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="taste-header">
          <div className="scene-tag fade-in">Esthétique · Composition · Regard</div>
          <h2 className="taste-title">
            <span className="tl"><span className="ti">Ce que je crée,</span></span>
            <span className="tl"><span className="ti is-em">ça se ressent.</span></span>
          </h2>
        </div>
      </section>

      {/* S8 CONTACT */}
      <section className="scene" id="s8">
        <SplineScene scene={SPLINE.contact} className="spline-layer spline-contact" interactive />
        <div className="scene-inner">
          <div className="scene-tag no-line fade-in" style={{ justifyContent: 'center' }}>Stage · Alternance · Freelance · Maintenant</div>
          <h2 className="scene-title" style={{ textAlign: 'center', fontSize: 'clamp(3rem,7.5vw,7.5rem)' }}>
            <span className="tl"><span className="ti">Le prochain projet,</span></span>
            <span className="tl"><span className="ti is-em">c'est le vôtre.</span></span>
          </h2>
          <p className="scene-body fade-in" style={{ textAlign: 'center', margin: '1.5rem auto 0' }}>
            Basé en <strong>Normandie</strong>, disponible pour des projets qui méritent d'être remarqués.
          </p>
          <div style={{ textAlign: 'center' }} className="fade-in">
            <a href="mailto:zebi6073@gmail.com" className="contact-email">zebi6073@gmail.com</a>
          </div>
          <div className="contact-links fade-in">
            <a href="https://github.com/Polochon06" target="_blank" rel="noopener" className="contact-link">GitHub</a>
            <a href="https://linkedin.com"          target="_blank" rel="noopener" className="contact-link">LinkedIn</a>
            <a href="https://instagram.com"         target="_blank" rel="noopener" className="contact-link">Instagram</a>
          </div>
        </div>
      </section>

      <div id="scene-overlay" />
    </>
  )
}

function VideoGroup({ idx, base }: { idx: number; base: string }) {
  return (
    <>
      <video className="bg-vid" id={`v${idx}i`} muted playsInline preload={idx === 1 ? 'auto' : 'none'}>
        <source src={`${base}/footage/video-${idx}.mp4`} type="video/mp4" />
      </video>
      <video className="bg-vid" id={`v${idx}l`} muted playsInline preload={idx === 1 ? 'metadata' : 'none'} loop>
        <source src={`${base}/footage/video-${idx}-1.mp4`} type="video/mp4" />
      </video>
    </>
  )
}
