import products from "../model/productModel";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();


class product {


    async createProduct(req: Request, res: Response) {
        const productData = req.body
        try {
            const existingStaff = await products.findOne({ where: { productName: productData.productName } });
            if (existingStaff) return res.send({ message: "product Already exists" });
            const productCreation = await products.create(productData);
            const product_id = productCreation.id;
            return res.send({ message: "products added Successfully", product_id })

        } catch (err) {
            console.error(err)
            return res.send({ message: "Server Error", err })
        }
    
    }
    async updateProduct(req: Request, res: Response) {
        const productId = req.params.id;
        const updatedData = req.body;
        try {
            const existingProduct = await products.findByPk(productId);
            if (!existingProduct) return res.status(404).json({ message: "Product not found" });
    
            await existingProduct.update(updatedData);
            return res.status(200).json({ message: "Product updated successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }
    async deleteProduct(req: Request, res: Response) {
        const productId = req.params.id;
        try {
            const existingProduct = await products.findByPk(productId);
            if (!existingProduct) return res.status(404).json({ message: "Product not found" });
    
            await existingProduct.destroy();
            return res.status(200).json({ message: "Product deleted successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }
    async getProduct(req: Request, res: Response) {
        const productId = req.params.id;
        try {
            const product = await products.findByPk(productId);
            if (!product) return res.status(404).json({ message: "Product not found" });
    
            return res.status(200).json({ product });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }
    async getAllProduct(req: Request, res: Response) {
        const productId = req.params.id;
        try {
            const product = await products.findAll();
            return res.status(200).json({ product });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }
    
    
}

export default new product();