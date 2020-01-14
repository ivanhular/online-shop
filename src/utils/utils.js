const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
            return cb(new Error('Please Upload Image Only!'))
        }
        cb(undefined, true)
    }
}) //initialize multer for image upload


const saveOptimizedImage = async function (modelObj,files) { //params Model and photo files

    try {
        const photos = files.map(async (photo) => {

            // const optimizedImage = await product.optimizedImage(photo.buffer)

            const imageBuffer = await sharp(photo.buffer)
                .resize(250, 250)
                .jpeg()
                .toBuffer()

                // console.log(photo)

            return {
                // photo: photo.buffer,
                photo: imageBuffer,
                name: photo.originalname,
                mimetype: photo.mimetype
            }

        })

        const dataImage = await Promise.all(photos) // Promise.all return array of promises data

        // console.log(dataImage)

        modelObj.photos = dataImage

    } catch (e) {
        
        throw new Error(e)

    }

}


const getObjectProps = (obj) => Object.keys(obj) //return object properties




module.exports = {
    getObjectProps,
    upload,
    saveOptimizedImage
}