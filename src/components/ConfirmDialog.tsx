'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
}

let confirmResolve: ((value: boolean) => void) | null = null
let confirmOptions: ConfirmOptions = { title: '', message: '' }
let onTrigger = () => {}

export function confirm(options: ConfirmOptions): Promise<boolean> {
  confirmOptions = options
  onTrigger()
  return new Promise((resolve) => {
    confirmResolve = resolve
  })
}

export default function ConfirmDialogGlobal() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({ title: '', message: '' })
  const { t } = useLanguage()

  const trigger = useCallback(() => {
    setOptions({ ...confirmOptions })
    setOpen(true)
  }, [])

  useEffect(() => {
    onTrigger = trigger
  }, [trigger])

  const handleConfirm = () => {
    setOpen(false)
    confirmResolve?.(true)
    confirmResolve = null
  }

  const handleCancel = () => {
    setOpen(false)
    confirmResolve?.(false)
    confirmResolve = null
  }

  if (!open) return null

  const isDanger = options.variant === 'danger' || options.variant === undefined

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gsc-gray/90 border border-gsc-gray/30 w-full max-w-sm p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-2 ${isDanger ? 'bg-gsc-red/20' : 'bg-gsc-orange/20'} shrink-0`}>
            <AlertTriangle size={24} className={isDanger ? 'text-gsc-red' : 'text-gsc-orange'} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-xl text-gsc-white tracking-wider">{options.title}</h3>
              <button onClick={handleCancel} className="text-gsc-white/40 hover:text-gsc-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gsc-white/60 leading-relaxed">{options.message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 border border-gsc-gray/40 text-gsc-white/70 hover:text-gsc-white hover:border-gsc-gray/30 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all"
          >
            {options.cancelLabel || t('confirmDialog.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 text-white px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              isDanger ? 'bg-gsc-red hover:bg-gsc-red/90' : 'bg-gsc-orange hover:bg-gsc-orange/90'
            }`}
          >
            {options.confirmLabel || t('confirmDialog.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
