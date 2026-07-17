import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(process.cwd(), "uploads", "files");

    if (file.fieldname === "fairBanner") {
        uploadPath = path.join(process.cwd(), "uploads", "banner");
    }
    else if (file.fieldname === "fairLogo") {
        uploadPath = path.join(process.cwd(), "uploads", "logo");
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.originalname === "empty_logo.txt") {
    return cb(null, true);
  }

  const allowedTypes = /jpg|jpeg|png|webp|pdf|doc|docx|xls|xlsx/;

  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = file.mimetype.startsWith("image/") || 
                   file.mimetype.includes("pdf") || 
                   file.mimetype.includes("word") || 
                   file.mimetype.includes("document") ||
                   file.mimetype.includes("spreadsheet") ||
                   file.mimetype.includes("excel");

  if (extName && mimeType) {
    return cb(null, true);
  }

  cb(new Error("Only images and documents (PDF, DOCX, XLS, XLSX) are allowed."));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});