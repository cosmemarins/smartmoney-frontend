import React, { useCallback, useState } from 'react'

import { useDropzone } from 'react-dropzone'

const UploadDropZone = () => {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop
  })

  return (
    <div {...getRootProps()} className='mb-8'>
      <input
        {...getInputProps()}
        className='focus:shadow-outline w-full appearance-nome rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
      />
      <div
        className={'w-full border border-dashed border-gray-900 p-2 ' + (isDragActive ? 'bg-gray-400' : 'bg-gray-200')}
      >
        {isDragActive ? (
          <p className='my-2 text-center'>Drop the files here ...</p>
        ) : (
          <p>Drag drop some files here, or click to select files</p>
        )}
        {!!files.length && (
          <div className='mt-2 grid grid-cols-1 gap-1'>
            {files.map((file: File) => {
              return (
                <div key={file.name}>
                  <img src={URL.createObjectURL(file)} alt={file.name} className='w-full' />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadDropZone
