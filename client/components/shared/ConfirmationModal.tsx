'use client'

import React, { useState } from 'react'
import { AlertCircle, Loader } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => Promise<void> | void
  onSuccess?: () => void
  onError?: (error: unknown) => void
  itemType?: string
  itemName?: string
  icon?: React.ReactNode
  errorContext?: Record<string, unknown>
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onSuccess,
  onError,
  itemType,
  itemName,
  icon = <AlertCircle className="h-8 w-8" />,
}: ConfirmationModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const defaultTitle = title || `Confirm ${itemType || 'action'}`
  const defaultDescription = description || 
    `Are you sure you want to ${itemType || 'proceed'} with "${itemName || 'this'}"? This action cannot be undone.`

  const handleConfirm = async () => {
    if (isConfirming) return

    try {
      setIsConfirming(true)
      await onConfirm()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      onError?.(error)
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCancel = () => {
    if (!isConfirming) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <>
          {/* Custom animated overlay */}
          <div
            className="fixed h-screen inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => !isConfirming && onOpenChange(false)}
          />
          
          {/* Dialog content with enhanced animations */}
          <DialogContent
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl border border-border bg-card p-6 shadow-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full space-y-4"
            >
              <DialogHeader className="items-center space-y-2">
                {icon ? (
                  <div className={cn(
                    "mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4",
                    "bg-muted text-destructive",
                    variant === 'destructive' && "bg-destructive/10 border border-destructive/20 shadow-lg"
                  )}>
                    {icon}
                  </div>
                ) : null}
                <DialogTitle className={cn(
                  "text-center text-xl font-semibold leading-6",
                  "text-card-foreground"
                )}>
                  {defaultTitle}
                </DialogTitle>
                <DialogDescription className={cn(
                  "text-center text-sm text-muted-foreground mt-2"
                )}>
                  {defaultDescription}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-6 flex justify-center sm:justify-end gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isConfirming}
                  className={cn(
                    "min-w-24 px-6 py-2.5 font-medium transition-all duration-200",
                    "border-border",
                    "text-foreground",
                    "hover:border-border hover:bg-accent",
                    "hover:shadow-md hover:scale-[1.01]",
                    "active:scale-[0.98]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                >
                  {cancelText}
                </Button>
                <Button
                  variant={variant}
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className={cn(
                    "min-w-24 px-6 py-2.5 font-medium transition-all duration-200",
                    "hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    "focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                >
                  {isConfirming ? (
                    <div
                      className="flex items-center"
                    >
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    </div>
                  ) : (
                    confirmText
                  )}
                </Button>
              </DialogFooter>
            </div>

          </DialogContent>
        </>
      )}
    </Dialog>
  )
}
