define('world/generators',
    ['lodash', 'util/dice', 'util/find', 'world/options'],
    function(_, dice, find, options) {
    var d = dice.d;
    var dd = dice.dd;

    var StarbaseBases = {
      'A': [
        { MinValue: 8, Base: options.Bases.N },
        { MinValue: 10, Base: options.Bases.S },
        { MinValue: 8, Base: options.Bases.R },
        { MinValue: 4, Base: options.Bases.T },
        { MinValue: 6, Base: options.Bases.I }
      ],
      'B': [
        { MinValue: 8, Base: options.Bases.N },
        { MinValue: 8, Base: options.Bases.S },
        { MinValue: 10, Base: options.Bases.R },
        { MinValue: 6, Base: options.Bases.T },
        { MinValue: 8, Base: options.Bases.I },
        { MinValue: 12, Base: options.Bases.P }
      ],
      'C': [
        { MinValue: 8, Base: options.Bases.S },
        { MinValue: 10, Base: options.Bases.R },
        { MinValue: 10, Base: options.Bases.T },
        { MinValue: 10, Base: options.Bases.I },
        { MinValue: 10, Base: options.Bases.P }
      ],
      'D': [
        { MinValue: 7, Base: options.Bases.S },
        { MinValue: 12, Base: options.Bases.P }
      ],
      'E': [
        { MinValue: 12, Base: options.Bases.P }
      ],
      'X': []
    };

    var ns = {};

    ns.GasGiant = function (world, tables, modifiers, options) {
      world.GasGiant = d(2, 6) < 10;
    };

    ns.TradeCodes = function(world, tables, modifiers, options) {
      world.TradeCodes = _.chain(tables.TradeCodes)
        .filter(function(tab) {
            return _.every(Object.keys(tab.Requirements), function(label) { 
                return find(world[label].Value)(tab.Requirements[label]);
            });
        })
        .map(function(tab) {
            return options.TradeCodes[tab.Item];
        })
        .value();
    }

    ns.Bases = function(world, tables, modifiers, options) {
      world.Bases = _.chain(StarbaseBases[world.Starbase.Label])
        .filter(function(base) { return d(2, 6) >= base.MinValue; })
        .map(function(base) { return base.Base; })
        .value();
    };

    ns.TravelCodes = function(world, tables, modifiers, options) {
    var R = [];
    var A = [
        function(world) { return world.Atmosphere.Value >= 10; },
        function(world) { var law = world.Law.Value; return law === 0 || law >= 9; },
        function(world) { var gov = world.Government.Value; return gov === 0 || gov === 7 || gov === 10; }
    ];

    var item = options.TravelCodes['G'];

    if(_.find(R, function(f) { return f(world); }))
        item = options.TravelCodes['R'];
    else if(_.find(A, function(f) { return f(world); }))
        item = options.TravelCodes['A'];

    world.TravelCodes = [item];
    };

    ns.Atmosphere = function(world, tables, modifiers, options) {
      var field = 'Atmosphere';
      var mod = modifiers[field];
      var tab = tables[field];

      if(world[field] !== undefined && world[field] !== null)
          return;

      var modi = _.map(mod, function(func) { return func instanceof Function ? func(world) : func; });
      var mods = modi;
      var roll = d(2, 6);
      modi = _.some(modi, function(val) { return !val instanceof Number; })
        ? _.find(modi, function(val) { return !val instanceof Number; })
        : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

      var label = _.find(tab, find(modi));
      var item = options[field][label.Item];

      if(world.Size.Value <= 4) {
          if(item.Value <= 2)
            item = options[field]['0'];
          else if(item.Value <= 5)
            item = options[field]['1'];
          else
            item = options[field]['A'];
      }

      world[field] = item;
    };

    ns.Factions = function(world, tables, modifiers, options) {
    function genGovType() {
        var field = 'Government';
        var opt = options[field];
        var tab = tables[field];
        var mod = modifiers[field];

        if(!tab)
            throw new Exception(field + ' table not found.');

        var modi = _.map(mod, function(func) { return func instanceof Function ? func(world) : func; });
        var roll = d(2, 6);
        modi = _.some(modi, function(val) { return typeof(val) !== 'number'; })
            ? _.find(modi, function(val) { return typeof(val) !== 'number'; })
            : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

        var label = _.find(tab, find(modi));
        return opt[label.Item];
    }

    function genStrength() {
        return options.FactionStrength[_.find(tables.FactionStrength, find(d(2, 6))).Item];
    }

    world.Factions = [];

    if(world.Population.Value <= 0)
        return;

    var modi = _.map(modifiers['FactionCount'], function(func) { return func instanceof Function ? func(world) : func; });
    var roll = d(1, 3);
    modi = _.some(modi, function(val) { return typeof(val) !== 'number'; })
        ? _.find(modi, function(val) { return typeof(val) !== 'number'; })
        : _.reduce(modi, function(memo, num) { return memo + num; }, roll);

    _.times(modi, function() { world.Factions.push({ Government: genGovType(), Strength: genStrength() }); });
    };

    return ns;
});
