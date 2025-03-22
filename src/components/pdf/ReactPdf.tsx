import { useState } from 'react'

import { Button, IconButton } from '@mui/material'

import { Document, Page, pdfjs } from 'react-pdf'

// Text layer for React-PDF.
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import type { PdfProps } from '@/types/ReactPdfType'

// Style Imports
//import styles from './styles.module.css'
import './styles.css'

// Importing the PDF.js worker.
//pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const ReactPdf = ({ base64Content, fileName }: PdfProps) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  const goToPrevPage = () => setPageNumber(v => (v > 1 ? --v : 1))

  const goToNextPage = () => setPageNumber(v => (v < numPages ? ++v : numPages))

  const download = () => {
    const pom = document.createElement('a')

    pom.setAttribute('href', 'data:application/pdf;base64,' + base64Content)
    pom.setAttribute('download', fileName || 'documentacao.pdf')

    if (document.createEvent) {
      const event = document.createEvent('MouseEvents')

      event.initEvent('click', true, true)
      pom.dispatchEvent(event)
    } else {
      pom.click()
    }
  }

  return (
    <div className='page'>
      <nav>
        <Button variant='contained' startIcon={<i className='tabler-arrow-big-left' />} onClick={goToPrevPage}>
          Anterior
        </Button>
        <p>
          Página {pageNumber} de {numPages}
        </p>
        <Button variant='contained' endIcon={<i className='tabler-arrow-big-right' />} onClick={goToNextPage}>
          Próxima
        </Button>
        <IconButton onClick={download} title='clique para fazer o download do documento' sx={{ marginLeft: '70px' }}>
          <i className='tabler-download'></i>
        </IconButton>
      </nav>

      <Document file={`data:application/pdf;base64,${base64Content}`} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} />
      </Document>
    </div>
  )
}

export default ReactPdf
