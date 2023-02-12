const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const validateFileExt = (file) => {

   const validIMGExtensions = ["jpg", "jpeg", "webp", "png", "svg"]

   const fileNameArr = file.name.split('.');
   const ext = fileNameArr[1]

   try {
      if (!validIMGExtensions.includes(ext)) throw {
         error: {
            field: "img",
            msg: "Invalid file type"
         }
      }

   } catch (error) {
      return error
   }

}

const imgUpload = async (file, schema) => {

   try{
      const result = validateFileExt(file)
      if (result) throw result

      const { tempFilePath } = file
      const { public_id, secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'app-pelicula' })

      schema.img = {
         public_id,
         imgURL: secure_url
      }

   } catch(error) {
      return error
   }

}

const imgDelete = async (public_id) => {

   await cloudinary.uploader.destroy(public_id)

}

const imgUpdate = async (file, img, schema) => {

   try {
      const dbPublicId = img.public_id

      const result = validateFileExt(file)
      if (result) throw result

      if (dbPublicId) await imgDelete(dbPublicId)
      await imgUpload(file, schema)

   } catch (error) {
      return error
   }

}


module.exports = {
   imgUpload,
   imgDelete,
   imgUpdate
}
