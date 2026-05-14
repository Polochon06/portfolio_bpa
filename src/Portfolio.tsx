import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { Player } from '@remotion/player'
import { CinematicFX } from '../remotion/compositions/CinematicFX'
import { SplineScene } from './components/SplineScene'

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
          inner.textContent = ch === ' ' ? ' ' : ch
          clip.appendChild(inner); li.appendChild(clip); all.push(inner)
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
        s.textContent = ch === ' ' ? ' ' : ch
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
      sd.fades.filter(el => el.classList.contains('gold-line'))
        .forEach(el => gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.65, ease: 'power2.inOut' }))
      sd.fades.filter(el => el.classList.contains('scene-tag'))
        .forEach(el => typeTag(el, 0.06))
      sd.fades.filter(el => !el.classList.contains('gold-line') && !el.classList.contains('scene-tag'))
        .forEach((el, i) => gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.88, ease: 'power2.out', delay: 0.88 + i * 0.1 }))
    }

    function hideText(sd: SD, idx: number) {
      gsap.killTweensOf([...sd.lines, ...sd.fades, ...(charMap.current.get(idx) ?? [])])
      sd.lines.forEach(li => { const t = li.textContent ?? ''; gsap.set(li, { y: '110%' }); li.textContent = t })
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
    navDots[0]?.classList.add('active')
    barStatus.textContent = STATUSES[0]
    enterScene(0); setTint(0)
    gsap.to(fracEl, { opacity: 1, duration: 1, delay: 2 })

    const heroChars = buildChars(SD[0].lines)
    charMap.current.set(0, heroChars)
    const tl = gsap.timeline({ delay: 0.9 })
    tl.to(eyebrow, { opacity: 1, duration: 0.85, ease: 'power2.out' })
    tl.fromTo(heroChars, { y: '115%' }, { y: '0%', duration: 0.78, stagger: 0.038, ease: 'expo.out' }, '-=0.42')
    tl.to(sub, { opacity: 1, duration: 0.85, ease: 'power2.out' }, '-=0.52')
    tl.to(hint, {
      opacity: 1, duration: 0.7, ease: 'power2.out',
      onComplete: () => gsap.to(hint, { opacity: 0.85, y: -5, repeat: -1, yoyo: true, duration: 1.2, ease: 'sine.inOut', delay: 2 }),
    }, '-=0.48')

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
          <div className="scene-tag fade-in">Vision</div>
          <div className="gold-line fade-in" />
          <h2 className="scene-title">
            <span className="tl"><span className="ti">L'interface</span></span>
            <span className="tl"><span className="ti">est une</span></span>
            <span className="tl"><span className="ti is-em">émotion.</span></span>
          </h2>
          <p className="scene-body fade-in">Je ne code pas des pages — je construis des <strong>expériences</strong>. Chaque animation, chaque transition, chaque micro-interaction est pensée pour créer un ressenti. Du back-end robuste à l'interface cinématique.</p>
        </div>
      </section>

      {/* S3 À PROPOS */}
      <section className="scene" id="s3">
        <SplineScene scene={SPLINE.about} className="spline-layer spline-right" />
        <div className="scene-inner">
          <div className="scene-tag fade-in">BTS SIO SLAM · Promo 2025 · Normandie</div>
          <h2 className="scene-title">
            <span className="tl"><span className="ti">Code.</span></span>
            <span className="tl"><span className="ti">Image.</span></span>
            <span className="tl"><span className="ti is-em">Mouvement.</span></span>
          </h2>
          <p className="scene-body fade-in">Développeur full-stack passionné par l'intersection entre la technique et l'art. Java côté serveur, React côté client, After Effects côté créatif — je maîtrise toute la chaîne.</p>
          <div className="stat-row fade-in">
            <div><div className="stat-val">5+</div><div className="stat-lbl">Projets</div></div>
            <div><div className="stat-val">3</div><div className="stat-lbl">Langages</div></div>
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
          <p className="scene-body fade-in">Application RH complète — système de rôles hiérarchiques, workflow de validation multi-niveaux et audit trail intégral.</p>
          <ul className="feat-list fade-in">
            <li>Auth JWT — rôles admin · manager · employé</li>
            <li>Workflow de validation avec notifications</li>
            <li>Dashboard statistiques &amp; exports</li>
            <li>Audit trail — traçabilité complète des actions</li>
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
          <p className="scene-body fade-in">Plateforme e-commerce premium — catalogue 50+ articles, paiement Stripe, espace client et back-office admin complet.</p>
          <ul className="feat-list fade-in">
            <li>Catalogue filtrable — 50+ produits</li>
            <li>Panier temps réel · paiement Stripe sécurisé</li>
            <li>Espace client · historique commandes</li>
            <li>Back-office — stocks · analytics · gestion</li>
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
            <span className="tl"><span className="ti">Maîtrise</span></span>
            <span className="tl"><span className="ti is-em">totale.</span></span>
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
          <div className="scene-tag fade-in">Goût · Esthétique · Direction Artistique</div>
          <h2 className="taste-title">
            <span className="tl"><span className="ti">L'œil avant</span></span>
            <span className="tl"><span className="ti is-em">la technique.</span></span>
          </h2>
        </div>
      </section>

      {/* S8 CONTACT */}
      <section className="scene" id="s8">
        <SplineScene scene={SPLINE.contact} className="spline-layer spline-contact" interactive />
        <div className="scene-inner">
          <div className="scene-tag no-line fade-in" style={{ justifyContent: 'center' }}>Disponible · Stage · Alternance · Freelance</div>
          <h2 className="scene-title" style={{ textAlign: 'center', fontSize: 'clamp(3rem,7.5vw,7.5rem)' }}>
            <span className="tl"><span className="ti">On crée</span></span>
            <span className="tl"><span className="ti is-em">quelque chose ?</span></span>
          </h2>
          <p className="scene-body fade-in" style={{ textAlign: 'center', margin: '1.5rem auto 0' }}>
            Basé en <strong>Normandie</strong>, disponible immédiatement pour des projets ambitieux.
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
