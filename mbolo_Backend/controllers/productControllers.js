const products = require('../models/products');
const Product = require('../models/products');

module.exports ={
    createProduct: async(req, res) =>{
        const newProduct = new Product(req.body);
        try {
            await newProduct.save();
            res.status(200).json("product created successfully")
        } catch (error) {
            res.status(500).json("faild to created the product");   
        }
    },

    getAllProduct: async(req, res) =>{
        try {
            const products = await Product.find().sort({createdAt: -1})
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json("faild to get the products");
        }
    },


    getProduct: async (req, res) =>{
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json("faild to get the product");   
        }
    },

    searchProduct: async(req, res) =>{
        try {
            const result = await Product.aggregate(
                [
              {
                $search: {
                  index: "mbolo_app",
                  text: {
                    query: req.params.key,
                    path: {
                      wildcard: "*",
                    },
                  },
                },
              }
            ]
            )
            // const product = await Product.findById(req.params.id);
            res.status(200).json(result);

        } catch (error) {
            res.status(500).json("faild to get the products");
        }
    }
}

