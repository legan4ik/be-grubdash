const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//warning

exports.dishExists = (req, res, next) => {
    const dishId = req.params.dishId;
    const dish = dishes.filter((dish) => dish.id === dishId);
    if (dish.length !== 0){
        res.locals.dishId = dishId[0];
        next();
    } else {
        next({status: 404, message: `Dish does not exist: ${dishId}`});
    }
};

exports.validate = (req, res, next) => {
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

exports.create = (req, res, next) => {
    if (!req.body || !req.body.data) {
        next({status: 403, message: `No data or body`});
    }
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

exports.read = (req, res, next) => {
    //console.log(dish);
    res.send({data: res.locals.dishId})
};

exports.update = (req, res, next) => {
    const dishId = req.params.dishId;
    //console.log(`dishId: ${dishId}, req.body.data.id: ${req.body.data.id}`)
    //console.log(`${req.body.data.id !== dishId}`)
    if (!dishId) {
        next({status: 400});
    } else if (req.body.data.id && req.body.data.id !== dishId) {
        next({status: 400, message: `Not found id ${req.body.data.id}`});
    } else {
    const dish = res.locals.dishId;
    dish['name'] = req.body.data.name;
    dish['description'] = req.body.data.description;
    dish['price'] = req.body.data.price;
    dish['image_url'] = req.body.data.image_url;
    res.send({data: dish});
    next({status: 201, message: dish});
    }
};

exports.list = (req, res, next) => {
    res.send({data: dishes});
};
