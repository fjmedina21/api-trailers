const cloudinary = require('cloudinary').v2
const fs = require('fs-extra')

cloudinary.config(process.env.CLOUDINARY_URL)

const imgUpload = async (imgFile, schema) => {

   const { tempFilePath } = imgFile

   const { public_id, secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'app-pelicula' })

   schema.img = {
      public_id,
      imgURL: secure_url
   }

   await fs.unlink(tempFilePath)

}

const imgDelete = async(public_id) => {

   return await cloudinary.uploader.destroy(public_id)

}


FIXME: "imgUpload Method - not working"
const imgUpdate = async (imgFile, img, schema ) => {
   const dbPublicId = img.public_id
   const { tempFilePath } = imgFile

   const result = await imgUpload(imgFile, schema)
   if (result) await imgDelete(dbPublicId)


   await fs.unlink(tempFilePath)

}


module.exports = {
   imgUpload,
   imgDelete,
   imgUpdate
}