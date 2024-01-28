const Galacticraft = {
  modid: "galacticraft",
  onInitialize: () => {
    Game.message(String(Ballone.IDList));
  //  Updatable.addUpdatable(Oxygen);
  },
  onTick: () => {
    Rocket.onTick();
    Thermal.onTick();
  },
};

Callback.addCallback("LevelDisplayed", () => {
  Galacticraft.onInitialize();
});

Callback.addCallback("LocalTick", () => {
  //Galacticraft.onTick();
});

Callback.addCallback("EntityInteract", (entity) => {
   Rocket.onInteract(entity);
});


ModAPI.registerAPI("GalacticraftAPI", {
  IPlanet: IPlanet,
  GItem: GItem,
  Storage: Storage,
  CableAPI: CableAPI,
  AirCable: AirCable,
  battery: battery,
  oxygenStorage: oxygenStorage,
  SpacesMachine: SpacesMachine,
  requireGlobal: function (command) {
    return eval(command);
  },
});