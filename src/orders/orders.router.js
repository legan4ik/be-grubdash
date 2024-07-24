const router = require("express").Router();

const orders_controller = require("./orders.controller");

function methodNotAllowed (req, res, next) {
    next({status: 405, message: "Not implemented"});
};

router.route("/").get(orders_controller.list)
                 .post(orders_controller.validate, orders_controller.create)
                 .all(methodNotAllowed);
router.route("/:orderId").get(orders_controller.orderExists, orders_controller.read)
                         .put(orders_controller.orderExists, orders_controller.validate, orders_controller.update)
                         .delete(orders_controller.orderExists, orders_controller.delete)
                         .all(methodNotAllowed);

module.exports = router;
