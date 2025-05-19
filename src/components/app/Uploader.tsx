import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileRejection } from 'react-dropzone'
import Box from '../../assets/box.svg'
import Pattern from '../../assets/pattern.png'
import Alert from '../core/alert'
import '../../App.css'
import axios from 'axios'

interface UploaderProps {
  formats: {
    [format: string]: string[]
  }
  maxSize: number
}

function Uploader({ formats, maxSize }: UploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{
    file: File
    progress: number
    status: 'Uploading' | 'Completed' | 'Failed'
  }[]>([])

  const handleUpload = async (file: File) => {
    const validFormats = Object.keys(formats)
    const isValidFormat = validFormats.includes(file.type)
    const isValidSize = file.size <= maxSize * 1024 * 1024

    if (!isValidFormat) {
      return
    }

    if (!isValidSize) {
      setUploadedFiles((prev) => {
        const exists = prev.find((f) => f.file.name === file.name)
        if (exists) {
          return prev.map((f) =>
            f.file.name === file.name ? { ...f, progress: 0, status: 'Failed' } : f
          )
        } else {
          return [...prev, { file, progress: 0, status: 'Failed' }]
        }
      })
      return
    }

    setUploadedFiles((prev) => {
      const exists = prev.find((f) => f.file.name === file.name)
      if (exists) {
        return prev.map((f) =>
          f.file.name === file.name ? { ...f, progress: 0, status: 'Uploading' } : f
        )
      } else {
        return [...prev, { file, progress: 0, status: 'Uploading' }]
      }
    })

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          const percentComplete = Math.round((event.loaded * 100) / event.total!)
          setUploadedFiles((prev) =>
            prev.map((f) => f.file.name === file.name ? { ...f, progress: percentComplete } : f)
          )
        },
      })
      setUploadedFiles((prev) => prev.map((f) => f.file.name === file.name ? { ...f, status: 'Completed', progress: 100 } : f))
    } catch {
      setUploadedFiles((prev) => prev.map((f) => f.file.name === file.name ? { ...f, status: 'Failed' } : f))
    }
  }

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
      acceptedFiles.forEach((file) => handleUpload(file))

      fileRejections.forEach((rejection: FileRejection) => {
        const file = rejection.file
        setUploadedFiles((prev) => {
          const exists = prev.find((f) => f.file.name === file.name)
          if (exists) {
            return prev.map((f) => f.file.name === file.name ? { ...f, progress: 0, status: 'Failed' } : f)
          } else {
            return [...prev, { file, progress: 0, status: 'Failed' }]
          }
        })
      })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: formats,
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
  })

  const deleteItem = async (filename: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file.name !== filename))
    try {
      await axios.delete('http://localhost:3000/upload', {
        data: { filename },
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.log('Error deleting file', error)
    }
  }

  const retryUpload = (file: File) => {
    handleUpload(file)
  }

  return (
    <div>
      <div className='bg-white border border-solid border-[#eee] rounded-[10px] w-[600px] mx-auto mt-[29px]'>
        <div className='py-5 px-8'>
          <label className='text-base block font-medium interTight !text-left text-[#3F3F3F]'>
            File
          </label>

          <div
            {...getRootProps()}
            className='w-full flex items-center justify-center mt-2 h-[267px] rounded-[10px] border border-dashed cursor-pointer border-[#B6B6B6] bg-[#FBFBFB]'
            style={{
              backgroundImage: `url('${Pattern}')`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <input {...getInputProps()} />
            <div className='text-center pointer-events-none'>
              {isDragActive && <img src={Box} className='mx-auto w-[115px]' alt='' />}
              <h4 className='text-2xl font-semibold leading-[110%]'>
                <span className='text-[#8E949D]'>Drag & drop a</span>{' '}
                <span className='text-[#3B3A42]'>file</span>
                <br />
                <span className='text-[#8E949D]'>or</span>{' '}
                <span className='text-[#3B3A42]'>browse</span>{' '}
                <span className='text-[#8E949D]'>to upload</span>
              </h4>
              <button
                type='button'
                className='text-base mt-[11px] text-white rounded-lg px-2.5 py-3 interDisplay pointer-events-none'
                style={{ boxShadow: '0px 4px 11px 0px #00000017' }}
              >
                <span className='w-[86px] block !font-medium tracking-tighter'>Browse</span>
              </button>
              <p className='text-[#8E949D] tracking-tight font-medium mt-[11px] text-xs'>
                  File must be{' '}
                  {Object.values(formats).flat().map((extension, index, arr) => (
                    <span key={extension}>
                      <span className='text-[#3D3D3D]'>{extension.toUpperCase()}</span>
                      {index < arr.length - 1 && ' or '}
                    </span>
                  ))}
              </p>
              <p className='text-[#3D3D3D] font-medium mt-1.5 text-xs'>Max → {maxSize}MB</p>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className='mt-7'>
              <label className='text-base block font-medium interTight !text-left text-[#3F3F3F]'>
                List
              </label>
              {uploadedFiles.map(({ file, progress, status }) => (
                <Alert
                  key={file.name}
                  name={file.name}
                  size={(file.size / (1024 * 1024)).toFixed(1) + 'MB'}
                  progress={progress}
                  status={status}
                  onRetry={() => retryUpload(file)}
                  onDelete={() => deleteItem(file.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Uploader