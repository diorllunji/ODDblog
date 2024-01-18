const express=require ("express");
const connectToDb=require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");
const cors=require("cors");
require("dotenv").config();


connectToDb();

const app=express();


app.use(express.json());

app.use(cors({
    origin:"http://localhost:3000"
}))

//Routes
app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/users",require("./routes/usersRoute"));
app.use("/api/posts",require("./routes/postsRoute"));
app.use("/api/comments",require("./routes/commentsRoute"));
app.use("/api/categories",require("./routes/categoriesRoute"));
app.use("/api/password",require("./routes/passwordRoute"));

app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT||8000;
app.listen(PORT,()=>console.log("Server is running"));