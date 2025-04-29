import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',               // tên folder trong Cloudinary
        allowed_formats: ['jpg', 'png'],  // định dạng cho phép
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    } as any,
});




export default storage;