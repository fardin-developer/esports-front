import React from 'react'

const Actions = () => {
  return (
    <div>
      <div className="flex gap-2 w-full px-2 mb-4 bg-pink">
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all flex flex-col justify-center items-center">
          <img className='w-8' src="/add-money.png" alt="" />
          <span>add money</span>
        </button>
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all flex flex-col justify-center items-center">
          <img className='w-8' src="/add-money.png" alt="" />
          <span>add money</span>
        </button>
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all flex flex-col justify-center items-center">
          <img className='w-8' src="/add-money.png" alt="" />
          <span>add money</span>
        </button>
        <button className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] py-3 font-medium text-sm shadow hover:bg-[var(--color-primary)/.08] transition-all flex flex-col justify-center items-center">
          <img className='w-8' src="/add-money.png" alt="" />
          <span>add money</span>
        </button>
      </div>
    </div>
  )
}

export default Actions