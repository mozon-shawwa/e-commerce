const express = require('express');
const {admin,auth} = require('../middlewares/');
const upload = require('../middlewares/multer');

const {
    createProduct,
    updateProduct,
    getProductByID,
    getAllProducts,
    deleteProduct,
    uploadProductImage}= require('../controllers/product');

const router = express.Router();

router.post('/create',auth,admin,createProduct)
      .put('/update/:id',auth,admin,updateProduct)
      .get('/getAll',getAllProducts)
      .get('/getById/:id',getProductByID)
      .delete('/delete/:id',auth,admin,deleteProduct)
      .post('/upload-image/:id', auth, admin, upload.single('image'), uploadProductImage);


module.exports = router;