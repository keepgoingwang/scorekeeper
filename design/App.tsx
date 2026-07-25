import { useState } from 'react'
import { C, PLAYERS_4, PLAYERS_5 } from './shared/constants'
import type { Tab, Page, Modal, TableSkin, Player } from './shared/types'

// Pages
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import ProfilePage from './pages/ProfilePage'
import RecordsPage from './pages/RecordsPage'
import SettingsPage from './pages/SettingsPage'
import HelpPage from './pages/HelpPage'
import ContactPage from './pages/ContactPage'
import EditProfilePage from './pages/EditProfilePage'
import LedgerPage from './pages/LedgerPage'

// Components
import TabBar from './components/TabBar'
import { Overlay, CenterOverlay } from './components/Overlay'
import ConfirmDialog from './components/ConfirmDialog'

// Modals
import QRModal from './modals/QRModal'
import JoinSheet from './modals/JoinSheet'
import AutoSettleModal from './modals/AutoSettleModal'
import ManualPaySheet from './modals/ManualPaySheet'
import AmountSheet from './modals/AmountSheet'
import ActionSheet from './modals/ActionSheet'
import FinalSheet from './modals/FinalSheet'
import SkinSheet from './modals/SkinSheet'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [page, setPage] = useState<Page>('home')
  const [inRoom, setInRoom] = useState(false)
  const [tableType, setTableType] = useState<'square' | 'circle'>('square')
  const [modal, setModal] = useState<Modal>('none')
  const [isOwner, setIsOwner] = useState(true)
  const [manualPayee, setManualPayee] = useState<Player | null>(null)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [skin, setSkin] = useState<TableSkin>('classic')

  const players = tableType === 'square' ? PLAYERS_4 : PLAYERS_5

  const navigate = (p: Page) => {
    if (p === 'home' || p === 'profile') setTab(p as Tab)
    setPage(p)
  }

  const enterRoom = (tt: 'square' | 'circle') => {
    setTableType(tt)
    setInRoom(true)
    setPage('room')
    setModal('qr')
  }

  const leaveRoom = () => {
    setInRoom(false)
    setPage('home')
    setTab('home')
  }

  const closeModal = () => setModal('none')

  const BOTTOM_OVERLAY: Modal[] = [
    'join', 'manual-pay', 'manual-amount', 'action', 'final', 'skin',
  ]
  const CENTER_OVERLAY: Modal[] = ['qr', 'auto-settle-input', 'confirm-switch']

  const useBottom = BOTTOM_OVERLAY.includes(modal)
  const useCenter = CENTER_OVERLAY.includes(modal)

  // Derive which main content to show
  const renderPage = () => {
    if (page === 'room' && inRoom) {
      return (
        <RoomPage
          tableType={tableType}
          setModal={setModal}
          onLeave={leaveRoom}
          isOwner={isOwner}
          setIsOwner={setIsOwner}
          skin={skin}
          setSkin={setSkin}
        />
      )
    }
    if (page === 'records') return <RecordsPage navigate={navigate} />
    if (page === 'settings') return <SettingsPage navigate={navigate} skin={skin} setSkin={setSkin} />
    if (page === 'help')    return <HelpPage navigate={navigate} />
    if (page === 'contact') return <ContactPage navigate={navigate} />
    if (page === 'edit-profile') return <EditProfilePage navigate={navigate} />
    if (page === 'ledger')  return <LedgerPage navigate={navigate} />
    if (tab === 'profile')  return <ProfilePage navigate={navigate} />
    return (
      <HomePage
        inRoom={inRoom}
        setModal={setModal}
        enterRoom={enterRoom}
        setPendingAction={setPendingAction}
      />
    )
  }

  const showTabBar = !inRoom && !['records','settings','help','contact','edit-profile','ledger'].includes(page)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #A8E6CF 0%, #88D8C0 50%, #7EC8C8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      fontFamily: '-apple-system, "PingFang SC", "SF Pro Display", "Helvetica Neue", sans-serif',
    }}>
      {/* Phone shell */}
      <div style={{
        width: 390, height: 844, borderRadius: 50,
        background: C.bg,
        boxShadow: '0 36px 90px rgba(0,0,0,0.34), 0 0 0 9px #1c1c1c, 0 0 0 12px #333',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Status bar */}
        <div style={{
          background: C.card, padding: '14px 22px 6px', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>9:41</div>
          <div style={{ fontSize: 13 }}>📶&nbsp;&nbsp;🔋</div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderPage()}
        </div>

        {showTabBar && <TabBar tab={tab} setTab={t => { setTab(t); setPage(t) }} />}

        {/* Bottom sheet overlays */}
        {useBottom && (
          <Overlay onClose={closeModal}>
            {modal === 'join' && (
              <JoinSheet onClose={closeModal} onEnter={() => { closeModal(); enterRoom('square') }} />
            )}
            {modal === 'manual-pay' && (
              <ManualPaySheet
                onClose={closeModal}
                players={players}
                onNext={p => { setManualPayee(p); setModal('manual-amount') }}
              />
            )}
            {modal === 'manual-amount' && (
              <AmountSheet
                onClose={closeModal}
                title={`💸 支付给 ${manualPayee?.name}`}
                hint={`积分将从你账户扣除并转给 ${manualPayee?.name}`}
              />
            )}
            {modal === 'action' && (
              <ActionSheet
                onClose={closeModal}
                setModal={setModal}
                navigate={navigate}
                isOwner={isOwner}
              />
            )}
            {modal === 'final' && <FinalSheet onClose={closeModal} players={players} />}
            {modal === 'skin' && <SkinSheet onClose={closeModal} skin={skin} setSkin={setSkin} />}
          </Overlay>
        )}

        {/* Center overlays */}
        {useCenter && (
          <CenterOverlay onClose={closeModal}>
            {modal === 'qr' && <QRModal onClose={closeModal} />}
            {modal === 'auto-settle-input' && (
              <div style={{ width: '100%', maxWidth: 360 }}>
                <AutoSettleModal onClose={closeModal} players={players} />
              </div>
            )}
            {modal === 'confirm-switch' && (
              <ConfirmDialog
                msg="您当前在房间 888888 中，开房会自动退出该房间，是否继续？"
                confirmLabel="继续"
                onCancel={closeModal}
                onConfirm={() => {
                  closeModal()
                  pendingAction?.()
                  setPendingAction(null)
                }}
              />
            )}
          </CenterOverlay>
        )}
      </div>
    </div>
  )
}
