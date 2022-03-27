const express = require("express");
const fileUpload = require("express-fileupload");
const methodOverride = require('method-override');
const ejs = require("ejs");
const { default: mongoose } = require("mongoose");
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageController');
const app = express();

/** DB CONNECTION */

mongoose.connect("mongodb+srv://orhan:51i70gbwB1LFHKK6@cluster0.wtl36.mongodb.net/pcat-db?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//  useFindAndModify: false
}).then(() => {
  console.log('DB Connected');
}).catch((err) => {
  console.log(err);
})

// TEMPLATE ENGINE
app.set("view engine", "ejs");
// MIDDLEWARES
const myLogger = (req, res, next) => {
  console.log("Middleware log 1");
  next();
};

//MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method', {
    methods:['POST', 'GET']
}));
app.use(myLogger);

app.get("/", photoController.getAllPhotos);
app.get("/about", pageController.getAboutPage);
app.get("/add", pageController.getAddPage);

app.post("/photos", photoController.createPhoto);

app.get("/photos/:id", photoController.getPhoto);
app.get('/photos/update/:id', pageController.getUpdatePage);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`PCAT is starting on ${port}`);
});
