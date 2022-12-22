const { response } = require('express')

const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const imgUpload = async (imgFile, schema, res = response ) => {

   const validExtensions = ["jpg","jpeg","webp","png","svg"]


   try{
      const imgNameArr = imgFile.name.split('.');
      const ext = imgNameArr[1]

      if (!validExtensions.includes(ext)) throw { msg: "Invalid file type" }

      const { tempFilePath } = imgFile

      const { public_id, secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'app-pelicula' })

      schema.img = {
         public_id,
         imgURL: secure_url
      }

   } catch(error) {
      res.status(400).json({
         error
      })
   }

}

const imgDelete = async (public_id) => {

   await cloudinary.uploader.destroy(public_id)

}

const imgUpdate = async (imgFile, img, schema, res) => {

   const dbPublicId = img.public_id

   if (dbPublicId) {
      await imgDelete(dbPublicId)
   }

   await imgUpload(imgFile, schema, res)

}


module.exports = {
   imgUpload,
   imgDelete,
   imgUpdate
}
