import { useState } from 'react'
import { motion } from 'framer-motion'

import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Users,
  Sparkles,
  Globe2,
  ShieldCheck,
  Menu,
  X,
  Wallet,
  HandHeart,
} from 'lucide-react'

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  const features = [
    {
      icon: Users,
      title: 'Family Circle',
      description:
        'Bring your family closer with shared expenses, contributions and meaningful moments.',
      number: '01',
    },
    {
      icon: Sparkles,
      title: 'Apnaa AI',
      description:
        'Your intelligent companion for budgeting, planning and simplifying everyday payments.',
      number: '02',
    },
    {
      icon: Heart,
      title: 'UtsavPay',
      description:
        'Celebrate festivals, birthdays and special occasions by bringing everyone together.',
      number: '03',
    },
    {
      icon: HandHeart,
      title: 'SevaConnect',
      description:
        'Make meaningful contributions and support communities through transparent giving.',
      number: '04',
    },
  ]

  return (
    <main>

      {/* NAVBAR */}

      <nav className="navbar">

        <a href="/" className="brand">
          <span className="brand-icon">आ</span>
          <span>AIKORA<span className="brand-dot">.</span></span>
        </a>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>

          <a href="#philosophy" onClick={() => setMenuOpen(false)}>
            Our Philosophy
          </a>

          <a href="#features" onClick={() => setMenuOpen(false)}>
            Features
          </a>

          <a href="#community" onClick={() => setMenuOpen(false)}>
            Community
          </a>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About Us
          </a>

        </div>

        <a href="/dashboard" className="nav-cta">
          Explore AIKORA <ArrowUpRight size={16} />
        </a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </nav>

      {/* HERO SECTION */}

      <section className="hero">

        <div className="hero-background-circle" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="eyebrow">
            <Sparkles size={14} />
            <span>ROOTED IN VALUES. BUILT FOR TOMORROW.</span>
          </div>

          <h1>
            More Than Money.
            <br />
            <span>A Feeling of</span>
            <br />
            <span className="highlight">Belonging.</span>
          </h1>

          <p className="hero-description">
            Technology can move money across the world.
            We believe it can also bring people closer.
            Discover a more human way to connect, contribute
            and celebrate.
          </p>

          <div className="hero-actions">

            <a href="/dashboard" className="primary-button">
              Explore Dashboard <ArrowRight size={18} />
            </a>

            <a href="#philosophy" className="secondary-button">
              Explore our philosophy
            </a>

          </div>

          <div className="hero-trust">
            <ShieldCheck size={17} />
            <span>
              Built around trust, transparency and human connection.
            </span>
          </div>

        </motion.div>

        {/* HERO VISUAL */}

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >

          <div className="mandala mandala-one" />
          <div className="mandala mandala-two" />

          <div className="visual-card">

            <div className="visual-top">
              <span className="visual-label">
                THE SPIRIT OF AIKORA
              </span>
              <Sparkles size={19} />
            </div>

            <div className="visual-symbol">एकत्व</div>

            <div className="visual-divider" />

            <h3>One World.</h3>
            <h3 className="visual-gold">One Family.</h3>

            <p>
              Inspired by the timeless philosophy
              of Vasudhaiva Kutumbakam.
            </p>

            <div className="visual-footer">
              <span>वसुधैव कुटुम्बकम्</span>
              <Globe2 size={18} />
            </div>

          </div>

          <div className="floating-card floating-one">
            <Heart size={18} />
            <span>Made for connection</span>
          </div>

          <div className="floating-card floating-two">
            <ShieldCheck size={18} />
            <span>Trust by design</span>
          </div>

        </motion.div>

      </section>

      {/* PHILOSOPHY */}

      <section
        className="philosophy section-padding"
        id="philosophy"
      >

        <div className="section-label">
          OUR FOUNDATION
        </div>

        <h2>
          Ancient Wisdom.
          <br />
          <span>Modern Possibilities.</span>
        </h2>

        <p className="section-description">
          Inspired by Indian philosophy, we believe that
          meaningful technology should connect humanity,
          not just transactions.
        </p>

        <div className="philosophy-grid">

          <div className="philosophy-card">
            <span className="sanskrit">
              वसुधैव कुटुम्बकम्
            </span>

            <h3>One Global Family</h3>

            <p>
              The world is one family. Every connection matters.
            </p>
          </div>

          <div className="philosophy-card">
            <span className="sanskrit">
              अतिथि देवो भवः
            </span>

            <h3>Everyone Belongs</h3>

            <p>
              Every individual deserves warmth, respect and dignity.
            </p>
          </div>

          <div className="philosophy-card">
            <span className="sanskrit">
              सेवा
            </span>

            <h3>Technology with Purpose</h3>

            <p>
              Use innovation to create opportunities to help others.
            </p>
          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        className="features section-padding"
        id="features"
      >

        <div className="section-label">
          THE AIKORA EXPERIENCE
        </div>

        <div className="features-heading">

          <h2>
            Everything that connects
            <br />
            <span>us, in one place.</span>
          </h2>

          <p>
            A thoughtfully designed ecosystem
            for families, communities and individuals.
          </p>

        </div>

        <div className="features-grid">

          {features.map((feature, index) => {

            const Icon = feature.icon

            return (

              <motion.div
                className="feature-card"
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >

                <div className="feature-top">
                  <span>{feature.number}</span>
                  <Icon size={25} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>

                <ArrowUpRight
                  className="feature-arrow"
                  size={21}
                />

              </motion.div>

            )

          })}

        </div>

      </section>

      {/* COMMUNITY */}

      <section
        className="community section-padding"
        id="community"
      >

        <div className="community-content">

          <div className="section-label">
            A PHILOSOPHY WITHOUT BORDERS
          </div>

          <h2>
            Different Cultures.
            <br />
            <span>One Humanity.</span>
          </h2>

          <p>
            Inspired by the Indian philosophy of
            Vasudhaiva Kutumbakam, AIKORA envisions
            a world where technology brings families,
            communities and people closer.
          </p>

          <a href="#about" className="primary-button">
            Discover our vision <ArrowRight size={18} />
          </a>

        </div>

        <div className="community-symbol">

          <div className="community-circle">
            <Globe2 size={76} strokeWidth={1} />
            <span>एक परिवार</span>
          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer" id="about">

        <div className="footer-main">

          <div>

            <a href="/" className="brand footer-brand">
              <span className="brand-icon">आ</span>

              <span>
                AIKORA<span className="brand-dot">.</span>
              </span>
            </a>

            <p>
              More Than Money.
              <br />
              A Feeling of Belonging.
            </p>

          </div>

          <div className="footer-right">
            <Wallet size={22} />

            <span>
              Powered by AI. Built around human connection.
            </span>
          </div>

        </div>

        <div className="footer-bottom">

          <span>© 2026 AIKORA. All rights reserved.</span>

          <span>
            Inspired by India. Designed for the World.
          </span>

        </div>

      </footer>

    </main>
  )
}

export default Home