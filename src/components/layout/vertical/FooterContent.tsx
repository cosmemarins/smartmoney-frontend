'use client'

// Next Imports
import { useState } from 'react'

import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'
import AvisoLegal from '@/components/AvisoLegal'

const FooterContent = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached: isVerticalBreakpointReached } = useVerticalNav()
  const { isBreakpointReached: isHorizontalBreakpointReached } = useHorizontalNav()
  const [openDlgAviso, setOpenDlgAviso] = useState<boolean>(false)

  // Vars
  const isBreakpointReached =
    settings.layout === 'vertical' ? isVerticalBreakpointReached : isHorizontalBreakpointReached

  return (
    <>
      <div
        className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
      >
        <p>
          <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, by `}</span>
          <Link href='#' target='_blank' className='text-primary'>
            Smart Money
          </Link>
          <span className='text-textSecondary'>{`  - todos os direitos reservados `}</span>
        </p>
        {!isBreakpointReached && (
          <div className='flex items-center gap-4'>
            <Button
              variant='text'
              onClick={() => {
                setOpenDlgAviso(true)
              }}
            >
              Termos de uso
            </Button>
            <Link href='#' target='_blank' className='text-primary'>
              Documentação
            </Link>
            <Link href='#' target='_blank' className='text-primary'>
              Suporte
            </Link>
          </div>
        )}
      </div>
      <Dialog maxWidth='sm' open={openDlgAviso} aria-labelledby='form-dialog-title' disableEscapeKeyDown>
        <DialogTitle id='form-dialog-title'>Avisos Legais - LGPD - PLDFT</DialogTitle>
        <DialogContent>
          <AvisoLegal />
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setOpenDlgAviso(false)
            }}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FooterContent
