const multer = require('multer');
const path = require('path');
const createError = require('http-errors' );

// دالة للتحقق من أن الملف المرفوع هو صورة
function fileFilter(req, file, cb) {
    // امتدادات الملفات المسموح بها (صور فقط)
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    // التحقق من امتداد الملف
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    // التحقق من نوع MIME
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        // إذا لم يكن الملف صورة، نرسل خطأ
        cb(createError(400, 'Error: Images Only!'));
    }
}

// إعداد multer
const upload = multer({
    storage: multer.diskStorage({}), // نستخدم تخزينًا مؤقتًا فارغًا لأننا سنرفع مباشرة إلى Cloudinary
    limits: { fileSize: 2 * 1024 * 1024 }, // تحديد أقصى حجم للملف (هنا 2 ميغابايت)
    fileFilter: fileFilter
});

module.exports = upload;