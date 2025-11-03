const Product = require('../models/Product');
const {returnJson}= require('../my-modules/json-response')
const createError = require('http-errors');
const cloudinary = require('../config/cloudinaryConfig');

//admin
const createProduct = async (req,res,next)=>{
    try {
         const productData = req.body;
        const product = new Product(productData);
        await product.save();
        returnJson(res,201,true,product,'Product Created Successfully');

    } catch (error) {

        if (error.name === 'ValidationError') {
        return next(createError(400, error.message));
        }
        console.log(error);
        return next(createError(500, 'Error In Create Product.'));

    }

};
//admin
const updateProduct = async(req,res,next)=>{
    try {
        const productId = req.params.id;
        const productData = req.body;

        const product = await Product.findByIdAndUpdate({_id:productId},productData,{new:true,runValidators:true});
        if(!product){
            return next(createError(404,'Product is not found.'))
        }
        returnJson(res,200,true,product,'Product Updated Successfully.')

    } catch (error) {
        console.log(error);
        return next(createError(500,'Error In Update Product.'))
    }

};

const getAllProducts = async (req, res, next) => {
    try {
        const queryObject = {};

        if (req.query.search) {
            queryObject.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.category) {
            queryObject.category = req.query.category;
        }


        let query = Product.find(queryObject);

        if (req.query.sort) {
            const sortOptions = req.query.sort.split('-');
            const sortBy = sortOptions[0];
            const order = sortOptions[1] === 'desc' ? -1 : 1;
            query = query.sort({ [sortBy]: order });
        } else {
            query = query.sort('-createdAt');
        }

        const products = await query;

        if (products.length === 0) {
            return returnJson(res, 200, true, [], 'No products found matching your criteria.');
        }

        returnJson(res, 200, true, products, 'Products fetched successfully.');

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error in Get All Products.'));
    }
};


const getProductByID = async (req,res,next)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findById({_id:productId});
        if(!product){
            return next(createError(404,'Not Found Any Product.'))
        }
        returnJson(res,200,true,product,'Get Product By Id Successfully');

    } catch (error) {
        console.log(error);
        return next(createError(500,'Error In Get product By Id.'))
    }

};
//admin
const deleteProduct = async (req,res,next)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete({_id:productId});
        if(!product){
            return next(createError(404,'Not Found Product.'))
        }
        returnJson(res,200,true,product,'Product Deleted Successfully');

    } catch (error) {
        console.log(error);
        return next(createError(500,'Error In Delete Product.'))
    }
};

const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(createError(400, 'No image file provided.'));
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(createError(404, 'Product not found.'));
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'device-store-products', 
            public_id: `product_${product._id}` 
        });

        
        product.imageUrl = result.secure_url;
        await product.save();

        returnJson(res, 200, true, product, 'Image uploaded and product updated successfully.');

    } catch (error) {
        console.log(error);
        return next(createError(500, 'Error uploading product image.'));
    }
};


module.exports = {createProduct,updateProduct,getProductByID,getAllProducts,deleteProduct,uploadProductImage};