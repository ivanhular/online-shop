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


const saveOptimizedImage = async function (modelObj, req) { //params Model and photo files

    const { files, protocol } = req

    try {

        if (files.length === 0) {
            return
        }

        const photos = files.map(async (photo) => {

            // const optimizedImage = await product.optimizedImage(photo.buffer)

            const imageBuffer = await sharp(photo.buffer)
                // .resize(250, 250)
                // .jpeg()
                .toBuffer()

            return {
                // photo: photo.buffer,
                photo: imageBuffer,
                name: photo.originalname,
                mimetype: photo.mimetype,
                // url: `${protocol}://${domain}/${modelObj.collection.collectionName}/${modelObj._id}/${photo.originalname}`
                url: `/${modelObj.collection.collectionName}/${modelObj._id}/${photo.originalname}`
            }

        })

        const dataImage = await Promise.all(photos) // Promise.all return array of promises data

        // console.log(dataImage)

        modelObj.photos = dataImage

    } catch (e) {

        throw new Error(e.message)

    }

}


const getObjectProps = (obj) => Object.keys(obj) //return object properties




module.exports = {
    getObjectProps,
    upload,
    saveOptimizedImage
}