// components/shared/file-upload.tsx
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, File, Image as ImageIcon, FileText } from "lucide-react"
import { uploadFileObject } from "@/lib/services/s3"

interface FileUploadProps {
  onFileUpload: (url: string, file: File) => void
  folder: string
  accept?: string
  maxSize?: number // in MB
  multiple?: boolean
  className?: string
  buttonText?: string
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "digigo"
}

export function FileUpload({
  onFileUpload,
  folder,
  accept = "*/*",
  maxSize = 10, // Default 10MB
  multiple = false,
  className = "",
  buttonText = "Upload File",
  buttonVariant = "outline"
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setError(null)
    setIsUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(`File ${file.name} exceeds the maximum size of ${maxSize}MB`)
          continue
        }

        // Upload to S3
        const url = await uploadFileObject(file, folder)
        
        // Call the callback with the URL
        onFileUpload(url, file)
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("Failed to upload file. Please try again.")
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      
      <Button
        type="button"
        variant={buttonVariant as any}
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>Uploading...</span>
          </div>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {buttonText}
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

// File preview component
interface FilePreviewProps {
  file: {
    name: string
    url: string
    type?: string
    size?: string
  }
  onRemove?: () => void
  className?: string
}

export function FilePreview({ file, onRemove, className = "" }: FilePreviewProps) {
  const getFileIcon = () => {
    const fileType = file.type?.toLowerCase() || file.name.split('.').pop()?.toLowerCase()
    
    if (fileType?.includes('image') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType || '')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />
    } else if (fileType?.includes('pdf') || fileType === 'pdf') {
      return <FileText className="w-5 h-5 text-red-500" />
    } else {
      return <File className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className={`flex items-center justify-between p-2 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center overflow-hidden">
        {getFileIcon()}
        <span className="ml-2 text-sm text-gray-700 truncate">{file.name}</span>
        {file.size && (
          <span className="ml-2 text-xs text-gray-500">({file.size})</span>
        )}
      </div>
      
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
