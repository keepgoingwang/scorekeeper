import type { ReactNode } from 'react'

interface OverlayProps {
  onClose: () => void
  children: ReactNode
}

export function Overlay({ onClose, children }: OverlayProps) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.52)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  )
}

export function CenterOverlay({ onClose, children }: OverlayProps) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}
