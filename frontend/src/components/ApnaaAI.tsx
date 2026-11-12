import { useState } from 'react'
import { Sparkles, Send, ShoppingBag, Heart, ArrowRight } from 'lucide-react'

interface ApnaaAIProps {
  onPayWithPayPal: (item: { title: string; price: number }) => void
}

export default function ApnaaAI({ onPayWithPayPal }: ApnaaAIProps) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! Main hoon Apnaa AI. Aapki family celebrations, gifting, ya Seva contribution ke liye main recommendations aur direct PayPal checkout arrange kar sakta hoon. Aaj kis cheez me madad karun?',
      items: [
        { id: 1, title: 'Diwali Mithai & Dry Fruits Hamper', price: 25, type: 'gift' },
        { id: 2, title: 'Feed 10 Stray Dogs - Seva Project', price: 15, type: 'seva' },
      ],
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userText = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text: userText, items: [] }])
    setInput('')

    setTimeout(() => {
      let aiResponse = {
        sender: 'ai',
        text: `Maine "${userText}" ke liye yeh curated options choose kiye hain:`,
        items: [
          { id: Date.now(), title: `${userText} - Curated Gift Pack`, price: 30, type: 'gift' },
          { id: Date.now() + 1, title: 'Tree Plantation in Family Name', price: 12, type: 'seva' },
        ],
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 800)
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '10px', borderRadius: '12px' }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Apnaa AI - Agentic Commerce</h3>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Personalized Gifting, Seva, & Instant PayPal Payments</p>
        </div>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px', paddingRight: '8px' }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
            <div style={{
              background: m.sender === 'user' ? '#0284c7' : '#f8fafc',
              color: m.sender === 'user' ? '#fff' : '#1e293b',
              padding: '12px 16px',
              borderRadius: '16px',
              border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
              fontSize: '0.95rem'
            }}>
              {m.text}
            </div>

            {m.items && m.items.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                {m.items.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px', background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: item.type === 'seva' ? '#16a34a' : '#d97706', marginBottom: '4px' }}>
                      {item.type === 'seva' ? <Heart size={14} /> : <ShoppingBag size={14} />}
                      <span>{item.type.toUpperCase()}</span>
                    </div>
                    <h5 style={{ margin: '0 0 6px', fontSize: '0.95rem' }}>{item.title}</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <strong style={{ color: '#0f172a' }}>${item.price}</strong>
                      <button
                        onClick={() => onPayWithPayPal(item)}
                        style={{
                          background: '#0070ba',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        Buy with PayPal <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Apnaa AI (e.g. 'Gift for anniversary under $30' or 'Donate to education seva')..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        <button
          onClick={handleSend}
          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}