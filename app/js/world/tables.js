define('world/tables', [], function() {
    var ns = {};

    ns.Freight = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: '10', Value: 10 },
        { Item: '11', Value: 11 },
        { Item: '12', Value: 12 },
        { Item: '13', Value: 13 },
        { Item: '14', Value: 14 },
        { Item: '15', Value: 15 },
        { Item: '16', Value: 16, MinValue: 16 },
    ];

    ns.Passengers = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: '10', Value: 10 },
        { Item: '11', Value: 11 },
        { Item: '12', Value: 12 },
        { Item: '13', Value: 13 },
        { Item: '14', Value: 14 },
        { Item: '15', Value: 15 },
        { Item: '16', Value: 16, MinValue: 16 },
    ];

    ns.TradeModifier = [
        { Item: '-1', Value: -1, MaxValue: -1 },
        { Item: '0', Value: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: '10', Value: 10 },
        { Item: '11', Value: 11 },
        { Item: '12', Value: 12 },
        { Item: '13', Value: 13 },
        { Item: '14', Value: 14 },
        { Item: '15', Value: 15 },
        { Item: '16', Value: 16 },
        { Item: '17', Value: 17 },
        { Item: '18', Value: 18 },
        { Item: '19', Value: 19 },
        { Item: '20', Value: 20 },
        { Item: '21', Value: 21, MinValue: 21 },
    ];

    ns.Starbase = [
        { Item: 'X', MaxValue: 2 },
        { Item: 'E', MinValue: 3, MaxValue: 4 },
        { Item: 'D', MinValue: 5, MaxValue: 6 },
        { Item: 'C', MinValue: 7, MaxValue: 8 },
        { Item: 'B', MinValue: 9, MaxValue: 10 },
        { Item: 'A', MinValue: 11 }
    ];

    ns.Size = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10, MinValue: 10 }
    ];

    ns.Atmosphere = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13 },
        { Item: 'E', Value: 14 },
        { Item: 'F', Value: 15, MinValue: 15 }
    ];

    ns.Temperature = [
        { Item: 'X', Value: null },
        { Item: 'Frozen', MaxValue: 2 },
        { Item: 'Cold', MinValue: 3, MaxValue: 4 },
        { Item: 'Temperate', MinValue: 5, MaxValue: 9 },
        { Item: 'Hot', MinValue: 10, MaxValue: 11 },
        { Item: 'Roasting', MinValue: 12 }
    ];

    ns.Hydrographic = [
        { Item: '0', MaxValue: 0, Value: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10, MinValue: 10 }
    ];

    ns.Population = [
        { Item: '0', MaxValue: 0, Value: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13 },
        { Item: 'E', Value: 14 },
        { Item: 'F', MinValue: 15, Value: 15 }
    ];

    ns.Government = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13, MinValue: 13 }
    ];

    ns.Law = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9, MinValue: 9 }
    ];

    ns.TradeCodes = [
        {
            Item: 'Ag',
            Requirements: {
                Atmosphere: { MinValue: 4, MaxValue: 9 },
                Hydrographic: { MinValue: 4, MaxValue: 8 },
                Population: { MinValue: 5, MaxValue: 7 }
              }
        },
        {
            Item: 'As',
            Requirements: {
                Size: { Value: 0 },
                Atmosphere: { Value: 0 },
                Hydrographic: { Value: 0 }
            }
        },
        {
            Item: 'Ba',
            Requirements: {
                Population: { Value: 0 },
                Law: { Value: 0 },
                TechLevel: { Value: 0 }
            }
        },
        {
            Item: 'De',
            Requirements: {
                Atmosphere: { MinValue: 2 },
                Hydrographic: { Value: 0 }
            }
        },
        {
            Item: 'Fl',
            Requirements: {
                Atmosphere: { MinValue: 10 },
                Hydrographic: { MinValue: 1 }
            }
        },
        {
            Item: 'Ga',
            Requirements: {
                Size: { MinValue: 5 },
                Atmosphere: { MinValue: 4, MaxValue: 9 },
                Hydrographic: { MinValue: 4, MaxValue: 8 }
            }
        },
        {
            Item: 'Hi',
            Requirements: {
                Population: { MinValue: 9 }
            }
        },
        {
            Item: 'Ht',
            Requirements: {
                TechLevel: { MinValue: 12 }
            }
        },
        {
            Item: 'Ic',
            Requirements: {
                Atmosphere: { MinValue: 0, MaxValue: 1 },
                Hydrographic: { MinValue: 1 }
            }
        },
        {
            Item: 'In',
            Requirements: {
                Atmosphere: { ValueArray: [ 0, 1, 2, 4, 7, 9 ] },
                Population: { MinValue: 9 }
            }
        },
        {
            Item: 'Lo',
            Requirements: {
                Population: { MinValue: 1, MaxValue: 3 }
            }
        },
        {
            Item: 'Lt',
            Requirements: {
                TechLevel: { MaxValue: 5 }
            }
        },
        {
            Item: 'Na',
            Requirements: {
                Atmosphere: { MinValue: 0, MaxValue: 3 },
                Hydrographic: { MinValue: 0, MaxValue: 3 },
                Population: { MinValue: 6 }
            }
        },
        {
            Item: 'Ni',
            Requirements: {
                Population: { MinValue: 4, MaxValue: 6 }
            }
        },
        {
            Item: 'Po',
            Requirements: {
                Atmosphere: { MinValue: 2, MaxValue: 5 },
                Hydrographic: { MinValue: 0, MaxValue: 3 }
            }
        },
        {
            Item: 'Ri',
            Requirements: {
                Atmosphere: { ValueArray: [6, 8] },
                Population: { MinValue: 6, MaxValue: 8 }
            }
        },
        {
            Item: 'Va',
            Requirements: {
                Atmosphere: { Value: 0 }
            }
        },
        {
            Item: 'Wa',
            Requirements: {
                Hydrographic: { Value: 10 }
            }
        }
    ];

    ns.TechLevel = [
        { Item: '0', Value: 0, MaxValue: 0 },
        { Item: '1', Value: 1 },
        { Item: '2', Value: 2 },
        { Item: '3', Value: 3 },
        { Item: '4', Value: 4 },
        { Item: '5', Value: 5 },
        { Item: '6', Value: 6 },
        { Item: '7', Value: 7 },
        { Item: '8', Value: 8 },
        { Item: '9', Value: 9 },
        { Item: 'A', Value: 10 },
        { Item: 'B', Value: 11 },
        { Item: 'C', Value: 12 },
        { Item: 'D', Value: 13 },
        { Item: 'E', Value: 14 },
        { Item: 'F', Value: 15, MinValue: 15 },
    ];

    ns.FactionStrength = [
        { Item: 'Obscure', MaxValue: 3 },
        { Item: 'Fringe', MinValue: 4, MaxValue: 5 },
        { Item: 'Minor', MinValue: 6, MaxValue: 7 },
        { Item: 'Notable', MinValue: 8, MaxValue: 9 },
        { Item: 'Significant', MinValue: 10, MaxValue: 11 },
        { Item: 'Overwheming', MinValue: 12 }
    ];

    return ns;
});
