var cmd = [];
function commandRegistry(
  description: string,
  action: () => void,
  msg?: string
) {
  cmd.push({ description: description, action: action, msg: msg });
}


commandRegistry("weather venus rain", () => {
  if(Player.getDimension()==2008){
  timer_weather_start = 15;
  Game.message(Translation.translate("Weather changed succesfully"));}else{
    Game.message(Translation.translate("Sorry,but you must be in Venus,for changed weather to rain"))
  }
});

commandRegistry("weather venus clear", () => {
  weather_rain = false;
  timer_weather = 0;
  timer_weather_start = 0;
  Game.message(Translation.translate("Weather changed succesfully"));
});

commandRegistry("get debug values", () => {
  Game.message(
    "Weather rules: \n§7● venus rain: " +
      weather_rule.rain +
      "\n● lightning bolt: " +
      weather_rule.lightning_bolt +
      "\n● meteorite fall: " +
      weather_rule.meteorite_fall
  );
});

commandRegistry("help", () => {
  for (var i in cmd) {
    Game.message("/gc:" + cmd[i].description + "\n");
  }
});


Callback.addCallback("NativeCommand", (command) => {
  for (var i in cmd) {
    if (command == "/gc:" + cmd[i].description) {
      Game.prevent();
      cmd[i].action();
      if (cmd[i].msg != undefined) {
        Game.message(Translation.translate(cmd[i].msg));
      }
    }
  }
});