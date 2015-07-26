define('world/modifiers', [], function() {
    var ns = {};

    ns.Starbase = {
        Starbase: -7,
        Population: function(world) {
            return world.Population.Value;
        }
    };

    ns.Size = { Size: -2 };

    ns.Atmosphere = {
        Atmosphere: -7,
        Size: function(world) {
            if(world.Size.Value <= 2)
                return -100;

            return world.Size.Value;
        }
    };

    ns.Temperature = {
        Atmosphere: function(world) {
            switch(world.Atmosphere.Value) {
                case 0:
                case 1:
                    return null;
                case 2:
                case 3:
                    return -2;
                case 4:
                case 5:
                case 14:
                    return -1
                case 6:
                case 7:
                    return 0;
                case 8:
                case 9:
                    return 1;
                case 10:
                case 13:
                case 15:
                    return 2;
                case 11:
                case 12:
                    return 6;
                default:
                    return 0;
            }
        }
    };

    ns.Hydrographic = {
        Hydrographic: -7,
        Size: function(world) {
            var size = world.Size.Value;
            var atmo = world.Atmosphere.Value;
            if(size <= 1)
                return size - 6;
            if(atmo === 10 && size >= 3 && size <= 4)
                return size - 6;
            if(atmo === 2 || atmo === 3 || atmo === 11 || atmo == 12)
                return size - 4;
            return size;
        },
        Atmosphere: function(world) {
            switch(world.Atmosphere.Value) {
                case 0:
                case 1:
                case 10:
                case 11:
                case 12:
                    return -4;
                default:
                    return 0;
            }
        },
        Temperature: function(world) {
            if(world.Atmosphere.Value === 13)
                return 0;
            switch(world.Temperature.Name) {
                case 'Hot':
                    return -2;
                case 'Roasting':
                    return -6;
                default:
                    return 0;
            }
        }
    };

    ns.Population = {
        Population: -2,
        Size: function(world) {
            var size = world.Size.Value;
            if(size <= 2 || size === 10)
                return -1;
            return 0;
        },
        Atmosphere: function(world) {
            var atmo = world.Atmosphere.Value;
            if(atmo === 5 || atmo === 6 || atmo === 8)
                return 1;
            return -1;
        }
    };

    ns.Government = {
        Government: -7,
        Population: function(world) {
            var pop = world.Population.Value;
            if(pop <= 0)
                return -100;
            return world.Population.Value;
        }
    };

    ns.Law = {
        Law: -7,
        Population: function(world) {
            if(world.Population.Value <= 0)
                return -100;
            return 0;
        },
        Government: function(world) {
            return world.Government.Value;
        }
    };

    ns.TechLevel = {
        Starbase: function(world) {
            switch(world.Starbase.Label) {
                case 'A':
                    return 6;
                case 'B':
                    return 4;
                case 'C':
                    return 2;
                case 'X':
                    return -4;
                default:
                    return 0;
            }
        },
        Size: function(world) {
            switch(world.Size.Value) {
                case 0:
                case 1:
                    return 2;
                case 2:
                case 3:
                case 4:
                    return 1;
                default:
                    return 0;
            }
        },
        Atmosphere: function(world) {
            switch(world.Atmosphere.Value) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    return 1;
                default:
                    return 0;
            }
        },
        Hydrographic: function(world) {
            switch(world.Hydrographic.Value) {
                case 0:
                case 9:
                    return 1;
                case 10:
                    return 2;
                default:
                    return 0;
            }
        },
        Population: function(world) {
            switch(world.Population.Value) {
                case 0:
                    return -100;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 9:
                    return 1;
                case 10:
                    return 2;
                case 11:
                    return 3;
                case 12:
                    return 4;
                default:
                    return 0;
            }
        },
        Government: function(world) {
            switch(world.Government.Value) {
                case 0:
                case 5:
                    return 1;
                case 7:
                    return 2;
                case 13:
                case 14:
                    return -2;
                default:
                    return 0;
            }
        }
    };

    ns.Bases = {
        Starbase: 0
    };

    ns.TradeCodes = {
        Size: 0,
        Atmosphere: 0,
        Hydro: 0,
        Population: 0,
        Government: 0,
        Law: 0,
        TechLevel: 0
    };

    ns.TravelCodes = {
        Atmosphere: 0,
        Government: 0,
        Law: 0
    };

    ns.Factions = {
        Population: 0,
        Government: 0
    };

    ns.FactionCount = {
        Government: function(world) {
            var gov = world.Government.Value;
            if(gov === 0 || gov === 7)
                return 1;
            if(gov >= 10)
                return -1;
            return 0;
        }
    };

    return ns;
});
