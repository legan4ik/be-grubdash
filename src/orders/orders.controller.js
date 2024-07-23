const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass


exports.orderExists = (req, res, next) => {
    const orderId = req.params.orderId;
    const order = orders.filter((order) => order.id === orderId);
    if (order.length !== 0){
        res.locals.order = order[0];
        next();
    } else {
        next({status: 404, message: `Order does not exist: ${orderId}`});
    }
};


function validateDishes(dishes){
    const invalidDishes = dishes.filter((dish) => (!dish.quantity || dish.quantity === 0 || typeof dish.quantity !== 'number'));
    return invalidDishes.length === 0;
}


exports.validate = (req, res, next) => {
    if (!req.body.data.deliverTo) {
        next({status: 400, message: "deliverTo"});
    }
    if (!req.body.data.mobileNumber) {
        next({status: 400, message: "mobileNumber"});
    }
    if (!req.body.data.dishes || req.body.data.dishes.length === 0 || !Array.isArray(req.body.data.dishes)) {
        next({status: 400, message: "dishes"});
    }
    const invalidDishes = req.body.data.dishes.filter((dish) => (!dish.quantity || dish.quantity === 0 || typeof dish.quantity !== 'number'));
    if (invalidDishes.length !== 0){
        next({status: 400, message: JSON.stringify(req.body.data.dishes)});
        //console.log(invalidDishes);
        //if (!invalidDishes[0].quantity){
        //    next({status: 400, message: '1 quantity is missing'});
        //} else {
        //    next({status: 400, message: `quantity ${invalidDishes[0].quantity}`});
        //}
    }

        //if (!req.body.data.quantity || req.body.data.quantity <= 0 || typeof req.body.data.quantity !== 'number') {
        //    next({status: 400, message: "price"});
        //}
    next();
};

exports.create = (req, res, next) => {
    if (!req.body || !req.body.data) {
        next({status: 403, message: `No data or body`});
    }
    const order = {
        id: nextId(),
        deliverTo: req.body.data.deliverTo,
        mobileNumber: req.body.data.mobileNumber,
        status: req.body.data.status,
        dishes: req.body.data.dishes,
    }
    orders.push(order);
    res.status(201).send({data: order})
};

exports.read = (req, res, next) => {
    //console.log(dish);
    res.send({data: res.locals.order})
};

exports.update = (req, res, next) => {
    const orderId = req.params.orderId;
    //console.log(`dishId: ${dishId}, req.body.data.id: ${req.body.data.id}`)
    //console.log(`${req.body.data.id !== dishId}`)
    if (!orderId) {
        next({status: 400});
    } else if (req.body.data.id && req.body.data.id !== orderId) {
        next({status: 400, message: `Not found id ${req.body.data.id}`});
    } else if (!req.body.data.status || req.body.data.status === "invalid") {
        next({status: 400, message: "status"});
    } else {
        const order = orders.filter((order) => order.id === orderId)[0];
        if (order['status'] === "delivered") {
            next({status: 400, message: 'Already delivered'});
        } else {
            order['deliverTo'] = req.body.data.deliverTo;
            order['mobileNumber'] = req.body.data.mobileNumber;
            order['dishes'] = req.body.data.dishes;
            order['status'] = req.body.data.status;
            res.send({data: order});
            next({status: 201, message: order});
        }
    }
};

exports.list = (req, res, next) => {
    res.send({data: orders});
};

exports.delete = (req, res, next) => {
    const order = res.locals.order
    if (order.status !== "pending") {
        next({status: 400, message: `pending: ${order}`});
        //next({status: 400, message: order});
    } else {
        //orders = orders.filter((order) => (order.id !== orderId && order.status !== "pending"));
        //console.log(orders);
        //console.log(order);
        const index = orders.findIndex(obj => obj.id === order.id);
        orders.splice(index, 1);
        //console.log(orders);
        next({status: 204, message: `Deleted`});
    }
};
