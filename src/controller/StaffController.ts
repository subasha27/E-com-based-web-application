import StaffMembers from "../model/staffModel";
import { Request, Response } from "express";
import * as     bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import EmailService from "../helpers/SendEmail";
import dotenv from "dotenv";
dotenv.config();


class Staff {


    async staffCreate(req: Request, res: Response) {
        const staffData = req.body;
        const staffPass = req.body.password
        try {
            const existingStaff = await StaffMembers.findOne({ where: { mail: staffData.mail } });
            if (existingStaff) return res.send({ message: "staff mail Already exists" });
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            staffData.password = hashedPassword
            const staffCreation = await StaffMembers.create(staffData);
            const id = staffCreation.id;
            const subject = "Account Created";
            const text = `New Accounnt Is created \n id : ${id}\npassword : ${staffPass}`
            await EmailService.sendEmail(staffData.mail, subject, text)
            return res.send({ message: "Staff member created Successfully", id })

        } catch (err) {
            console.error(err)
            return res.send({ message: "Server Error", err })
        }
    
    }
    async staffFirstLogin(req: Request, res: Response) {
        const staffData = req.body;
        try {
            const existingStaff = await StaffMembers.findOne({ where: { mail: staffData.mail } });
            if (!existingStaff) return res.send({ message: "Staff does not exists" });
            const comparePass = await bcrypt.compare(staffData.password, existingStaff.password)
            if (comparePass) {
                const hashedPassword = await bcrypt.hash(req.body.newpass, 10)
                const newNamePass = {
                    name:req.body.name,
                    password:hashedPassword
                }
                await existingStaff.update(newNamePass)
                return res.send({ message: "Initial Login Successfull and the password is changed"})
            } else {
                return res.send({ message: "Invalid Password" })
            }
        } catch (err) {
            console.error(err)
            return res.send({ message: "Server Error", err })
        }
    }
    async staffLogin(req: Request, res: Response) {
        const staffData = req.body;
        try {
            const existingStaff = await StaffMembers.findOne({ where: { mail: staffData.mail } });
            if (!existingStaff) return res.send({ message: "Staff does not exists" });
            const comparePass = await bcrypt.compare(staffData.password, existingStaff.password)
            if (comparePass) {
                const token = jwt.sign(staffData.mail, process.env.Secret as string);
                return res.send({ message: "Login Successfull", token })
            } else {
                return res.send({ message: "Invalid Password" })
            }
        } catch (err) {
            console.error(err)
            return res.send({ message: "Server Error", err })
        }
    }
}

export default new Staff();