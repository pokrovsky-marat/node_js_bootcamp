const express = require("express");
const tourController = require("./../controllers/tourController")

const router = express.Router();

/*router.param('id',(req,res,next,val)=>{
    console.log(`tourRouter line 7, id = ${val}`);
    next();
})*/
router.param('id', tourController.checkId)



router.route("/").get(tourController.getTours).post(tourController.checkBodyTour,tourController.createTour);
router.route('/:id').patch(tourController.updateTour).delete(tourController.deleteTour).get(tourController.getTour);

module.exports = router;