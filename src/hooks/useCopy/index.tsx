import { useCallback } from 'react'
import { useSnackbar } from 'src/ui-kit/Snackbar'

export function useCopy() {
  const { addMessage } = useSnackbar() || {}

  const onClickCopy = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()

      const token = event.currentTarget.value

      if (token) {
        navigator.clipboard.writeText(token).then(() => {
          addMessage?.('Token copied to clipboard', {
            variant: 'success',
          })
        })
      }
    },
    [addMessage],
  )

  return {
    onClickCopy,
  }
}
