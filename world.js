define('world',
    ['underscore', 'util/dice', 'util/find', 'world/options', 'world/modifiers', 'world/tables', 'world/generators', 'name'],
    function(_, dice, find, options, modifiers, tables, generators, name) {
    var d = dice.d;
    var dd = dice.dd;

    function DefineRequirements() {
        return {
            Simple: ['Starbase', 'Size', 'Temperature', 'Hydrographic', 'Population', 'Government', 'Law', 'TechLevel'],
            Complex: ['Atmosphere', 'Bases', 'TradeCodes', 'TravelCodes', 'GasGiant', 'Factions']
        };
    };
    function getMod(label) {
        return function(val) {
            if(val === undefined)
                return [];
            if(_.isArray(val))
                return _.map(val, function(v) { return v[label] === undefined ? [] : v[label]; });
            return val[label] === undefined ? [] : val[label];
        };
    };
    function calculatePassengerMod(currentWorld, targetWorld) {
        var currentPop = currentWorld.Population.Value;
        var currentMod = _.map(currentWorld, getMod('PassengerCurrentWorldModifier'));
        var targetMod = _.map(targetWorld, getMod('PassengerDestinationWorldModifier'));;

        var allMods = _.flatten([currentPop, currentMod, targetMod]);

        if(_.contains(allMods, null))
            return null;

        return _.reduce(allMods, function(memo, num) { return memo + num; }, 0);
    };
    function calculateFreightMod(currentWorld, targetWorld) {
        var targetPop = targetWorld.Population.Value;
        var currentMod = _.map(currentWorld, getMod('FreightCurrentWorldModifier'));
        var targetMod = _.map(targetWorld, getMod('FreightDestinationWorldModifer'));
        var techDiff = Math.abs(currentWorld.TechLevel.Value - targetWorld.TechLevel.Value);

        if(techDiff > 5)
            techDiff = 5;

        var allMods = _.flatten([targetPop, currentMod, targetMod, -techDiff]);

        if(_.contains(allMods, null))
            return null;

        return _.reduce(allMods, function(memo, num) { return memo + num; }, 0);
    };

    return {
        Generate: function() {
            var ns = {};
            var reqs = DefineRequirements();

            function loadDependencies(mod) {
                if(mod instanceof Object)
                    _.chain(Object.keys(mod))
                        .filter(function(val) { return mod[val] instanceof Function && !ns[val]; })
                        .each(function(val) {
                            if(_.contains(reqs.Simple, val))
                                fetchSimpleValue(val);
                            else if(_.contains(reqs.Complex, val))
                                fetchComplexValue(val);
                        });
            }

            function fetchSimpleValue(field) {
                var opt = options[field];
                var mod = modifiers[field];
                var tab = tables[field];

                if(ns[field] !== undefined && ns[field] !== null)
                    return;

                if(!tab)
                    throw new Exception(field + ' table not found.');

                loadDependencies(mod);

                var modi = _.map(mod, function(func) { return func instanceof Function ? func(ns) : func; });
                var mods = modi;
                var roll = d(2, 6);
                modi = _.some(modi, function(val) { return typeof(val) !== 'number'; })
                    ? _.find(modi, function(val) { return typeof(val) !== 'number'; })
                    : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

                var label = _.find(tab, find(modi));
                ns[field] = opt[label.Item];

                reqs.Simple = _.filter(reqs.Simple, function(val) { return val !== field; });
            }

            function fetchComplexValue(field) {
                var opt = options[field];
                var mod = modifiers[field];
                var tab = tables[field];
                var gen = generators[field];

                if(ns[field] !== undefined && ns[field] !== null)
                    return;

                if(!gen)
                    throw field + ' generator not found.';

                loadDependencies(mod);

                gen(ns, tables, modifiers, options);

                reqs.Complex = _.filter(reqs.Complex, function(val) { return val !== field; });
            }

            while(reqs.Simple.length > 0) {
                var field = reqs.Simple.pop();
                fetchSimpleValue(field);
            }

            while(reqs.Complex.length > 0) {
                var field = reqs.Complex.pop();
                fetchComplexValue(field);
            }

            ns.Name = name.Generate('planet');

            return ns;
        },
        GenerateTradeGoods: function(world, variables) {
            variables = variables || {};
            var brokerPercent = variables.BrokerPercent || 0;
            var blackMarket = variables.BlackMarket || false;
            var brokerSkill = variables.BrokerSkill || 0;
            var characteristicModifier = variables.CharacteristicMod || 0;
            var supplierMod = variables.SupplierMod || 0;

            var availableTradeGoods = _.chain(
                _.union(_.map(options.CommonTradeGoods, function(val) { return val; }), 
                    _.chain(world)
                        .filter(function(val) {
                            return (_.isArray(val) && _.some(val, function(obj) { return _.isObject(obj) && obj.TradeGoods !== undefined; }))
                                || (_.isObject(val) && val.TradeGoods !== undefined);
                        })
                        .map(function(val) {
                            if(_.isArray(val))
                                return _.chain(val)
                                    .filter(function(obj) { return _.isObject(obj) && obj.TradeGoods !== undefined; })
                                    .map(function(obj) { return obj.TradeGoods; })
                                    .value();
                            return val.TradeGoods;
                        })
                        .value()))
                .flatten()
                .uniq()
                .value();

            if(_.some(availableTradeGoods, function(m) { return m === null; }))
                return [];

            if(!blackMarket)
                availableTradeGoods = _.filter(availableTradeGoods, function(tg) { return !tg.BlackMarket; });

            var additionalTradeGoodCount = d(1, 6);

            for(additionalTradeGoodCount; additionalTradeGoodCount > 0; additionalTradeGoodCount --) {
                var opt = undefined;
                var i = 0;
                while(opt === undefined || (opt.BlackMarket && !blackMarket)) {
                    var roll = dd(2, 6);
                    opt = options.TradeGoods[roll[0] * 10 + roll[1]];
                    if(i > 100)
                        break;
                    i++;
                }
                availableTradeGoods.push(opt);
            }

            var availableCount = _.countBy(availableTradeGoods, function(tg) { return tg.Type; });

            var purchaseModifiers = _.chain(world)
                .map(function(val) {
                    if(val === undefined)
                        return [];
                    if(_.isArray(val))
                        return _.map(val, function(v) { return v.TradeGoodPurchaseModifiers === undefined ? [] : v.TradeGoodPurchaseModifiers; });
                    return val.TradeGoodPurchaseModifiers === undefined ? [] : val.TradeGoodPurchaseModifiers;
                })
                .flatten()
                .value();

            var saleModifiers = _.chain(world)
                .map(function(val) {
                    if(val === undefined)
                        return [];
                    if(_.isArray(val))
                        return _.map(val, function(v) { return v.TradeGoodSaleModifiers === undefined ? [] : v.TradeGoodSaleModifiers; });
                    return val.TradeGoodSaleModifiers === undefined ? [] : val.TradeGoodSaleModifiers;
                })
                .flatten()
                .value();

            return _.chain(availableTradeGoods)
                .uniq()
                .map(function(tg) {

                    var count = availableCount[tg.Type];

                    var purchaseMod = _.chain(purchaseModifiers)
                        .pluck(tg.Label)
                        .reduce(function(memo, num) { return !_.isNumber(num) || memo > num ? memo : num; }, 0)
                        .value() || 0;

                    var saleMod = _.chain(saleModifiers)
                        .pluck(tg.Label)
                        .reduce(function(memo, num) { return memo > num ? memo : num; }, 0)
                        .value() || 0;

                    var totalMod = brokerSkill + characteristicModifier + purchaseMod - saleMod + supplierMod + d(3, 6);
                    var salePrice = options.TradeModifier[_.find(tables.TradeModifier, find(totalMod)).Item].PurchaseMod * tg.BasePrice;

                    return {
                        Type: tg.Type,
                        TradeGood: tg,
                        Tons: d(1, 6) * tg.LotMultiplier * count,
                        PricePerTon: salePrice,
                        BrokerAmount: salePrice * brokerPercent
                    };
                })
                .sortBy(function(tg) {
                    return tg.Type;
                })
                .value();
        },
        CalculatePassengerMod: function(currentWorld, targetWorld) {
            return calculatePassengerMod(currentWorld, targetWorld);
        },
        GeneratePassengers: function(currentWorld, targetWorld) {
            var totalMod = calculatePassengerMod(currentWorld, targetWorld);

            var item = options.Passengers[_.find(tables.Passengers, find(totalMod)).Item];
            var low = item.Low();
            var mid = item.Mid();
            var high = item.High();

            return { Low: low > 0 ? low : 0, Mid: mid > 0 ? mid : 0, High: high > 0 ? high : 0 };
        },
        CalculateFreightMod: function(currentWorld, targetWorld) {
            return calculateFreightMod(currentWorld, targetWorld);
        },
        GenerateFreight: function(currentWorld, targetWorld) {
            var totalMod = calculateFreightMod(currentWorld, targetWorld);

            var item = options.Freight[_.find(tables.Freight, find(totalMod)).Item];
            var inc = { multi: 1, count: item.Incidental() };
            var minor = { multi: 5, count: item.Minor() };
            var major = { multi: 10, count: item.Major() };

            return _.chain([inc, minor, major])
                .map(function(val) {
                    var arr = [];

                    _.times(val.count, function(n) { arr.push(d(1, 6) * val.multi); });

                    return arr;
                })
                .flatten()
                .sortBy()
                .value();
        },
        GenerateMail: function(currentWorld, targetWorld, variables) {
            var variables = variables || {};
            var isArmed = variables.ShipArmed ? 2 : 0;
            var rank = variables.HighestRank || 0;
            var social = variables.HighestSocial || 0;
            var lowTech = currentWorld.TechLevel.Value <= 5 || targetWorld.TechLevel.Value <= 5 ? -4 : 0;
            var freightMod = calculateFreightMod(currentWorld, targetWorld);

            if(freightMod < -10)
                freightMod = -2;
            else if(freightMod < -5)
                freightMod = -1;
            else if (freightMod < 4)
                freightMod = 0;
            else if (freightMod < 9)
                freightMod = 1;
            else
                freightMod = 2;

            var mailMod = _.reduce([isArmed, rank, social, lowTech, freightMod], function(memo, num) { return memo + num; }, d(2, 6));

            return mailMod >= 12;
        },
        UWP: function worldDesc(world, coords) {
            var labels = ['Starbase', 'Size', 'Atmosphere', 'Hydrographic', 'Population', 'Government', 'Law'];
            var out = world.Name + ' ';
            if(coords)
                out += '(' + coords.x + ', ' +  coords.y + ') ';
            for(var l in labels)
                out += world[labels[l]].Label;
            out += '-' + world.TechLevel.Label + ' ';
            for(var b in world.Bases)
                out += world.Bases[b].Label + ' ';
            for(var t in world.TradeCodes)
                out += world.TradeCodes[t].Label + ' ';
            for(var c in world.TravelCodes)
                out += world.TravelCodes[c].Label + ' ';
            return out.trim();
        }
    };
});
