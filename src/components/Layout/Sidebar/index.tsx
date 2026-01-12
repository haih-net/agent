import React, { memo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  SidebarContainer,
  SidebarOverlay,
  SidebarHeader,
  SidebarLogoIcon,
  SidebarLogoText,
  SidebarCollapseButton,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
  NavItemIcon,
  NavItemLabel,
  SidebarUserSection,
  UserAvatar,
} from './styles'
import { useAppContext } from 'src/components/AppContext'
import { UserLink } from 'src/components/Link/User'

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

const UserIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const navItems = [
  {
    label: 'Members',
    href: '/users',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: 'Mind Logs',
    href: '/mind-logs',
    icon: (
      <svg
        height="800px"
        width="800px"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g>
          <g>
            <path
              d="M497.914,193.994c0-46.26-29.749-86.151-72.024-100.349C423.339,41.574,380.176,0,327.483,0
			C299.765,0,274.178,11.494,256,30.659C237.822,11.494,212.235,0,184.517,0c-52.693,0-95.856,41.574-98.405,93.645
			c-42.274,14.199-72.026,54.09-72.026,100.349c0,23.883,7.951,46.643,22.328,65.06c-11.54,17.212-17.724,37.426-17.724,58.706
			c0,44.488,27.311,83.143,67.347,98.661c1.562,52.973,45.138,95.58,98.481,95.58c27.716,0,53.305-11.495,71.485-30.659
			C274.178,500.506,299.767,512,327.483,512c53.341,0,96.919-42.606,98.481-95.578c40.035-15.52,67.348-54.173,67.348-98.661
			c0-21.282-6.184-41.494-17.726-58.706C489.962,240.638,497.914,217.876,497.914,193.994z M232.729,432.842
			c-7.866,19.63-26.826,32.613-48.212,32.613c-28.661,0-51.979-23.318-51.979-51.98c0-3.278,0.32-6.609,0.954-9.899
			c0.006-0.036,0.008-0.071,0.016-0.107c1.977-10.147,6.901-19.394,14.255-26.75c9.089-9.089,9.089-23.823,0-32.912
			c-9.087-9.089-23.824-9.089-32.912,0c-7.692,7.694-13.978,16.493-18.705,26.072c-18.648-10.12-30.911-29.805-30.911-52.118
			c0-16.389,6.555-31.652,18.458-42.98c0.074-0.07,0.137-0.151,0.209-0.223c11.048-10.404,25.477-16.137,40.67-16.137h38.336
			c12.853,0,23.273-10.42,23.273-23.273c0-12.853-10.42-23.273-23.273-23.273h-38.335c-19.278,0-37.857,5.19-54.081,14.853
			c-6.366-9.599-9.861-20.918-9.861-32.735c0-30.172,22.568-55.507,52.497-58.931c6.391-0.731,12.193-4.074,16.03-9.236
			c3.838-5.162,5.368-11.681,4.228-18.012c-0.563-3.123-0.847-6.248-0.847-9.29c-0.002-28.658,23.316-51.976,51.977-51.976
			c21.388,0,40.346,12.982,48.212,32.613V432.842z M349.094,258.423h38.336c15.191,0,29.617,5.73,40.662,16.13
			c0.074,0.073,0.14,0.157,0.216,0.23c11.903,11.328,18.46,26.593,18.46,42.98c-0.002,22.312-12.263,41.995-30.911,52.115
			c-4.727-9.581-11.013-18.381-18.707-26.073c-9.089-9.087-23.825-9.087-32.912,0.002c-9.087,9.089-9.087,23.825,0.002,32.912
			c7.348,7.346,12.273,16.587,14.251,26.728c0.008,0.042,0.009,0.085,0.019,0.127c0.633,3.289,0.954,6.62,0.954,9.899
			c0,28.663-23.318,51.98-51.979,51.98c-21.386,0-40.344-12.982-48.209-32.613V79.158c7.863-19.631,26.821-32.613,48.207-32.613
			c28.661,0,51.979,23.318,51.979,51.979c0,3.047-0.285,6.173-0.846,9.29c-1.14,6.33,0.389,12.85,4.228,18.012
			c3.837,5.162,9.64,8.505,16.03,9.238c29.927,3.426,52.495,28.76,52.495,58.931c0,11.816-3.496,23.135-9.86,32.734
			c-16.223-9.661-34.8-14.851-54.08-14.851h-38.336c-12.853,0-23.273,10.42-23.273,23.273
			C325.821,248.003,336.241,258.423,349.094,258.423z"
            />
          </g>
        </g>
      </svg>
    ),
  },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, openLoginForm } = useAppContext()
  const router = useRouter()

  const handleLogoClick = useCallback(() => {
    if (isOpen) {
      router.push('/')
    } else {
      onToggle()
    }
  }, [isOpen, onToggle, router])

  return (
    <>
      <SidebarOverlay $isOpen={isOpen} onClick={onToggle} />
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader $isOpen={isOpen}>
          <SidebarLogoIcon
            onClick={handleLogoClick}
            title={isOpen ? 'Go to home' : 'Expand sidebar'}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </SidebarLogoIcon>
          {isOpen && (
            <>
              <SidebarLogoText href="/" $isOpen={isOpen}>
                AI Agent
              </SidebarLogoText>
              <SidebarCollapseButton
                $isOpen={isOpen}
                onClick={onToggle}
                title="Collapse sidebar"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </SidebarCollapseButton>
            </>
          )}
        </SidebarHeader>

        <SidebarNav $isOpen={isOpen}>
          {navItems.map((item) => (
            <SidebarNavItem key={item.href} $isOpen={isOpen}>
              <Link href={item.href}>
                <NavItemIcon>{item.icon}</NavItemIcon>
                <NavItemLabel $isOpen={isOpen}>{item.label}</NavItemLabel>
              </Link>
            </SidebarNavItem>
          ))}
        </SidebarNav>

        <SidebarFooter>
          <SidebarUserSection $isOpen={isOpen}>
            {user ? (
              <UserLink user={user} showName={isOpen} size="small" />
            ) : (
              <button onClick={openLoginForm}>
                <UserAvatar>
                  <UserIcon />
                </UserAvatar>
                {isOpen && <span>Sign in</span>}
              </button>
            )}
          </SidebarUserSection>
        </SidebarFooter>
      </SidebarContainer>
    </>
  )
}

export const SidebarMemo = memo(Sidebar)
