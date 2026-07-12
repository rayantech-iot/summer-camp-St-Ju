const MAX_DIM = 1200
const QUALITY = 0.82

export function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img
      if (file.type === 'image/jpeg' && width <= MAX_DIM && height <= MAX_DIM && file.size < 500_000) {
        resolve(file)
        return
      }

      if (width > MAX_DIM || height > MAX_DIM) {
        if (width > height) {
          height = Math.round(height * MAX_DIM / width)
          width = MAX_DIM
        } else {
          width = Math.round(width * MAX_DIM / height)
          height = MAX_DIM
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas context unavailable')); return }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Compression failed')); return }
        const name = file.name.replace(/\.[^.]+$/, '.jpg')
        resolve(new File([blob], name, { type: 'image/jpeg' }))
      }, 'image/jpeg', QUALITY)
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Invalid image file')) }
    img.src = url
  })
}
