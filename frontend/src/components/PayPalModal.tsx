import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'

interface PayPalModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  title?: string
  onSuccess: (details: any) => void
}

export default function PayPalModal({ isOpen, onClose, amount, title = 'UtsavPay Checkout', onSuccess }: PayPalModalProps) {
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', maxWidth: '420px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <p style={{ margin: '0 0 16px', color: '#666', fontSize: '0.95rem' }}>
          Total Amount: <strong style={{ color: '#0070ba', fontSize: '1.1rem' }}>${amount.toFixed(2)} USD</strong>
        </p>

        {paid ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#10b981' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 8px' }}>Payment Successful!</h4>
            <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>Your wallet / order has been updated.</p>
          </div>
        ) : (
          <PayPalScriptProvider options={{ clientId: 'test', currency: 'USD' }}>
            {error && (
              <div style={{ display: 'flex', gap: '8px', color: '#ef4444', marginBottom: '12px', fontSize: '0.875rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <PayPalButtons
              style={{ layout: 'vertical', shape: 'rect', color: 'gold' }}
              createOrder={(_data, actions) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'USD',
                        value: amount.toFixed(2),
                      },
                      description: title,
                    },
                  ],
                })
              }}
              onApprove={async (_data, actions) => {
                if (actions.order) {
                  const details = await actions.order.capture()
                  setPaid(true)
                  onSuccess(details)
                  setTimeout(() => {
                    setPaid(false)
                    onClose()
                  }, 2000)
                }
              }}
              onError={(err) => {
                setError('Payment failed or cancelled. Please try again.')
                console.error(err)
              }}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  )
}