    import express from "express";
    import passport from "passport";
    import route from "./router/superAdminRouter";
    import route1 from "./router/productsRouter";
    import route2 from "./router/userRouter";
    import route3 from "./router/userShoping"
    import sequelize from "./config/db";
    import session from 'express-session';
    import dotenv from "dotenv";
    dotenv.config();


    const app = express();
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
        session({
            secret: 'samsub',
            resave: false,
            saveUninitialized: true,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use("/api", route);
    app.use("/api", route1);
    app.use("/", route2);
    app.use("/api",route3);




    sequelize.sync();


    const PORT = process.env.PORT || 1234;
    app.listen(PORT, () => {
        console.log(`Server is Running on ${PORT}`)
    })