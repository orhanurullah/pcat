const Photo = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1;
  const photoPerPage = 2;
  const totalPhotos = await Photo.find().countDocuments();
  const photos = await Photo.find({})
      .sort("-dateCreated")
      .skip((page-1) * photoPerPage)
      .limit(photoPerPage);
  res.render("index", {
    photos:photos,
    current:page,
    totalPage:Math.ceil(totalPhotos / photoPerPage)
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = "public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  let uploadedPhoto = req.files.photo;
  let uploadPath = __dirname + "/../public/uploads/" + uploadedPhoto.name;
  uploadedPhoto.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      photo: "/uploads/" + uploadedPhoto.name,
    });
  });
  res.redirect("/");
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  console.log(photo);
  let deletedImage = __dirname + "/../public" + photo.photo;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
};
