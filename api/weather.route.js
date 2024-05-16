import express from 'express'
import WeatherCtrl from "./weather.controller.js";

const router = express.Router();

router.route("/test").get((req, res) => 
    res.status(200).json({status: "test"}));
router.route("/7days").get(WeatherCtrl.apiGetWeekWeather);


export default router;