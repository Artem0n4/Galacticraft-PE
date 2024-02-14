IPlanet.oreGeneration();

//Callback.addCallback("LevelDisplayed", () => {
//  Galacticraft.onInitialize();
//});

Callback.addCallback("LocalTick", () => {
  //Galacticraft.onTick();
  Atmosphere.VWeatherEvent.onTick()
});

//Callback.addCallback("EntityInteract", (entity) => {
 //  Rocket.onInteract(entity);
//});


ModAPI.registerAPI("GalacticraftAPI", {
  Atmosphere: Atmosphere,
  GItem: GItem,
  GBlock: GBlock,
  Storage: Storage,
  CableAPI: CableAPI,
  AirCable: AirCable,
  battery: Battery,
  SpacesMachine: SpacesMachine,
  PLANETS: PLANETS,
  requireGlobal: function (command) {
    return eval(command);
  },
});