const Product = require("../models/product");
const fs = require("fs");
/*const {unlink} = require("fs}")*/

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;

  const { name, manufacturer, description, mainPepper, heat } = sauceObject;

  const product = new Product({
    userId: req.auth.userId,
    name,
    manufacturer,
    description,
    mainPepper,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => res.status(200).json(product))
    .catch((error) => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      if (product.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = product.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Product.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.modifySauce = (req, res) => {
  let sauceObject = {};
  req.file
    ? (Product.findOne({
        _id: req.params.id,
      }).then((product) => {
        const filename = product.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      }),
      (sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }))
    : (sauceObject = {
        ...req.body,
      });
  delete sauceObject.userId;

  Product.findOne({
    _id: req.params.id,
  })
    .then((product) => {
      if (product.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Product.updateOne(
          {
            _id: req.params.id,
          },
          {
            ...sauceObject,
            _id: req.params.id,
          }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getAllSauce = (req, res) => {
  Product.find()
    .then((products) => res.status(200).json(products))
    .catch((error) => res.status(400).json({ error }));
};
