const fs = require('fs')
const path = require('path')
const multer = require('multer')

const uploadDirectory = path.join(__dirname, '../../uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDirectory),
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase()
        const safeName = path.basename(file.originalname, extension).replace(/[^a-z0-9]+/gi, '-').toLowerCase()
        callback(null, `${Date.now()}-${safeName || 'image'}${extension}`)
    }
})

const imageUpload = multer({
    storage,
    limits: { files: 10, fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith('image/')) {
            callback(null, true)
            return
        }

        callback(new Error('Only image files are allowed'))
    }
})

const uploadedImageUrls = (req) => (req.files || []).map(file => {
    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
})

const handleUploadError = (error, _req, res, next) => {
    if (!error) {
        next()
        return
    }

    if (error instanceof multer.MulterError) {
        const message = error.code === 'LIMIT_FILE_SIZE'
            ? 'Each image must be 5 MB or smaller'
            : error.message
        res.status(400).json({ message })
        return
    }

    if (error.message === 'Only image files are allowed') {
        res.status(400).json({ message: error.message })
        return
    }

    next(error)
}

module.exports = { imageUpload, uploadedImageUrls, handleUploadError }
