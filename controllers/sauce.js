const Product = require("../models/product");

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
      res.status(201).json({ message: "produit enregistré !" });
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
