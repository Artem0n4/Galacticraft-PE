var cmd = [];
function commandRegistry(description: string, action: () => void,msg?: string) {
  cmd.push({ description: description, action: action,msg: msg });
}

commandRegistry("weather venus rain",()=>{
  if(weather_rain==true){
    Game.message(Translation.translate("Sorry,but you can't use this command in the rain"))
  };
  if(Player.getDimension()==Venus.id&&weather_rain==false){
    Game.message(Translation.translate("Weather changed succesfully"))
    weather_rain = true;
  }
   if(Player.getDimension()!=Venus.id){
    Game.message(Translation.translate("Sorry,but you must be in Venus,for changed weather to rain"))
  }
 
})

commandRegistry("weather venus clear",()=>{
  weather_rain=false;
  timer_weather=0;
  timer_weather_start=0;
  Game.message(Translation.translate("Weather changed succesfully"))
})

Callback.addCallback("NativeCommand", (command) => {
  for (var i in cmd) {
    if (command == "/gc:" + cmd[i].description) {
        Game.prevent();
      cmd[i].action();
      if(cmd[i].msg!=undefined){
        Game.message(Translation.translate(cmd[i].msg))
    }
    }
   
  }
});
