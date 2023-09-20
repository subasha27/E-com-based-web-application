import nodemailer from "nodemailer";
import OrderPlace from "../model/userShopingModel";


const invoiceGen = async (orderId: number) => {

    const orders = await OrderPlace.findAll({ where: { id: orderId } });

    const totalAmount = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);

    const invoiceNumber = orderId;

    const invoice = {
        invoiceNumber,
        totalAmount,
        orders,
    };
    return invoice
}



const sendEmail = async (mail: string, invoice:any) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            
            user: process.env.user,
            pass: process.env.pass
        },
    });
    
    await transporter.sendMail({
        from: process.env.user,
        to: mail,
        subject: "Purchase Order",
        html: `<pre>${JSON.stringify(invoice, null, 2)}</pre>`
    });
    console.log("email sent sucessfully");

}



export {invoiceGen,sendEmail};