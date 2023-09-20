import { Sequelize } from "sequelize";


const sequelize = new Sequelize(
    'shoping',
    'root',
    'rootpass',{
        host:'localhost',
        dialect:'mysql'
    }
)

sequelize.authenticate().then(()=>{
    console.log("Connection established successfully")
}).catch((error)=>{
    console.log("Connection Error",error)
})

export default sequelize;