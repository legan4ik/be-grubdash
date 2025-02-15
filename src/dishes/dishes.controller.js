const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

exports.dishExists = (req, res, next) => {
    const dishId = req.params.dishId;
    if (!dishId) {
        next({status: 400});
    }
    const dish = dishes.filter((dish) => dish.id === dishId);
    if (dish.length !== 0){
        res.locals.dish = dish[0];
        next();
    } else {
        next({status: 404, message: `Dish does not exist: ${dishId}`});
    }
};

exports.validate = (req, res, next) => {
    if (!req.body || !req.body.data) {
        next({status: 400, message: 'No data or body'});
    }
    if (!req.body.data.name) {
        next({status: 400, message: "name"});
    }
    if (!req.body.data.description) {
        next({status: 400, message: "description"});
    }
    if (!req.body.data.image_url) {
        next({status: 400, message: "image_url"});
    }
    if (!req.body.data.price || req.body.data.price <= 0 || typeof req.body.data.price !== 'number') {
        next({status: 400, message: "price"});
    }
    next();
};

exports.create = (req, res) => {
    const dish = {
        id: nextId(),
        name: req.body.data.name,
        description: req.body.data.description,
        price: req.body.data.price,
        image_url: req.body.data.image_url,
    }
    dishes.push(dish);
    res.status(201).send({data: dish})
};

exports.read = (req, res) => {
    res.send({data: res.locals.dish})
};

exports.update = (req, res, next) => {
    const dishId = req.params.dishId;
    if (req.body.data.id && req.body.data.id !== dishId) {
        next({status: 400, message: `Not found id ${req.body.data.id}`});
    } else {
        const dish = res.locals.dish;
        dish['name'] = req.body.data.name;
        dish['description'] = req.body.data.description;
        dish['price'] = req.body.data.price;
        dish['image_url'] = req.body.data.image_url;
        res.status(200).send({data: dish})
    }
};

exports.list = (req, res) => {
    res.send({data: dishes});
};
