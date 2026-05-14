import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const BASE = '/portfolio_bpa'

const SCENE_COUNT = 8

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

const NAV_LABELS = ['Accueil', 'Approche', 'À Propos', 'MT-Congés', 'Gymnova', 'Stack', 'Motion', 'Contact']

const STATUSES = [
  'Développeur Créatif',
  "L'Approche",
  'À Propos',
  'Projet 01 — MT-Congés',
  'Projet 02 — Gymnova',
  'Stack Technique',
  'Motion Design · VFX',
  'Contact',
]

export function Portfolio() {
  const activeRef    = useRef(0)
  const lastNavRef   = useRef(0)
  const heroInitDone = useRef(false)
  const charMap      = useRef(new Map<number, HTMLElement[]>())
  const wVelRef      = useRef(0)
  const wRafRef      = useRef(0)

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

    // ── CHAR SPLIT ──────────────────────────────────────────────────
    function buildChars(lines: HTMLElement[]): HTMLElement[] {
      const all: HTMLElement[] = []
      lines.forEach(li => {
        const isEm = li.classList.contains('is-em')
        const text = li.textContent ?? ''
        gsap.set(li, { y: '0%' })
        li.innerHTML = ''
        for (const ch of text) {
          const clip  = document.createElement('span')
          clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;line-height:inherit'
          const inner = document.createElement('span')
          inner.style.display = 'inline-block'
          if (isEm) { inner.style.fontStyle = 'italic'; inner.style.color = 'rgba(240,235,224,0.6)' }
          inner.textContent = ch === ' ' ? ' ' : ch
          clip.appendChild(inner)
          li.appendChild(clip)
          all.push(inner)
        }
      })
      return all
    }

    function typeTag(el: HTMLElement, delay: number) {
      if (!el.dataset.text) el.dataset.text = el.textContent ?? ''
      el.textContent = ''
      el.dataset.text.split('').forEach((ch, i) => {
        const s = document.createElement('span')
        s.style.cssText = 'display:inline-block;opacity:0'
        s.textContent = ch === ' ' ? ' ' : ch
        el.appendChild(s)
        gsap.to(s, { opacity: 1, duration: 0.12, delay: delay + i * 0.038, ease: 'power1.out' })
      })
    }

    function showText(sd: SD, idx: number) {
      const chars = buildChars(sd.lines)
      charMap.current.set(idx, chars)
      gsap.fromTo(chars, { y: '115%' }, { y: '0%', duration: 0.74, stagger: 0.028, ease: 'expo.out', delay: 0.22 })

      if (idx === 0) {
        gsap.fromTo(['.hero-eyebrow', '.hero-sub'], { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.18, ease: 'power2.out', delay: 0.65 })
        gsap.to('.scroll-hint', { opacity: 0.85, duration: 0.7, ease: 'power2.out', delay: 1.1 })
        return
      }

      const goldLines = sd.fades.filter(el => el.classList.contains('gold-line'))
      const tags      = sd.fades.filter(el => el.classList.contains('scene-tag'))
      const rest      = sd.fades.filter(el => !el.classList.contains('gold-line') && !el.classList.contains('scene-tag'))

      goldLines.forEach(el => gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.inOut', delay: 0 }))
      tags.forEach(el => typeTag(el, 0.06))
      rest.forEach((el, i) => gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.88, ease: 'power2.out', delay: 0.88 + i * 0.1 }))
    }

    function hideText(sd: SD, idx: number) {
      gsap.killTweensOf([...sd.lines, ...sd.fades, ...(charMap.current.get(idx) ?? [])])
      sd.lines.forEach(li => {
        const txt = li.textContent ?? ''
        gsap.set(li, { y: '110%' })
        li.textContent = txt
      })
      charMap.current.delete(idx)
      sd.fades.forEach(el => {
        if (el.classList.contains('gold-line')) gsap.set(el, { scaleX: 0 })
        else gsap.set(el, { opacity: 0, y: 20 })
        if (el.classList.contains('scene-tag') && el.dataset.text) el.textContent = el.dataset.text
      })
      if (idx === 0) gsap.set(['.hero-eyebrow', '.hero-sub', '.scroll-hint'], { opacity: 0 })
    }

    function setTint(idx: number) {
      gsap.to(tintEl, { backgroundColor: TINTS[idx] ?? 'transparent', duration: 1.4, ease: 'power2.out' })
    }

    // ── VIDEO ───────────────────────────────────────────────────────
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
      intro.addEventListener('ended', function onEnd() {
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

    // ── NAVIGATION ─────────────────────────────────────────────────
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

    // ── INIT ────────────────────────────────────────────────────────
    const eyebrow = document.querySelector<HTMLElement>('.hero-eyebrow')!
    const sub     = document.querySelector<HTMLElement>('.hero-sub')!
    const hint    = document.querySelector<HTMLElement>('.scroll-hint')!
    gsap.set([eyebrow, sub, hint], { opacity: 0 })
    navDots[0]?.classList.add('active')
    barStatus.textContent = STATUSES[0]
    enterScene(0)
    setTint(0)
    gsap.to(fracEl, { opacity: 1, duration: 1, delay: 2 })

    const heroChars = buildChars(SD[0].lines)
    charMap.current.set(0, heroChars)
    const tl = gsap.timeline({ delay: 0.9 })
    tl.to(eyebrow, { opacity: 1, duration: 0.85, ease: 'power2.out' })
    tl.fromTo(heroChars, { y: '115%' }, { y: '0%', duration: 0.78, stagger: 0.038, ease: 'expo.out' }, '-=0.42')
    tl.to(sub, { opacity: 1, duration: 0.85, ease: 'power2.out' }, '-=0.52')
    tl.to(hint, {
      opacity: 1, duration: 0.7, ease: 'power2.out',
      onComplete: () => {
        gsap.to(hint, { opacity: 0.85, y: -5, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut', delay: 2 })
      },
    }, '-=0.48')

    // ── WHEEL ───────────────────────────────────────────────────────
    function wheelTick() {
      if (Math.abs(wVelRef.current) > 8) {
        goTo(activeRef.current + (wVelRef.current > 0 ? 1 : -1))
        wVelRef.current = 0; wRafRef.current = 0; return
      }
      wVelRef.current *= 0.78
      if (Math.abs(wVelRef.current) > 0.4) wRafRef.current = requestAnimationFrame(wheelTick)
      else { wVelRef.current = 0; wRafRef.current = 0 }
    }
    const onWheel = (e: WheelEvent) => {
      wVelRef.current += e.deltaY * 0.45
      if (!wRafRef.current) wRafRef.current = requestAnimationFrame(wheelTick)
    }

    let ty0 = 0
    const onTouchStart = (e: TouchEvent) => { ty0 = e.touches[0].clientY }
    const onTouchEnd   = (e: TouchEvent) => {
      const d = ty0 - e.changedTouches[0].clientY
      if (Math.abs(d) > 40) goTo(activeRef.current + (d > 0 ? 1 : -1))
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(activeRef.current + 1)
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   goTo(activeRef.current - 1)
    }

    // ── MOUSE PARALLAX ──────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(VP[activeRef.current][1], {
        x: nx * 24, y: ny * 24,
        duration: 1.8, ease: 'power2.out', overwrite: 'auto',
      })
    }

    navDots.forEach((d, i) => d.addEventListener('click', () => goTo(i)))
    document.getElementById('logo-btn')?.addEventListener('click', () => goTo(0))

    window.addEventListener('wheel', onWheel, { passive: true })
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <>
      {/* ── BG VIDEOS ────────────────────────────────────────────── */}
      <div id="cinematic-bg">
        {Array.from({ length: SCENE_COUNT }, (_, i) => (
          <VideoGroup key={i} idx={i + 1} base={BASE} />
        ))}
      </div>

      <div id="scene-tint" aria-hidden="true" />

      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <div id="top-bar">
        <button className="bar-logo" id="logo-btn">Paul Blanc</button>
        <span id="bar-status" />
      </div>

      {/* ── SIDE NAV ─────────────────────────────────────────────── */}
      <nav id="scene-nav">
        {NAV_LABELS.map((label, i) => (
          <button key={i} className="nav-dot" data-scene={i} data-label={label} aria-label={label} />
        ))}
      </nav>

      <div id="progress-bar" />

      {/* ── SCENE FRACTION ───────────────────────────────────────── */}
      <div id="scene-fraction" aria-hidden="true">
        <span className="sf-cur" id="sf-cur">01</span>
        <span className="sf-dash" />
        <span>08</span>
      </div>

      {/* ── SCENES ───────────────────────────────────────────────── */}

      {/* S1 HERO */}
      <section className="scene active" id="s1">
        <div className="scene-inner">
          <p className="hero-eyebrow">Normandie · France · 2025</p>
          <h1 className="hero-title">
            <span className="tl"><span className="ti">Paul</span></span>
            <span className="tl"><span className="ti is-em">Blanc</span></span>
          </h1>
          <p className="hero-sub">Développeur Créatif</p>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-hint-line" />
          Défiler
        </div>
      </section>

      {/* S2 PHILOSOPHIE */}
      <section className="scene" id="s2">
        <div className="scene-inner">
          <div className="scene-tag fade-in">L'Approche</div>
          <div className="gold-line fade-in" />
          <h2 className="scene-title">
            <span className="tl"><span className="ti">Chaque</span></span>
            <span className="tl"><span className="ti">projet</span></span>
            <span className="tl"><span className="ti is-em">compte.</span></span>
          </h2>
          <p className="scene-body fade-in">
            Je construis des expériences numériques qui ont du sens. Du back-end sécurisé aux interfaces cinématiques — chaque décision est au service de l'expérience utilisateur.
          </p>
        </div>
      </section>

      {/* S3 À PROPOS */}
      <section className="scene" id="s3">
        <div className="scene-inner">
          <div className="scene-tag fade-in">À Propos · BTS SIO SLAM · Promo 2025</div>
          <h2 className="scene-title">
            <span className="tl"><span className="ti">Code</span></span>
            <span className="tl"><span className="ti is-em">&amp; Art.</span></span>
          </h2>
          <p className="scene-body fade-in">
            Basé en <strong>Normandie</strong>, développeur depuis 2020. Je mélange rigueur technique et sensibilité artistique — Java, React, et motion design 3D.
          </p>
          <div className="stat-row fade-in">
            <div><div className="stat-val">2+</div><div className="stat-lbl">Années</div></div>
            <div><div className="stat-val">4</div><div className="stat-lbl">Projets</div></div>
            <div><div className="stat-val">∞</div><div className="stat-lbl">Curiosité</div></div>
          </div>
        </div>
      </section>

      {/* S4 MT-CONGÉS */}
      <section className="scene" id="s4">
        <div className="scene-inner">
          <div className="proj-num-bg fade-in">01</div>
          <div className="proj-meta fade-in">Java · Architecture · 2024</div>
          <h2 className="scene-title proj-title">
            <span className="tl"><span className="ti">MT-</span></span>
            <span className="tl"><span className="ti is-em">Congés</span></span>
          </h2>
          <p className="scene-body fade-in">Gestion des congés d'entreprise — auth RBAC, workflow multi-niveaux, audit logs.</p>
          <ul className="feat-list fade-in">
            <li>Auth JWT, rôles admin / manager / employé</li>
            <li>CRUD congés + workflow de validation</li>
            <li>Dashboard statistiques temps réel</li>
            <li>Audit trail — traçabilité totale</li>
          </ul>
          <div className="proj-tags fade-in">
            {['Java 17', 'MySQL', 'MVC / DAO', 'RBAC', 'JWT'].map(t => <span key={t} className="proj-tag">{t}</span>)}
          </div>
          <a href={`${BASE}/mt-conges`} className="scene-cta fade-in">Voir le projet <span className="arr">↗</span></a>
        </div>
      </section>

      {/* S5 GYMNOVA */}
      <section className="scene" id="s5">
        <div className="scene-inner">
          <div className="proj-num-bg fade-in">02</div>
          <div className="proj-meta fade-in">React · E-Commerce · 2024</div>
          <h2 className="scene-title proj-title">
            <span className="tl"><span className="ti">Gym-</span></span>
            <span className="tl"><span className="ti is-em">nova</span></span>
          </h2>
          <p className="scene-body fade-in">Plateforme e-commerce complète — 50+ produits, panier, Stripe, back-office admin.</p>
          <ul className="feat-list fade-in">
            <li>Catalogue 50+ produits avec filtres avancés</li>
            <li>Panier temps réel + Stripe intégré</li>
            <li>Auth JWT, espace client, historique commandes</li>
            <li>Back-office admin : stocks, commandes, analytics</li>
          </ul>
          <div className="proj-tags fade-in">
            {['React 18', 'Node.js', 'Stripe', 'JWT', 'MySQL'].map(t => <span key={t} className="proj-tag">{t}</span>)}
          </div>
          <a href={`${BASE}/gymnova`} className="scene-cta fade-in">Voir le projet <span className="arr">↗</span></a>
        </div>
      </section>

      {/* S6 STACK */}
      <section className="scene" id="s6">
        <div className="scene-inner">
          <div className="scene-tag fade-in">Stack Technique</div>
          <h2 className="scene-title" style={{ fontSize: 'clamp(3rem,6vw,6.5rem)' }}>
            <span className="tl"><span className="ti">Mes</span></span>
            <span className="tl"><span className="ti is-em">outils.</span></span>
          </h2>
          <div className="skills-row">
            <div className="skill-col fade-in">
              <div className="skill-col-title">Backend</div>
              {['Java 17', 'Spring Boot', 'Node.js · Express', 'MySQL · PostgreSQL', 'API REST · JWT'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
            <div className="skill-col fade-in">
              <div className="skill-col-title">Frontend</div>
              {['React 18 · Next.js', 'Three.js · R3F', 'GSAP · Remotion', 'SCSS · TailwindCSS', 'TypeScript'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
            <div className="skill-col fade-in">
              <div className="skill-col-title">Créatif</div>
              {['After Effects', 'Element 3D', 'Trapcode Suite', 'Motion Design', 'Figma · Spline'].map(s => <div key={s} className="skill-item">{s}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* S7 MOTION VFX */}
      <section className="scene" id="s7">
        <div className="scene-inner">
          <div className="scene-tag no-line fade-in" style={{ justifyContent: 'center' }}>
            Motion Design · VFX · After Effects
          </div>
          <h2 className="scene-title" style={{ textAlign: 'center', fontSize: 'clamp(2.8rem,6vw,6rem)' }}>
            <span className="tl"><span className="ti">Créations</span></span>
            <span className="tl"><span className="ti is-em">visuelles.</span></span>
          </h2>
          <p className="scene-body fade-in" style={{ textAlign: 'center', margin: '1.2rem auto 0' }}>
            Typographies animées, effets particules 3D, compositing VFX.
          </p>
          <div className="vfx-grid fade-in">
            {[5, 6, 7, 8].map(n => (
              <div key={n} className="vfx-item">
                <img src={`${BASE}/footage/photo-${n}.webp`} alt={`Motion ${n - 4}`} loading="lazy"
                     onError={e => { (e.target as HTMLImageElement).src = `${BASE}/footage/photo-${n}.png` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S8 CONTACT */}
      <section className="scene" id="s8">
        <div className="scene-inner">
          <div className="scene-tag no-line fade-in" style={{ justifyContent: 'center' }}>
            Fin de parcours · Début d'une collaboration
          </div>
          <h2 className="scene-title" style={{ textAlign: 'center', fontSize: 'clamp(3rem,7.5vw,7.5rem)' }}>
            <span className="tl"><span className="ti">Travaillons</span></span>
            <span className="tl"><span className="ti is-em">ensemble.</span></span>
          </h2>
          <p className="scene-body fade-in" style={{ textAlign: 'center', margin: '1.5rem auto 0' }}>
            Disponible pour <strong>stages</strong>, <strong>alternances</strong>, freelance et collaborations créatives.
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

      {/* ── OVERLAY ──────────────────────────────────────────────── */}
      <div id="scene-overlay" />
    </>
  )
}

function VideoGroup({ idx, base }: { idx: number; base: string }) {
  const preloadIntro = idx === 1 ? 'auto'     : 'none'
  const preloadLoop  = idx === 1 ? 'metadata' : 'none'
  return (
    <>
      <video className="bg-vid" id={`v${idx}i`} muted playsInline preload={preloadIntro}>
        <source src={`${base}/footage/video-${idx}.mp4`} type="video/mp4" />
      </video>
      <video className="bg-vid" id={`v${idx}l`} muted playsInline preload={preloadLoop} loop>
        <source src={`${base}/footage/video-${idx}-1.mp4`} type="video/mp4" />
      </video>
    </>
  )
}
