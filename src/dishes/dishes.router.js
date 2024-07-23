const router = require("express").Router();
const dishes_controller = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass

function methodNotAllowed (req, res, next) {
    next({status: 405, message: "Not implemented"});
};

router.route("/").get(dishes_controller.list).post(dishes_controller.validate, dishes_controller.create).all(methodNotAllowed);
router.route("/:dishId").get(dishes_controller.dishExists, dishes_controller.read)
                        .put(dishes_controller.dishExists, dishes_controller.validate, dishes_controller.update).all(methodNotAllowed);

module.exports = router;
