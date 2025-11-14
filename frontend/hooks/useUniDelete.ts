import { useState } from 'react'

interface UniDeleteConfig {
  itemName: string
  itemType: string
  onDelete: () => Promise<void>
  onSuccess?: () => void
  onError?: (error: any) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  showIcon?: boolean
  errorContext?: Record<string, any>
}

export interface UniDeleteProps extends UniDeleteConfig {
  
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function useUniDelete() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<UniDeleteConfig | null>(null)

  const open = (deleteConfig: UniDeleteConfig) => {
    setConfig(deleteConfig)
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    // Clear config after animation completes
    setTimeout(() => setConfig(null), 300)
  }

  const props: UniDeleteProps | null = config ? {
    ...config,
    open: isOpen,
    onOpenChange: (open) => {
      if (!open) close()
    },
  } : null

  return {
    open,
    close,
    props,
    isOpen,
  }
}