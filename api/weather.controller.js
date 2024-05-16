export default class WeatherController {
    static async apiGetWeekWeather(req, res) {
        try {
            const lat_regexp = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
            const long_regexp = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
            
            var latitude = req.query.latitude;
            var longitude = req.query.longitude; 
            
            if(latitude === undefined || longitude === undefined)
                throw new Error("missing latitude or longitude.");

            if(!long_regexp.test(longitude) || !lat_regexp.test(latitude)) {
                throw new Error ("Wrong latitude or longitude.");
            }
            
            console.log(req.query)
            // validate
            const weather_json = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunshine_duration`)
                .then(res => {
                    if(res.status == 400) {
                        throw new Error("Invalid request from external API (open-meteo)");
                    }
                    return res;
                })
                .then(data => data.json());

            var weekGeneratedEnergy = Array();
            weather_json.daily.sunshine_duration.forEach(sunshineDuration => {
                var dayGeneratedEnergy = parseFloat(((sunshineDuration/3600)*2.5*0.2).toFixed(2));
                weekGeneratedEnergy.push(dayGeneratedEnergy);
            });
            res.status(200).json(
            {
                date : weather_json.daily.time,
                weather_code : weather_json.daily.weather_code,
                max_temp : weather_json.daily.temperature_2m_max,
                min_temp : weather_json.daily.temperature_2m_min,
                generated_energy : weekGeneratedEnergy,
            });
        } catch (error) {
            res.status(400).json({error : error.message});
        }
    }
}