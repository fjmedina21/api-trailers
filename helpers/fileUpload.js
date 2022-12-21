const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const imgUpload = async (imgFile, schema) => {

   /*
   const validExtensions = ["jpg","jpeg","webp","png","svg","gif"]

   try{
      const words = imgFile.title.split('.');
      const ext = words[1]

       if (!validExt.includes(ext)) throw 'invalid file'

      console.log(ext);

   } catch(err) {
      console.log(err);
   }
   */
   
   const { tempFilePath } = imgFile

   const { public_id, secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: 'app-pelicula' })

   schema.img = {
      public_id,
      imgURL: secure_url
   }

}

const imgDelete = async (public_id) => {

   await cloudinary.uploader.destroy(public_id)

}

const imgUpdate = async (imgFile, img, schema) => {

   const dbPublicId = img.public_id

   if (dbPublicId) {
      await imgDelete(dbPublicId)
   }

   await imgUpload(imgFile, schema)

}


module.exports = {
   imgUpload,
   imgDelete,
   imgUpdate
}
