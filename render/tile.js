define('render/tile', [], function() {
    var cached = { offset: {} };

    function loopDraw(drawFunc, size) {
        for(var xGrid = 0; xGrid <= size.width; xGrid++)
            for(var yGrid = 0; yGrid <= size.height; yGrid++)
                drawFunc(xGrid, yGrid);
    }

    return function drawPlanets(opts, c) {
        var returnData = {
            generateRequests: []
        };

        var alpha = opts.aplpha || 1;
        var color = opts.color || '#444';
        var lineWidth = opts.lineWidth || 1;
        var radius = opts.radius || 20;
        var planetSize = opts.planetSize || radius / 10;
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var tiles = opts.tiles || {};
        var background = opts.background || '#000';


        if(cached.offset.x === offSetX
            && cached.offset.y === offSetY
            && cached.size.width === c.width
            && cached.size.height === c.height)
            return;

        cached = {
            offset: { x: offSetX, y: offSetY },
            size: { width: c.width, height: c.height }
        };

        var mapCanvas = c.getContext('2d');
        mapCanvas.clearRect(0, 0, c.width, c.height);
        mapCanvas.globalAplpha = alpha;

        var r = radius;
        var hexSize = r * Math.sqrt(3);
        var yHexSize = r * Math.sqrt(2.25);
        var xHexes = c.width / hexSize + 4;
        var yHexes = c.height / yHexSize + 4;
        var hexRad = hexSize / 2;
        var xDiam = hexSize;
        var yDiam = yHexSize;

        var tileXOffSet = offSetX;
        var tileYOffSet = offSetY; 

        var textYOffSet = r * .6;
        var fontSize = r / 5;

        var size = { width: xHexes, height: yHexes };

        offSetX = offSetX % (hexSize * 2) - hexSize * 2;
        offSetY = offSetY % (yHexSize * 2) - yHexSize * 2;

        tileXOffSet -= offSetX;
        tileYOffSet -= offSetY;

        tileXOffSet /= xDiam;
        tileYOffSet /= yDiam;

        function getCoords(xGrid, yGrid) {
            var shiftX = yGrid % 2 * hexRad;
            var x = xGrid * hexSize + shiftX + offSetX;
            var y = yGrid * yHexSize + offSetY;
            var mapX = Math.floor(xGrid - tileXOffSet);
            var mapY = Math.floor(yGrid - tileYOffSet);

            return { x: x, y: y, map: { x: mapX, y: mapY } };
        }

        function getPlanet(tiles, map) {
            if(tiles[map.y] && tiles[map.y][map.x])
                return tiles[map.y][map.x];
            returnData.generateRequests.push(map);
            return {};
        }

        // Render travel codes
        mapCanvas.fillStyle = background;
        mapCanvas.strokeStyle = color;
        mapCanvas.lineWidth = lineWidth;
        mapCanvas.beginPath();
        function travelCode(xGrid, yGrid) {
            var loc = getCoords(xGrid, yGrid);

            var planet = getPlanet(tiles, loc.map);

            if(planet.TravelCodes && planet.TravelCodes.length > 0 && planet.TravelCodes[0].Label === 'A') {
                mapCanvas.moveTo(loc.x, loc.y);
                mapCanvas.arc(loc.x, loc.y, textYOffSet, 0, 2 * Math.PI, true);
            }
        }
        loopDraw(travelCode, size);
        mapCanvas.stroke();
        mapCanvas.fill();

        // Render planets
        mapCanvas.fillStyle = color;
        mapCanvas.strokeStyle = color;
        mapCanvas.lineWidth = lineWidth;
        mapCanvas.beginPath();
        function planetFill(xGrid, yGrid) {
            var loc = getCoords(xGrid, yGrid);

            var planet = getPlanet(tiles, loc.map);

            if(planet.Name) {
                mapCanvas.moveTo(loc.x, loc.y);
                mapCanvas.arc(loc.x, loc.y, planetSize, 0, 2 * Math.PI, true);
            }
        }
        loopDraw(planetFill, size);
        mapCanvas.fill();

        // Render labels
        mapCanvas.fillStyle = color;
        mapCanvas.strokeStyle = color;
        mapCanvas.lineWidth = lineWidth;
        mapCanvas.font = fontSize + 'px courier';
        function locationFill(xGrid, yGrid) {
            var loc = getCoords(xGrid, yGrid);
            var x = loc.x;
            var y = loc.y;

            var radMod = 0.6;

            var planet = getPlanet(tiles, loc.map);

            if(planet.Name) {
                var charCount = planet.Name.length / 4;
                x -= charCount * fontSize;
                mapCanvas.fillText(planet.Name, x, y + textYOffSet);
                mapCanvas.fillText(planet.Starbase.Label, loc.x - fontSize * .25, y - textYOffSet * .5);

                var baseCount = 0;
                var write = false;
                for(var b in planet.Bases) {
                    var base = planet.Bases[b];

                    var a = baseCount * 20 - 60;
                    var x = -r * radMod * Math.cos(a * Math.PI / 180) + loc.x;
                    var y = r * radMod * Math.sin(a * Math.PI / 180) + loc.y;

                    mapCanvas.fillText(base.DisplayCharacter, x, y);

                    baseCount ++;
                }

                if(planet.GasGiant) {
                    var a = -45;
                    var x = r * radMod * Math.cos(a * Math.PI / 180) + loc.x;
                    var y = r * radMod * Math.sin(a * Math.PI / 180) + loc.y;

                    mapCanvas.fillText(String.fromCharCode(0x25cf), x, y);
                    x -= fontSize * 0.5;
                    mapCanvas.fillText('---', x, y);
                }
            }
        }
        if(fontSize >= 8)
            loopDraw(locationFill, size);

        return returnData;
    }
});
