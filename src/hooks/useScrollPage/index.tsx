import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { DomElementId } from 'src/interfaces'

/**
 * Scrolls page to top
 */
export const scrollToTop = (_pathname: string) => {
  const main = document.getElementById(DomElementId.MainScrollableContainer)

  if (main && main.scrollTop > 1) {
    main.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/**
 * When URL changes, scrolls page to top
 */
export function useScrollPage() {
  const router = useRouter()

  const path = router.asPath.replace(/\?.*/, '')
  const hash = router.asPath.replace(/^.*?(#(.*)|$)/, '$2')

  useEffect(() => {
    if (hash) {
      return
    }

    scrollToTop(path)
  }, [path, hash])
}
