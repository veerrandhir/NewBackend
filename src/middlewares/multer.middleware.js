import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './public/temp') // cb is a call back fn 

    },
    filename: function (req, file, cb) {
    
    cb(null, file.originalname) // we can update username or customize file name here.
    }
  })
  
export const upload = multer({ 
    storage, })