import products from "../model/productModel";
import OrderPlace from "../model/userShopingModel";
import UserLogin from "../model/userModel";
import { Op } from "sequelize";
import { Request, Response } from "express";
import ExcelJS from "exceljs";
import { invoiceGen, sendEmail } from "../helpers/invoice";
import dotenv from "dotenv";
import Wishlist from "../model/Wishlist";
dotenv.config();


class UserShopee {


    async getAllProduct(req: Request, res: Response) {
        try {
            const product = await products.findAll();
            return res.status(200).json({ product });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }

    async oderPlacing(req: Request, res: Response) {
        try {
            let orderIdTo = 0;
            const productData = req.body;
            const productQuantity = typeof (productData.product_id);
            const user = req.user

            if (productQuantity == 'number') { // For One Product Purchase
                const userId = await UserLogin.findOne({ where: { email: user } });
                if (!userId) return res.send({ message: "User Not Found" });

                const productDetail = await products.findByPk(productData.product_id);
                if (!productDetail) return res.status(404).json({ message: "Product Not Found" });
                if (productDetail) {
                    if (productDetail.stock >= productData.quantity) {
                        productData.user_id = userId.id
                        productData.product_Name = productDetail.productName
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const totalQuantityPurchasedToday = await OrderPlace.sum('quantity', {
                            where: {
                                user_id: userId.id,
                                createdAt: { [Op.gte]: today }
                            }
                        });

                        if (totalQuantityPurchasedToday >= 5) {
                            return res.status(403).json({ error: 'You can only buy a maximum of 5 products in total per day.' });
                        }

                        productData.price = productData.quantity * productDetail.price
                        const quantityLesser = productDetail.stock - productData.quantity
                        await products.update({ stock: quantityLesser }, { where: { id: productData.product_id } })
                        const order = await OrderPlace.create(productData);
                        orderIdTo = order.id
                        const createdInvoice = await invoiceGen(orderIdTo)
                        sendEmail(user as string, createdInvoice as any)
                        console.log(order.id)
                        return res.send({ message: "Order Placed Successfully", order });
                    }
                    else {
                        return res.send({ message: `Choose less Quantity, The available quantity is : ${productDetail.stock}` })
                    }
                }
            }
            if (productQuantity == 'undefined') {
                const productData = req.body;
                const user = req.user;

                // Ensure that productData is an array
                if (!Array.isArray(productData)) {
                    return res.status(400).json({ error: 'Invalid product data format. Expecting an array.' });
                }

                const userId = await UserLogin.findOne({ where: { email: user } });
                if (!userId) return res.send({ message: "User Not Found" });

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const totalQuantityPurchasedToday = await OrderPlace.sum('quantity', {
                    where: {
                        user_id: userId.id,
                        createdAt: { [Op.gte]: today }
                    }
                });

                // Calculate the total quantity of products being purchased
                const totalQuantityBeingPurchased = productData.reduce((total, item) => {
                    if (typeof item.product_id === 'number' && typeof item.quantity === 'number') {
                        return total + item.quantity;
                    }
                    return total;
                }, 0);



                if (totalQuantityPurchasedToday + totalQuantityBeingPurchased > 5) {
                    return res.status(403).json({ error: 'You can only buy a maximum of 5 products in total per day.' });
                }

                // Process each product in the array
                for (const item of productData) {
                    if (typeof item.product_id === 'number' && typeof item.quantity === 'number') {
                        const productDetail = await products.findByPk(item.product_id);
                        if (!productDetail) return res.status(404).json({ message: "Product Not Found" });
                        if (productDetail.stock >= item.quantity) {
                            item.user_id = userId.id;
                            item.product_Name = productDetail.productName;
                            item.price = item.quantity * productDetail.price;
                            const quantityLesser = productDetail.stock - item.quantity;
                            await products.update({ stock: quantityLesser }, { where: { id: item.product_id } });
                            const order = await OrderPlace.create(item);
                            orderIdTo = order.id

                            const createdInvoice = await invoiceGen(orderIdTo)
                            sendEmail(user as string, createdInvoice as any)


                        } else {
                            return res.send({ message: `Choose less Quantity, The available quantity for product ${productDetail.productName} is: ${productDetail.stock}` });
                        }
                    }
                }
                return res.status(201).json({ message: 'Orders placed successfully' });
            }
        } catch (err) {
            console.error(err)
            return res.send({ message: "Server Error", err })
        }

    }
    async updateOrder(req: Request, res: Response) {
        const updatedData = req.body;
        try {
            const existingProduct = await products.findAll();
            if (!existingProduct) return res.status(404).json({ message: "Order not found" });

            await existingProduct[0].update(updatedData);
            return res.status(200).json({ message: "Order updated successfully" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }
    async addToWishlist(req: Request, res: Response) {
        try {
            const { userId, productId } = req.body;
            const user = await UserLogin.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const wishlistData = await Wishlist.create(req.body);
            return res.status(201).json({ message: 'Product added to wishlist' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async csvGenerate(req: Request, res: Response) {
        try {
            const csvData = await OrderPlace.findAll();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Table Data");
            worksheet.columns = [
                { header: "id", key: "id", width: 15 },
                { header: "user_id", key: "user_id", width: 15 },
                { header: "product_id", key: "product_id", width: 15 },
                { header: "product_Name", key: "product_Name", width: 15 },
                { header: "quantity", key: "quantity", width: 15 },
                { header: "price", key: "price", width: 15 }
                // Excel format
            ];

            csvData.forEach((user) => {
                worksheet.addRow(user);
            });
            const excelBuffer = await workbook.xlsx.writeBuffer();
            const excelFileName = "Report.xlsx"; // The name of the downloaded Excel file

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${excelFileName}`);
            res.send(excelBuffer);

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error", error: err });
        }
    }

}

export default new UserShopee();