const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const imgUpload = async(path) => {

   return await cloudinary.uploader.upload(path, { folder: 'app-pelicula' })

}

const imgDelete = async(public_id) => {

   return await cloudinary.uploader.destroy(public_id)

}

const imgUpdate = async (dbPublicId, newIMGPath) => {

   const { result } = await imgDelete(dbPublicId)

   if (result === "ok") {
      const { public_id, secure_url } = await imgUpload(newIMGPath)

      return { public_id, secure_url }
   }
   else if (result === "not found")
      return {err_msg:"Please provide correct public_id"}
   else {
      return { err_msg: "Try again later." }
   }

}



module.exports = {
   imgUpload,
   imgDelete,
   imgUpdate
}