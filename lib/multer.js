import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    console.log(path.extname(file.originalname));

    const extname = path.extname(file.originalname);

    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + extname
    );
  },
});

export const imageUpload = multer({
  storage: storage,
});