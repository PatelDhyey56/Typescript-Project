import path, { extname } from "path";
import Multer from "multer";
import { Request } from "express";

export const photoUpload = Multer({
  limits: {
    fieldNameSize: 300,
    fileSize: 1048000, // 1 Mb allowed
  },
  storage: Multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any): void =>
      cb(null, path.join(__dirname, "../../public/uploads")),
    filename: (req: Request, file: Express.Multer.File, cb: any): void =>
      cb(null, `${new Date()}${extname(file.originalname)}`),
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: any): void =>
    file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)
      ? cb(null, true)
      : cb(
          new Error(`Unsupported file type ${extname(file.originalname)}`),
          false
        ),
});
