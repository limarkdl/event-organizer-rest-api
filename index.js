import express from "express";

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get("/", (req, res) => {
    res.render('index');
});


app.listen(3000, () => {
        console.log("Server is running on port 3000");
    }
);