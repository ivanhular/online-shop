const faker = require('faker')
const mongoose = require('mongoose')
const Product = require('../models/product')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')


const generateProduct = async (noOfProduct) => {

    try {
        const bulkProduct = []
        const categories = ['5e3aa638ba4e2e3714db1815', '5e3beaf8d55ed331740934f4']
        const segments = ['5e3be986ff289e1b141ae9f7', '5e3a9c36463a5e0017645ae9', '5e3a9c3d463a5e0017645aea']
        let imageBuffer1 = fs.readFileSync(path.join(__dirname, "../../../img/1.png"))
        let imageBuffer2 = fs.readFileSync(path.join(__dirname, "../../../img/2.png"))
        let imageBuffer3 = fs.readFileSync(path.join(__dirname, "../../../img/4.png"))


        // const ImageBinary = Buffer.from(imageBuffer).toString('binary')
        const ImageBinary1 = Buffer.from(imageBuffer1).toString('base64')
        const ImageBinary2 = Buffer.from(imageBuffer2).toString('base64')
        const ImageBinary3 = Buffer.from(imageBuffer3).toString('base64')

        const imagesArrayBinary = [ImageBinary1, ImageBinary2, ImageBinary3]
        // const ImageBinary = Buffer.from(imageBuffer)
        // console.log(photobuffer)

        // const photobuffer = await sharp(ImageBinary)
        //     .png()
        //     .toBuffer()

        // console.log(typeof photobuffer)

        // console.log(imageBuffer3)

        for (let i = 1; i <= noOfProduct; i++) {

            let id = new mongoose.Types.ObjectId()

            let date = new Date()

            let newProduct = {
                _id: {
                    $oid: id
                },
                product_name: faker.commerce.productName(),
                product_descriptions: 'This is a sample content not meant to read',
                markup: {
                    $numberInt: "10"
                },
                discount: {
                    $numberInt: "50"
                },
                weight: {
                    $numberDouble: "1.1"
                },
                supplier_name: faker.company.companyName(),
                status: 'true',
                price_options: [
                    {
                        variation_name: "small",
                        options: [
                            {

                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(500, 600)
                            },
                            {
                                // "_id": {
                                //     "$oid": "5e48e1ca2290863d88252620"
                                // },
                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(600, 700)

                            },
                            {
                                // "_id": {
                                //     "$oid": "5e48e1ca2290863d88252620"
                                // },
                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(800, 1000)

                            }
                        ]
                    },
                    {
                        variation_name: "medium",
                        options: [
                            {

                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(500, 600)
                            },
                            {
                                // "_id": {
                                //     "$oid": "5e48e1ca2290863d88252620"
                                // },
                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(600, 700)

                            },
                            {
                                // "_id": {
                                //     "$oid": "5e48e1ca2290863d88252620"
                                // },
                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(800, 1000)

                            }
                        ]
                    },
                    {
                        variation_name: "large",
                        options: [
                            {

                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(500, 600)
                            },
                            {
                                // "_id": {
                                //     "$oid": "5e48e1ca2290863d88252620"
                                // },
                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(600, 700)

                            },
                            {
                                // "_id": {
                                //     "$oid": "5e48e1ca2290863d88252620"
                                // },
                                option_name: faker.commerce.color(),
                                price: faker.commerce.price(800, 1000)

                            }
                        ]
                    },


                ],
                photos: [
                    {
                        // _id: {
                        //     "$oid": "5e48e1ca2290863d8825261e"
                        // },
                        photo: {
                            "$binary": {
                                "base64": imagesArrayBinary[Math.floor(Math.random() * imagesArrayBinary.length)],
                                // "base64": ImageBinary1,
                                "subType": "00"
                            }
                        },
                        featured: 'true',
                        name: "1.png",
                        mimetype: "image/png",
                        url: `/products/${id}/1.png`
                    }
                ],
                segment_id: {
                    $oid: segments[Math.floor(Math.random() * segments.length)]
                },
                category_id: {
                    $oid: categories[Math.floor(Math.random() * categories.length)]
                },
                createdAt: {
                    $date: {
                        $numberLong: `${date.getTime()}`
                    }
                },
                updatedAt: {
                    $date: {
                        $numberLong: `${date.getTime()}`
                    }
                }
            }
            // bulkProduct.push({
            //     insertOne: {
            //         "document": newProduct
            //     }
            // })
            bulkProduct.push(newProduct)
            // console.log(imagesArrayBinary[Math.floor(Math.random() * imagesArrayBinary.length)])
        }

        // console.log(bulkProduct)

        fs.writeFileSync('products.json', JSON.stringify(bulkProduct))
        // fs.writeFileSync('products.json', bulkProduct)

        // console.log(bulkProduct)

        // Product.insert(bulkProduct, function (err, docs) {

        //     console.log(docs)

        // })
        // const product = bulkProduct


        // return bulkProduct

    } catch (e) {
        return e.message
    }
}

const products = generateProduct(1).then(data => {

    // console.log(data)

}).catch(e => {
    console.log(e)
})




// console.log()
