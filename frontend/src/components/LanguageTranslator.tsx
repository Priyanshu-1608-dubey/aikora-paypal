import { useEffect, useState } from 'react'
import { Languages, ChevronDown } from 'lucide-react'

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'de', name: 'Deutsch (German)' },
]

export default function LanguageTranslator() {
  const [selectedLang, setSelectedLang] = useState('en')

  useEffect(() => {
    // Current cookie language read karein
    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/)
    if (match && match[1]) {
      setSelectedLang(match[1])
    }

    // Google Translate Init
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
          },
          'google_translate_hidden_box'
        )
      }
    }

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.type = 'text/javascript'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      document.body.appendChild(script)
    }
  }, [])

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode)

    // Google Translate cookies update
    document.cookie = `googtrans=/en/${langCode}; path=/;`
    document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null
    if (select) {
      select.value = langCode
      select.dispatchEvent(new Event('change'))
    } else {
      window.location.reload()
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Google ka default widget background me hidden rahega */}
      <div id="google_translate_hidden_box" style={{ display: 'none' }} />

      {/* Sleek Custom Pill Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          padding: '0 12px',
          borderRadius: '10px',
          height: '38px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          cursor: 'pointer',
        }}
      >
        <Languages size={17} style={{ color: '#0070ba', flexShrink: 0 }} />

        <select
          value={selectedLang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#1e293b',
            cursor: 'pointer',
            paddingRight: '4px',
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <ChevronDown size={14} style={{ color: '#64748b', pointerEvents: 'none' }} />
      </div>
    </div>
  )
}