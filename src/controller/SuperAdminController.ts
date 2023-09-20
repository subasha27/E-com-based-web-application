import SuperAdmins from "../model/SuperAdminModel";
import { Request,Response } from "express";
import * as     bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


class SuperAdminCrud{

    async superAdminCreate(req:Request,res:Response){
        const superAdminData = req.body;
        try{
            const existingAdmin = await SuperAdmins.findOne({where:{mail:superAdminData.mail}});
            if (existingAdmin) return res.send({message:"Admin Already exists"});
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            superAdminData.password = hashedPassword
            const adminCreate = await SuperAdmins.create(superAdminData);
            const id = adminCreate.id;
            return res.send({message:"Super Admin created Successfully",id})

        }catch(err){
            console.error(err)
            return res.send({message:"Server Error",err})
        }
    }
    async superAdminLogin(req:Request,res:Response){
        const superAdminData = req.body;
        try{
            const existingAdmin = await SuperAdmins.findOne({where:{mail:superAdminData.mail}});
            if (!existingAdmin) return res.send({message:"Admin does not exists"});
            const comparePass = await bcrypt.compare(superAdminData.password,existingAdmin.password)
            if (comparePass){
                const token = jwt.sign(superAdminData.mail,process.env.Secret as string);
                return res.send({message:"Login Successfull",token})
            }else{
                return res.send({message:"Invalid Password"})
            }
        }catch(err){
            console.error(err)
            return res.send({message:"Server Error",err})
        }
    }
}

export default new SuperAdminCrud();