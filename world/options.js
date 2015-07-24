define('world/options', ['underscore','util/dice',], function(_, dice) {
    var d = dice.d;
    var dd = dice.dd;

    var ns = {};

    ns.Passengers = {
        '0': { Value: 0, Low: function() { return 0; }, Mid: function() { return 0; }, High: function() { return 0; } },
        '1': { Value: 1, Low: function() { return d(2, 6) - 6; }, Mid: function() { return d(1,6) - 2; }, High: function() { return 0; } },
        '2': { Value: 2, Low: function() { return d(2, 6); }, Mid: function() { return d(1, 6); }, High: function() { return d(1, 6) - d(1, 6); } },
        '3': { Value: 3, Low: function() { return d(2, 6); }, Mid: function() { return d(2, 6) - d(1, 6); }, High: function() { return d(2, 6) - d(2, 6); } },
        '4': { Value: 4, Low: function() { return d(3, 6) - d(1, 6); }, Mid: function() { return d(2, 6) - d(1, 6); }, High: function() { return d(2, 6) - d(1, 6); } },
        '5': { Value: 5, Low: function() { return d(3, 6) - d(1, 6); }, Mid: function() { return d(3, 6) - d(2, 6); }, High: function() { return d(2, 6) - d(1, 6); } },
        '6': { Value: 6, Low: function() { return d(3, 6); }, Mid: function() { return d(3, 6) - d(2, 6); }, High: function() { return d(3, 6) - d(2, 6); } },
        '7': { Value: 7, Low: function() { return d(3, 6); }, Mid: function() { return d(3, 6) - d(1, 6); }, High: function() { return d(3, 6) - d(2, 6); } },
        '8': { Value: 8, Low: function() { return d(4, 6); }, Mid: function() { return d(3, 6) - d(1, 6); }, High: function() { return d(3, 6) - d(1, 6); } },
        '9': { Value: 9, Low: function() { return d(4, 6); }, Mid: function() { return d(3, 6); }, High: function() { return d(3, 6) - d(1, 6); } },
        '10': { Value: 10, Low: function() { return d(5, 6); }, Mid: function() { return d(3, 6); }, High: function() { return d(3, 6) - d(1, 6); } },
        '11': { Value: 11, Low: function() { return d(5, 6); }, Mid: function() { return d(4, 6); }, High: function() { return d(3, 6); } },
        '12': { Value: 12, Low: function() { return d(6, 6); }, Mid: function() { return d(4, 6); }, High: function() { return d(3, 6); } },
        '13': { Value: 13, Low: function() { return d(6, 6); }, Mid: function() { return d(4, 6); }, High: function() { return d(4, 6); } },
        '14': { Value: 14, Low: function() { return d(7, 6); }, Mid: function() { return d(5, 6); }, High: function() { return d(4, 6); } },
        '15': { Value: 15, Low: function() { return d(8, 6); }, Mid: function() { return d(5, 6); }, High: function() { return d(4, 6); } },
        '16': { Value: 16, Low: function() { return d(9, 6); }, Mid: function() { return d(6, 6); }, High: function() { return d(5, 6); } },
    };

    ns.Freight = {
        '0': { Value: 0, Incidental: function() { return 0; }, Minor: function() { return 0; }, Major: function() { return 0; } },
        '1': { Value: 1, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) - 4; }, Major: function() { return d(1, 6) - 4; } },
        '2': { Value: 2, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) - 1; }, Major: function() { return d(1, 6) - 2; } },
        '3': { Value: 3, Incidental: function() { return 0; }, Minor: function() { return d(1, 6); }, Major: function() { return d(1, 6) - 1; } },
        '4': { Value: 4, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 1; }, Major: function() { return d(1, 6); } },
        '5': { Value: 5, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 2; }, Major: function() { return d(1, 6) + 1; } },
        '6': { Value: 6, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 3; }, Major: function() { return d(1, 6) + 2; } },
        '7': { Value: 7, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 4; }, Major: function() { return d(1, 6) + 3; } },
        '8': { Value: 8, Incidental: function() { return 0; }, Minor: function() { return d(1, 6) + 5; }, Major: function() { return d(1, 6) + 4; } },
        '9': { Value: 9, Incidental: function() { return d(1, 6) - 2; }, Minor: function() { return d(1, 6) + 5; }, Major: function() { return d(1, 6) + 5; } },
        '10': { Value: 10, Incidental: function() { return d(1, 6); }, Minor: function() { return d(1, 6) + 7; }, Major: function() { return d(1, 6) + 6; } },
        '11': { Value: 11, Incidental: function() { return d(1, 6) + 1; }, Minor: function() { return d(1, 6) + 8; }, Major: function() { return d(1, 6) + 7; } },
        '12': { Value: 12, Incidental: function() { return d(1, 6) + 2; }, Minor: function() { return d(1, 6) + 9; }, Major: function() { return d(1, 6) + 8; } },
        '13': { Value: 13, Incidental: function() { return d(1, 6) + 3; }, Minor: function() { return d(1, 6) + 10; }, Major: function() { return d(1, 6) + 9; } },
        '14': { Value: 14, Incidental: function() { return d(1, 6) + 4; }, Minor: function() { return d(1, 6) + 12; }, Major: function() { return d(1, 6) + 10; } },
        '15': { Value: 15, Incidental: function() { return d(1, 6) + 5; }, Minor: function() { return d(1, 6) + 14; }, Major: function() { return d(1, 6) + 11; } },
        '16': { Value: 16, Incidental: function() { return d(1, 6) + 6; }, Minor: function() { return d(1, 6) + 16; }, Major: function() { return d(1, 6) + 12; } },
    };

    ns.TradeModifier = {
        '-1': { Value: -1, PurchaseMod: 4, SaleMod: .25 },
        '0': { Value: 0, PurchaseMod: 3, SaleMod: .45 },
        '1': { Value: 1, PurchaseMod: 2, SaleMod: .5 },
        '2': { Value: 2, PurchaseMod: 1.75, SaleMod: .55 },
        '3': { Value: 3, PurchaseMod: 1.5, SaleMod: .6 },
        '4': { Value: 4, PurchaseMod: 1.35, SaleMod: .65 },
        '5': { Value: 5, PurchaseMod: 1.25, SaleMod: .75 },
        '6': { Value: 6, PurchaseMod: 1.2, SaleMod: .8 },
        '7': { Value: 7, PurchaseMod: 1.15, SaleMod: .85 },
        '8': { Value: 8, PurchaseMod: 1.1, SaleMod: .9 },
        '9': { Value: 9, PurchaseMod: 1.05, SaleMod: .95 },
        '10': { Value: 10, PurchaseMod: 1, SaleMod: 1 },
        '11': { Value: 11, PurchaseMod: .95, SaleMod: 1.05 },
        '12': { Value: 12, PurchaseMod: .9, SaleMod: 1.1 },
        '13': { Value: 13, PurchaseMod: .85, SaleMod: 1.15 },
        '14': { Value: 14, PurchaseMod: .8, SaleMod: 1.2 },
        '15': { Value: 15, PurchaseMod: .75, SaleMod: 1.25 },
        '16': { Value: 16, PurchaseMod: .7, SaleMod: 1.35 },
        '17': { Value: 17, PurchaseMod: .65, SaleMod: 1.5 },
        '18': { Value: 18, PurchaseMod: .55, SaleMod: 1.75 },
        '19': { Value: 19, PurchaseMod: .5, SaleMod: 2 },
        '20': { Value: 20, PurchaseMod: .4, SaleMod: 3 },
        '21': { Value: 21, PurchaseMod: .25, SaleMod: 4 },
    };

    ns.Bases = {
        N: { Name: 'Naval', Label: 'N', DisplayCharacter: String.fromCharCode(0x2605) },
        S: { Name: 'Scout', Label: 'S', DisplayCharacter: String.fromCharCode(0x25B2) },
        R: { Name: 'Research', Label: 'R', DisplayCharacter: String.fromCharCode(0x03C0) },
        T: { Name: 'TAS', Label: 'T', DisplayCharacter: String.fromCharCode(0x263c) },
        I: { Name: 'Imperial Consolate', Label: 'I', DisplayCharacter: String.fromCharCode(0x25A0) },
        P: { Name: 'Pirate', Label: 'P', DisplayCharacter: String.fromCharCode(0x2620) },
    };

    ns.Starbase = {
        'A': { Label: 'A', Class: 'A', Quality: 'Excellent', BerthingCost: '1d6*1000', Fuel: 'Refined', Facilities: 'Shipyard (all) Repair' },
        'B': { Label: 'B', Class: 'B', Quality: 'Good', BerthingCost: '1d6*500', Fuel: 'Refined', Facilities: 'Shipyard (spacecraft) Repair' },
        'C': { Label: 'C', Class: 'C', Quality: 'Routine', BerthingCost: '1d6*100', Fuel: 'Unrefined', Facilities: 'Shipyard (small craft) Repair' },
        'D': { Label: 'D', Class: 'D', Quality: 'Poor', BerthingCost: '1d6*10', Fuel: 'Unrefined', Facilities: 'Limited Repair' },
        'E': { Label: 'E', Class: 'E', Quality: 'Frontier', BerthingCost: '0', Fuel: 'None', Facilities: 'None' },
        'X': { Label: 'X', Class: 'X', Quality: 'No Starbase', BerthingCost: '0', Fuel: 'None', Facilities: 'None' }
    };

    ns.Size = {
        '0': { Value: 0, Label: '0', WorldSize: 800, SurfaceGravity: 0 },
        '1': { Value: 1, Label: '1', WorldSize: 1600, SurfaceGravity: .05 },
        '2': { Value: 2, Label: '2', WorldSize: 3200, SurfaceGravity: .15 },
        '3': { Value: 3, Label: '3', WorldSize: 4800, SurfaceGravity: .25 },
        '4': { Value: 4, Label: '4', WorldSize: 6400, SurfaceGravity: .35 },
        '5': { Value: 5, Label: '5', WorldSize: 8000, SurfaceGravity: .45 },
        '6': { Value: 6, Label: '6', WorldSize: 9600, SurfaceGravity: .7 },
        '7': { Value: 7, Label: '7', WorldSize: 11200, SurfaceGravity: .9 },
        '8': { Value: 8, Label: '8', WorldSize: 12800, SurfaceGravity: 1 },
        '9': { Value: 9, Label: '9', WorldSize: 14400, SurfaceGravity: 1.25 },
        'A': { Value: 10, Label: 'A', WorldSize: 16000, SurfaceGravity: 1.4 }
    }

    ns.SurvivalGear = {
        VaccSuit: { Name: 'Vacc Suit' },
        Respirator: { Name: 'Respirator' },
        Filter: { Name: 'Filter' },
        AirSupply: { Name: 'Air Supply' }
    };

    ns.Atmosphere = {
        '0': { Value: 0, Label: '0', Name: 'None', Preassure: '0', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        '1': { Value: 1, Label: '1', Name: 'Trace', Preassure: '0.001 to 0.09', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        '2': { Value: 2, Label: '2', Name: 'Very Thin, Tainted', Preassure: '0.1 to 0.42', SurvivalGear: [ ns.SurvivalGear.Respirator, ns.SurvivalGear.Filter ] },
        '3': { Value: 3, Label: '3', Name: 'Very Thin', Preassure: '0.1 to 0.42', SurvivalGear: [ ns.SurvivalGear.Respirator ] },
        '4': { Value: 4, Label: '4', Name: 'Thin, Tainted', Preassure: '0.43 to 0.7', SurvivalGear: [ ns.SurvivalGear.Filter ] },
        '5': { Value: 5, Label: '5', Name: 'Thin', Preassure: '0.43 to 0.7', SurvivalGear: [] },
        '6': { Value: 6, Label: '6', Name: 'Standard', Preassure: '0.71 to 1.49', SurvivalGear: [] },
        '7': { Value: 7, Label: '7', Name: 'Standard, Tainted', Preassure: '0.71 to 1.49', SurvivalGear: [ ns.SurvivalGear.Filter ] },
        '8': { Value: 8, Label: '8', Name: 'Dense', Preassure: '1.5 to 2.49', SurvivalGear: [] },
        '9': { Value: 9, Label: '9', Name: 'Dense, Tainted', Preassure: '1.5 to 2.49', SurvivalGear: [ ns.SurvivalGear.Filter ] },
        'A': { Value: 10, Label: 'A', Name: 'Exotic', Preassure: 'Varies', SurvivalGear: [ ns.SurvivalGear.AirSupply ] },
        'B': { Value: 11, Label: 'B', Name: 'Corrosive', Preassure: 'Varies', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        'C': { Value: 12, Label: 'C', Name: 'Insidious', Preassure: 'Varies', SurvivalGear: [ ns.SurvivalGear.VaccSuit ] },
        'D': { Value: 13, Label: 'D', Name: 'Dense, High', Preassure: '2.5+', SurvivalGear: [] },
        'E': { Value: 14, Label: 'E', Name: 'Thin, Low', Preassure: '0.5 or less', SurvivalGear: [] },
        'F': { Value: 15, Label: 'F', Name: 'Unusual', Preassure: 'Varies', SurvivalGear: [] }
    };

    ns.Temperature = {
        'X': { Type: 'Varies', AverageTemperature: 'Varies' },
        'Frozen': { Type: 'Frozen', AverageTemperature: '-51 or less' },
        'Cold': { Type: 'Cold', AverageTemperature: '-51 to 0' },
        'Temperate': { Type: 'Temperate', AverageTemperature: '0 to 30' },
        'Hot': { Type: 'Hot', AverageTemperature: '31 to 80' },
        'Roasting': { Type: 'Roasting', AverageTemperature: '81+' }
    };

    ns.Hydrographic = {
        '0': { Value: 0, Label: '0', Percentage: '0-5' },
        '1': { Value: 1, Label: '1', Precentage: '6-15' },
        '2': { Value: 2, Label: '2', Percentage: '16-25' },
        '3': { Value: 3, Label: '3', Percentage: '26-35' },
        '4': { Value: 4, Label: '4', Precentage: '36-45' },
        '5': { Value: 5, Label: '5', Percentage: '46-55' },
        '6': { Value: 6, Label: '6', Percentage: '56-65' },
        '7': { Value: 7, Label: '7', Percentage: '66-75' },
        '8': { Value: 8, Label: '8', Percentage: '79-85' },
        '9': { Value: 9, Label: '9', Percentage: '86-95' },
        'A': { Value: 10, Label: 'A', Percentage: '96-100' }
    };

    ns.Population = {
        '0': { Value: 0, Label: '0' },
        '1': { Value: 1, Label: '1' },
        '2': { Value: 2, Label: '2' },
        '3': { Value: 3, Label: '3' },
        '4': { Value: 4, Label: '4' },
        '5': { Value: 5, Label: '5' },
        '6': { Value: 6, Label: '6' },
        '7': { Value: 7, Label: '7' },
        '8': { Value: 8, Label: '8' },
        '9': { Value: 9, Label: '9' },
        'A': { Value: 10, Label: 'A' },
        'B': { Value: 11, Label: 'B' },
        'C': { Value: 12, Label: 'C' },
        'D': { Value: 13, Label: 'D' },
        'E': { Value: 14, Label: 'E' },
        'F': { Value: 15, Label: 'F' },
    };

    ns.Government = {
        '0': { Value: 0, Label: '0', Name: 'Anarchy' },
        '1': { Value: 1, Label: '1', Name: 'Company/corporation' },
        '2': { Value: 2, Label: '2', Name: 'Participating democracy' },
        '3': { Value: 3, Label: '3', Name: 'Self-perpetuating oligarchy' },
        '4': { Value: 4, Label: '4', Name: 'Representative democracy' },
        '5': { Value: 5, Label: '5', Name: 'Feudal technocracy' },
        '6': { Value: 6, Label: '6', Name: 'Captive government' },
        '7': { Value: 7, Label: '7', Name: 'Balkanisation' },
        '8': { Value: 8, Label: '8', Name: 'Civil service bureaucracy' },
        '9': { Value: 9, Label: '9', Name: 'Impersonal bureaucracy' },
        'A': { Value: 10, Label: 'A', Name: 'Charismatic dictator' },
        'B': { Value: 11, Label: 'B', Name: 'Non-charismatic dictator' },
        'C': { Value: 12, Label: 'C', Name: 'Charismatic oligarchy' },
        'D': { Value: 13, Label: 'D', Name: 'Religious dictatorship' },
    };

    ns.Law = {
        '0': { Value: 0, Label: '0' },
        '1': { Value: 1, Label: '1' },
        '2': { Value: 2, Label: '2' },
        '3': { Value: 3, Label: '3' },
        '4': { Value: 4, Label: '4' },
        '5': { Value: 5, Label: '5' },
        '6': { Value: 6, Label: '6' },
        '7': { Value: 7, Label: '7' },
        '8': { Value: 8, Label: '8' },
        '9': { Value: 9, Label: '9' },
    };

    ns.TechLevel = {
        '0': { Value: 0, Label: '0', Type: 'Primitive' },
        '1': { Value: 1, Label: '1', Type: 'Primitive' },
        '2': { Value: 2, Label: '2', Type: 'Primitive' },
        '3': { Value: 3, Label: '3', Type: 'Primitive' },
        '4': { Value: 4, Label: '4', Type: 'Industrial' },
        '5': { Value: 5, Label: '5', Type: 'Industrial' },
        '6': { Value: 6, Label: '6', Type: 'Industrial' },
        '7': { Value: 7, Label: '7', Type: 'Pre-Stellar' },
        '8': { Value: 8, Label: '8', Type: 'Pre-Stellar' },
        '9': { Value: 9, Label: '9', Type: 'Pre-Stellar' },
        'A': { Value: 10, Label: 'A', Type: 'Early Stellar' },
        'B': { Value: 11, Label: 'B', Type: 'Early Stellar' },
        'C': { Value: 12, Label: 'C', Type: 'Average Stellar' },
        'D': { Value: 13, Label: 'D', Type: 'Average Stellar' },
        'E': { Value: 14, Label: 'E', Type: 'Average Stellar' },
        'F': { Value: 15, Label: 'F', Type: 'High Stellar' },
        'G': { Value: 16, Label: 'G', Type: 'High Stellar' },
        'H': { Value: 17, Label: 'H', Type: 'Advanced Stellar' },
        'I': { Value: 18, Label: 'I', Type: 'Advanced Stellar' },
        'J': { Value: 19, Label: 'J', Type: 'Advanced Stellar' },
        'K': { Value: 20, Label: 'K', Type: 'Advanced Stellar' },
        'L': { Value: 21, Label: 'L', Type: 'Super Tech' },
        'M': { Value: 22, Label: 'M', Type: 'Super Tech' },
        'N': { Value: 23, Label: 'N', Type: 'Super Tech' },
        'O': { Value: 24, Label: 'O', Type: 'Super Tech' },
        'P': { Value: 25, Label: 'P', Type: 'Super Tech' },
        'Q': { Value: 26, Label: 'Q', Type: 'Super Tech' },
        'R': { Value: 27, Label: 'R', Type: 'Super Tech' },
        'S': { Value: 28, Label: 'S', Type: 'Super Tech' },
        'T': { Value: 29, Label: 'T', Type: 'Super Tech' },
        'U': { Value: 30, Label: 'U', Type: 'Super Tech' },
        'V': { Value: 31, Label: 'V', Type: 'Super Tech' },
    };

    ns.TradeGoods = {
        '11': {
            Label: '11',
            Type: 'Basic Electronics',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '12': {
            Label: '12',
            Type: 'Basic Machine Parts',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '13': {
            Label: '13',
            Type: 'Basic Manufactured Goods',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '14': {
            Label: '14',
            Type: 'Basic Raw Materias',
            LotMultiplier: 10,
            BasePrice: 5000,
            BlackMarket: false
        },
        '15': {
            Label: '15',
            Type: 'Basic Consumables',
            LotMultiplier: 10,
            BasePrice: 2000,
            BlackMarket: false
        },
        '16': {
            Label: '16',
            Type: 'Basic Ore',
            LotMultiplier: 10,
            BasePrice: 1000,
            BlackMarket: false
        },
        '21': {
            Label: '21',
            Type: 'Advanced Electronics',
            LotMultiplier: 5,
            BasePrice: 100000,
            BlackMarket: false
        },
        '22': {
            Label: '22',
            Type: 'Advanced Machine Parts',
            LotMultiplier: 5,
            BasePrice: 75000,
            BlackMarket: false
        },
        '23': {
            Label: '23',
            Type: 'Advanced Manufactured Goods',
            LotMultiplier: 5,
            BasePrice: 100000,
            BlackMarket: false
        },
        '24': {
            Label: '24',
            Type: 'Advanced Weapons',
            LotMultiplier: 5,
            BasePrice: 150000,
            BlackMarket: false
        },
        '25': {
            Label: '25',
            Type: 'Advanced Vehicles',
            LotMultiplier: 5,
            BasePrice: 180000,
            BlackMarket: false
        },
        '26': {
            Label: '26',
            Type: 'Biochemicals',
            LotMultiplier: 5,
            BasePrice: 50000,
            BlackMarket: false
        },
        '31': {
            Label: '31',
            Type: 'Crystals and Gems',
            LotMultiplier: 5,
            BasePrice: 20000,
            BlackMarket: false
        },
        '32': {
            Label: '32',
            Type: 'Cybernetics',
            LotMultiplier: 1,
            BasePrice: 250000,
            BlackMarket: false
        },
        '33': {
            Label: '33',
            Type: 'Live Animals',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '34': {
            Label: '34',
            Type: 'Luxury Consumables',
            LotMultiplier: 10,
            BasePrice: 20000,
            BlackMarket: false
        },
        '35': {
            Label: '35',
            Type: 'Luxury Goods',
            LotMultiplier: 1,
            BasePrice: 200000,
            BlackMarket: false
        },
        '36': {
            Label: '36',
            Type: 'Medical Supplies',
            LotMultiplier: 5,
            BasePrice: 50000,
            BlackMarket: false
        },
        '41': {
            Label: '41',
            Type: 'Petrochemicals',
            LotMultiplier: 10,
            BasePrice: 10000,
            BlackMarket: false
        },
        '42': {
            Label: '42',
            Type: 'Pharmaceuticals',
            LotMultiplier: 1,
            BasePrice: 100000,
            BlackMarket: false
        },
        '43': {
            Label: '43',
            Type: 'Polymers',
            LotMultiplier: 10,
            BasePrice: 7000,
            BlackMarket: false
        },
        '44': {
            Label: '44',
            Type: 'Precious Metals',
            LotMultiplier: 1,
            BasePrice: 50000,
            BlackMarket: false
        },
        '45': {
            Label: '45',
            Type: 'Radioactives',
            LotMultiplier: 1,
            BasePrice: 1000000,
            BlackMarket: false
        },
        '46': {
            Label: '46',
            Type: 'Robots',
            LotMultiplier: 5,
            BasePrice: 400000,
            BlackMarket: false
        },
        '51': {
            Label: '51',
            Type: 'Spices',
            LotMultiplier: 5,
            BasePrice: 6000,
            BlackMarket: false
        },
        '52': {
            Label: '52',
            Type: 'Textiles',
            LotMultiplier: 10,
            BasePrice: 3000,
            BlackMarket: false
        },
        '53': {
            Label: '53',
            Type: 'Uncommon Ore',
            LotMultiplier: 10,
            BasePrice: 5000,
            BlackMarket: false
        },
        '54': {
            Label: '54',
            Type: 'Uncommon Raw Materials',
            LotMultiplier: 10,
            BasePrice: 20000,
            BlackMarket: false
        },
        '55': {
            Label: '55',
            Type: 'Wood',
            LotMultiplier: 10,
            BasePrice: 1000,
            BlackMarket: false
        },
        '56': {
            Label: '56',
            Type: 'Vehicles',
            LotMultiplier: 10,
            BasePrice: 15000,
            BlackMarket: false
        },
        '61': {
            Label: '61',
            Type: 'Illegal Biochemicals',
            LotMultiplier: 5,
            BasePrice: 50000,
            BlackMarket: true
        },
        '62': {
            Label: '62',
            Type: 'Illegal Cybernetics',
            LotMultiplier: 1,
            BasePrice: 25000,
            BlackMarket: true
        },
        '63': {
            Label: '63',
            Type: 'Illegal Drugs',
            LotMultiplier: 1,
            BasePrice: 100000,
            BlackMarket: true
        },
        '64': {
            Label: '64',
            Type: 'Illegal Luxuries',
            LotMultiplier: 1,
            BasePrice: 50000,
            BlackMarket: true
        },
        '65': {
            Label: '65',
            Type: 'Illegal Weapons',
            LotMultiplier: 5,
            BasePrice: 150000,
            BlackMarket: true
        },
        '66': {
            Label: '66',
            Type: 'Exotics',
            LotMultiplier: 1,
            BasePrice: 0,
            BlackMarket: true
        }
    };

    ns.CommonTradeGoods = {
        '11': ns.TradeGoods['11'],
        '12': ns.TradeGoods['12'],
        '13': ns.TradeGoods['13'],
        '14': ns.TradeGoods['14'],
        '15': ns.TradeGoods['15'],
        '16': ns.TradeGoods['16'],
    };

    var tradeGoodMapper = function(val) {
        return ns.TradeGoods[val];
    };

    ns.TravelCodes = {
       'A': {
           Label: 'A',
           PassengerCurrentWorldModifier: 2,
           PassengerDestinationWorldModifier: -2,
           FreightCurrentWorldModifier: 5,
           FreightDestinationWorldModifier: -5,
           TradeGoodPurchaseModifiers: {},
           TradeGoodSaleModifiers: { '24': 2, '62': 6, '65': 8 }
        },
       'R': {
           Label: 'R',
           PassengerCurrentWorldModifier: 4,
           PassengerDestinationWorldModifier: -4,
           FreightCurrentWorldModifier: -5,
           FreightDestinationWorldModifier: null,
           TradeGoodPurchaseModifiers: {},
           TradeGoodSaleModifiers: { '24': 4, '62': 6, '65': 10 }
        },
       'G': {
           Label: ' ',
           PassengerCurrentWorldModifier: 0,
           PassengerDestinationWorldModifier: 0,
           FreightCurrentWorldModifier: 0,
           FreightDestinationWorldModifier: 0,
           TradeGoodPurchaseModifiers: {},
           TradeGoodSaleModifiers: {}
        }
    };

    ns.TradeCodes = {
        'Ag': {
            Label: 'Ag',
            Name: 'Agricultural',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 1,
            TradeGoods: _.map(['26', '33', '34', '52', '54', '55', '61', '64'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '15': 3, '26': 1, '33': 2, '34': 2, '52': 7, '55': 6, '64': 2 },
            TradeGoodSaleModifiers: { '12': 2, '14': 3, '41': 1, '45': -3, '46': 2 }
        },
        'As': {
            Label: 'As',
            Name: 'Asteroid',
            PassengerCurrentWorldModifier: 1,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 1,
            TradeGoods:  _.map(['31', '42', '44', '45', '53', '63'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '15': -4, '16': 4, '31': 2, '42': 2, '44': 3, '45': 2, '53': 4, '54': 2 },
            TradeGoodSaleModifiers: { '15': 1, '21': 3, '22': 2, '25': 2, '32': 1, '62': 4 }
        },
        'Ba': {
            Label: 'Ba',
            Name: 'Barren',
            PassengerCurrentWorldModifier: -5,
            PassengerDestinationWorldModifier: -5,
            FreightCurrentWorldModifier: null,
            FreightDestinationWorldModifier: -5,
            TradeGoods: null,
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: {}
        },
        'De': {
            Label: 'De',
            Name: 'Desert',
            PassengerCurrentWorldModifier: -1,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods:  _.map(['31', '41', '42', '44', '45', '51', '54', '63'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '31': 1, '41': 2, '44': 1, '51': 2 },
            TradeGoodSaleModifiers: {}
        },
        'Fl': {
            Label: 'Fl',
            Name: 'Fluid Oceans',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods:  _.map(['41', '44'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '15': 1 }
        },
        'Ga': {
            Label: 'Ga',
            Name: 'Garden',
            PassengerCurrentWorldModifier: 2,
            PassengerDestinationWorldModifier: 2,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 1,
            TradeGoods: _.map(['33', '34', '51', '55', '64'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '14': 2, '15': 1 },
            TradeGoodSaleModifiers: {}
        },
        'Hi': {
            Label: 'Hi',
            Name: 'High Population',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 4,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['35', '36', '42', '63'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '42': 1 },
            TradeGoodSaleModifiers: { '13': 2, '15': 1, '23': 1, '34': 2, '51': 2, '52': 3, '56': 1, '63': 6, '64': 4 }
        },
        'Ht': {
            Label: 'Ht',
            Name: 'High Technology',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 0,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['21', '22', '23', '24', '25', '32', '36', '46', '56', '62', '65'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '11': 3, '21': 3, '22': 1, '24': 2, '25': 2, '36': 2, '56': 1, '65': 2 },
            TradeGoodSaleModifiers: { '44': 1, '45': 1, '46': 1, '54': 1 }
        },
        'Ic': {
            Label: 'Ic',
            Name: 'Ice-Capped',
            PassengerCurrentWorldModifier: 1,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['31', '41', '44', '53'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '31': 1, '44': 2 },
            TradeGoodSaleModifiers: { '15': 1, '32': 1, '62': 4 }
        },
        'In': {
            Label: 'In',
            Name: 'Industrial',
            PassengerCurrentWorldModifier: 2,
            PassengerDestinationWorldModifier: 1,
            FreightCurrentWorldModifier: 3,
            FreightDestinationWorldModifier: 2,
            TradeGoods: _.map(['21', '22', '23', '24', '25', '43', '46', '56', '65'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '11': 2, '12': 5, '13': 5, '21': 2, '22': 2, '23': 1, '56': 2 },
            TradeGoodSaleModifiers: { '14': 2, '16': 3, '26': 2, '31': 3, '26': 2, '41': 2, '44': 2, '45': 3, '53': 3, '54': 2, '55': 1, '61': 6 }
        },
        'Lo': {
            Label: 'Lo',
            Name: 'Low Population',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: -4,
            FreightCurrentWorldModifier: -5,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['45'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '45': -4 },
            TradeGoodSaleModifiers: { '33': 3 }
        },
        'Lt': {
            Label: 'Lt',
            Name: 'Low Technology',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 0,
            FreightDestinationWorldModifier: 0,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '11': 1, '41': 2, '42': 1 }
        },
        'Na': {
            Label: 'Na',
            Name: 'Non-Agricultural',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 1,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: { '12': 2, '13': 2 },
            TradeGoodSaleModifiers: { '52': 2 }
        },
        'Ni': {
            Label: 'Ni',
            Name: 'Non-Industrial',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 1,
            TradeGoods: _.map(['52'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '11': 2, '12': 3, '13': 3, '16': 1, '21': 1, '22': 1, '43': 1, '45': -2, '53': 1, '56': 2 }
        },
        'Po': {
            Label: 'Po',
            Name: 'Poor',
            PassengerCurrentWorldModifier: -2,
            PassengerDestinationWorldModifier: -1,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: -3,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: { '11': 1, '14': 2, '24': 1, '36': 1, '51': 3, '65': 6 }
        },
        'Ri': {
            Label: 'Ri',
            Name: 'Rich',
            PassengerCurrentWorldModifier: -1,
            PassengerDestinationWorldModifier: 2,
            FreightCurrentWorldModifier: 2,
            FreightDestinationWorldModifier: 2,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: { '11': 1 },
            TradeGoodSaleModifiers: { '21': 2, '23': 2, '25': 2, '31': 2, '32': 2, '34': 2, '35': 4, '36': 1, '42': 2, '43': 2, '44': 3, '51': 3, '55': 2, '62': 8, '63': 6, '64': 6 }
        },
        'Va': {
            Label: 'Va',
            Name: 'Vacuum',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: 0,
            FreightDestinationWorldModifier: 0,
            TradeGoods: [],
            TradeGoodPurchaseModifiers: {},
            TradeGoodSaleModifiers: {}
        },
        'Wa': {
            Label: 'Wa',
            Name: 'Water World',
            PassengerCurrentWorldModifier: 0,
            PassengerDestinationWorldModifier: 0,
            FreightCurrentWorldModifier: -3,
            FreightDestinationWorldModifier: 0,
            TradeGoods: _.map(['26', '34', '41', '42', '51', '54', '61', '63', '64'], tradeGoodMapper),
            TradeGoodPurchaseModifiers: { '15': 2, '26': 2, '34': 1, '54': 1, '61': 2, '64': 1 },
            TradeGoodSaleModifiers: {}
        }
    };

    ns.FactionStrength = {
        'Obscure': { Strength: 'Obscure Group' },
        'Fringe': { Strength: 'Fringe Group' },
        'Minor': { Strength: 'Minor Group' },
        'Notable': { Strength: 'Notable Group' },
        'Significant': { Strength: 'Significant' },
        'Overwhelming': { Strength: 'Overwhelming popular support' }
    };

    return ns;
});
