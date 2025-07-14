import React from 'react'

const supportChannels = [
  {
    label: 'WhatsApp',
    icon: '/whatsapp.png',
    action: 'https://wa.me/919999999999',
    type: 'link',
    color: 'bg-success/10 text-success',
  },
  {
    label: 'Telegram',
    icon: '/telegram.png',
    action: 'https://t.me/your_support_bot',
    type: 'link',
    color: 'bg-primary/10 text-primary',
  },
  {
    label: 'Email',
    icon: '/email.png',
    action: 'mailto:support@example.com',
    type: 'link',
    color: 'bg-accent/10 text-accent',
  },
  {
    label: 'Live Chat',
    icon: '/chat-black.png',
    action: '/live-chat',
    type: 'internal',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    label: 'Phone',
    icon: '/phone.png',
    action: 'tel:+919999999999',
    type: 'link',
    color: 'bg-error/10 text-error',
  },
]

const SupportPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 bg-bg px-4">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Support Channels</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {supportChannels.map((ch, idx) => (
            ch.type === 'internal' ? (
              <a
                key={ch.label}
                href={ch.action}
                className={`flex items-center gap-4 rounded-xl border border-border p-4 shadow bg-surface hover:bg-surface-light transition-all duration-200 ${ch.color}`}
              >
                <img src={ch.icon} alt={ch.label} className="w-10 h-10 rounded-lg" />
                <span className="font-semibold text-base md:text-lg">{ch.label}</span>
              </a>
            ) : (
              <a
                key={ch.label}
                href={ch.action}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-4 rounded-xl border border-border p-4 shadow bg-surface hover:bg-surface-light transition-all duration-200 ${ch.color}`}
              >
                <img src={ch.icon} alt={ch.label} className="w-10 h-10 rounded-lg" />
                <span className="font-semibold text-base md:text-lg">{ch.label}</span>
              </a>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

export default SupportPage