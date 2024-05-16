import express from 'express';
import cors from 'cors';
import weather from './api/weather.route.js'
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/weather", weather);
app.get("/test", (req,res) => {
    res.status(200).json({test: "test"});
})
app.listen(5000, () => {
    console.log("Meteo App Listening on 5000");
});

export default app;