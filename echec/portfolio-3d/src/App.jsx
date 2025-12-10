import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'

const PROJECTS = [
  { id: '01', title: 'MT-CONGÉS', category: 'DEV', year: '2024', shape: 'pill-shape', span: 'span-2', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
  { id: '02', title: 'VFX_LAB', category: 'ART', year: '2023', shape: 'box-shape', span: 'span-1', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop' },
  { id: '03', title: 'CYBER_CORE', category: 'WEB', year: '2025', shape: 'circle-shape', span: 'span-1', img: 'https://images.unsplash.com/photo-1535378413344-8a0cebd343eb?q=80&w=1000&auto=format&fit=crop' },
  { id: '04', title: 'ARCHIVE_01', category: 'EXP', year: '2022', shape: 'box-shape', span: 'span-2', img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop' }
]

// Variants for Stagger Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
  }
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smooth: true })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay"></div>

      <div className="layout">

        {/* Header */}
        <header className="header">
          <div className="logo">PAUL BLANC</div>
          <div className="meta">
            <div className="status-dot"></div>
            <span>AVAILABLE FOR WORK</span>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="hero">
            <motion.h1
              initial="hidden" animate="visible" variants={containerVariants}
            >
              <motion.span className="block-reveal" variants={itemVariants}>CREATIVE</motion.span>
              <motion.span className="block-reveal indent" variants={itemVariants}>DEVELOPER</motion.span>
            </motion.h1>
            <motion.p className="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              Crafting digital experiences with a focus on motion, <br />interaction and visual storytelling.
            </motion.p>
          </section>

          {/* Work Grid */}
          <section className="work-section">
            <div className="grid-label">( SELECTED WORKS )</div>

            <motion.div
              className="bento-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {PROJECTS.map((p) => (
                <motion.div
                  key={p.id}
                  className={`card ${p.shape} ${p.span}`}
                  variants={itemVariants}
                >
                  <div className="card-image">
                    <img src={p.img} alt={p.title} />
                  </div>
                  <div className="card-hover-info">
                    <h3>{p.title}</h3>
                    <div className="tags">
                      <span>{p.category}</span>
                      <span>{p.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <motion.div
              className="footer-content"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2>LET'S WORK TOGETHER</h2>
              <a href="mailto:paul.blc61@gmail.com" className="email-link">paul.blc61@gmail.com</a>
            </motion.div>
            <div className="footer-bottom">
              <span>© 2025 PAUL BLANC</span>
              <span>GITHUB / LINKEDIN / TWITTER</span>
            </div>
          </footer>
        </main>

      </div>
    </>
  )
}
