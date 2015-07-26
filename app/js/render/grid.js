define('render/grid', [], function() {
    var cache = { offset: {}, mouseLoc: {}, size: {} };

    function isCached(opts, c) {
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var mouse = opts.mouse || {};
        return cache.offset.x === offSetX
            && cache.offset.y === offSetY
            && cache.mouseLoc.x === mouse.loc.x
            && cache.mouseLoc.y === mouse.loc.y
            && mouse.click.x === null
            && mouse.click.y === null
            && cache.size.width === c.width
            && cache.size.height === c.height;
    }

    function updateCache(opts, c) {
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var mouse = opts.mouse || {};
        cached = {
            offset : { x: offSetX, y: offSetY },
            mouseLoc : mouse.loc,
            size: { width: c.width, height: c.height }
        };
        return;
    }

    function loopDraw(drawFunc, size) {
        for (var xGrid = 0; xGrid <= size.width; xGrid++)
            for (var yGrid = 0; yGrid < size.height; yGrid++)
                drawFunc(xGrid, yGrid);
    }

    return function drawHexGrid(opts, c) {
        if(isCached(opts, c))
            return {};

        updateCache(opts, c);

        var returnData = {};

        var alpha = opts.alpha || 1;
        var color = opts.color || '#444';
        var highlightColor = opts.highlightColor || '#666';
        var selectedColor = opts.selectedColor || '#123';
        var lineWidth = opts.lineWidth || 1;
        var radius = opts.radius || 20;
        var offSetX = opts.offSetX || 0;
        var offSetY = opts.offSetY || 0;
        var background = opts.background;
        var mouse = opts.mouse || {};
        var selectedGrids = opts.selectedGrids || {};

        var r = radius;
        var part = 60;
        var hexSize = r * Math.sqrt(3);
        var yHexSize = r * Math.sqrt(2.25);
        var xHexes = c.width / hexSize + 4;
        var yHexes = c.height / yHexSize + 4;
        var hexRad = hexSize / 2;

        var globalOffSetX = offSetX;
        var globalOffSetY = offSetY;

        var mouseTile;
        var clickTile;

        var mapOffSet = {
            x: globalOffSetX === 0
                ? 0
                : globalOffSetX > 0
                    ? Math.floor(globalOffSetX/hexSize/2) * 2
                    : Math.ceil(globalOffSetX/hexSize/2) * 2,
            y: globalOffSetY === 0
                ? 0
                : globalOffSetY > 0
                    ? Math.floor(globalOffSetY/yHexSize/2) * 2
                    : Math.ceil(globalOffSetY/yHexSize/2) * 2
        };

        var size = { width: xHexes, height: yHexes };

        mapOffSet.x += 2;
        mapOffSet.y += 2;

        offSetX = offSetX % (hexSize * 2) - hexSize * 2;
        offSetY = offSetY % (yHexSize * 2) - yHexSize * 2;

        var mapGridCanvas = c.getContext('2d');
        mapGridCanvas.clearRect(0, 0, c.width, c.height);
        mapGridCanvas.globalAlpha = alpha;
        mapGridCanvas.strokeStyle = color;
        mapGridCanvas.lineWidth = lineWidth;

        if(background) {
            mapGridCanvas.fillStyle = background;
            mapGridCanvas.fillRect(0, 0, c.width, c.height);
        }

        function drawGrid(xGrid, yGrid) {
            var shiftX = yGrid % 2 * hexRad;
            var xCenter = xGrid * hexSize + shiftX + offSetX;
            var yCenter = yGrid * yHexSize + offSetY;

            for(var i=0; i<=6; i++) {
                var a = i * part - 90;
                var x = r * Math.cos(a * Math.PI / 180) + xCenter;
                var y = r * Math.sin(a * Math.PI / 180) + yCenter;
                if(i === 0)
                    mapGridCanvas.moveTo(x, y);
                else
                    mapGridCanvas.lineTo(x, y);
            }
        
            if(mouse && mouse.loc && _.isNumber(mouse.loc.x) && _.isNumber(mouse.loc.y)) {
                var mx = mouse.loc.x;
                var my = mouse.loc.y;
                var xDist = mx - xCenter;
                var yDist = my - yCenter;

                var dist = Math.sqrt(xDist * xDist + yDist * yDist);
                if(!mouseTile || mouseTile.dist > dist) {
                    mouseTile = {
                        x: xGrid,
                        y: yGrid,
                        dist: dist
                    };
                    mouseTile.id = mouseTile.x + ',' + mouseTile.y;
                }
            }

            if(mouse && mouse.click && _.isNumber(mouse.click.x) && _.isNumber(mouse.click.y)) {
                var mx = mouse.click.x;
                var my = mouse.click.y;
                var xDist = mx - xCenter;
                var yDist = my - yCenter;

                var dist = Math.sqrt(xDist * xDist + yDist * yDist);
                if(!clickTile || clickTile.dist > dist) {
                    clickTile = {
                        x: xGrid - mapOffSet.x,
                        y: yGrid - mapOffSet.y,
                        dist: dist
                    };
                    clickTile.id = clickTile.x + ',' + clickTile.y;
                }
            }
        }

        mapGridCanvas.beginPath();
        loopDraw(drawGrid, size);
        mapGridCanvas.stroke();

        if(selectedGrids
            && clickTile
            && clickTile.id
            && selectedGrids[clickTile.id]) {
            selectedGrids = _.omit(selectedGrids, clickTile.id);
            clickTile = {};
            returnData.selectedGrids = selectedGrids;
        }

        if(selectedGrids
            && clickTile
            && clickTile.id
            && _.isNumber(clickTile.x)
            && _.isNumber(clickTile.y)) {
            selectedGrids[clickTile.id] = { x: clickTile.x, y: clickTile.y };
            returnData.selectedGrids = selectedGrids;
        }

        mapGridCanvas.strokeStyle = highlightColor;
        mapGridCanvas.lineWidth = lineWidth * 4;

        mapGridCanvas.beginPath();
        if(mouseTile && _.isNumber(mouseTile.x) && _.isNumber(mouseTile.y)) {
            var xGrid = mouseTile.x; 
            var yGrid = mouseTile.y;
            var shiftX = yGrid % 2 * hexRad;
            for(var i = 0; i <= 6; i++) {
                var a = i * part - 90;
                var x = r * Math.cos(a * Math.PI / 180) + xGrid * hexSize + shiftX + offSetX;
                var y = r * Math.sin(a * Math.PI / 180) + yGrid * yHexSize + offSetY;
                if(i === 0)
                    mapGridCanvas.moveTo(x, y);
                else
                    mapGridCanvas.lineTo(x, y);
            }

            returnData.mouseTile = mouseTile;
        }
        else
            returnData.mouseTile = {};

        mapGridCanvas.stroke();

        mapGridCanvas.strokeStyle = selectedColor;

        mapGridCanvas.beginPath();
        if(selectedGrids && _.find(selectedGrids)) {
            for(var g in selectedGrids) {
                var selectedGrid = selectedGrids[g];
                if(!selectedGrid)
                    continue;
                var xGrid = selectedGrid.x + mapOffSet.x;
                var yGrid = selectedGrid.y + mapOffSet.y;
                var shiftX = yGrid % 2 * hexRad;

                if(xGrid > xHexes || xGrid < 0 || yGrid > yHexes || yGrid < 0) {
                    continue;
                }

                for(var i = 0; i <= 6; i++) {
                    var a = i * part - 90;
                    var x = r * Math.cos(a * Math.PI / 180) + xGrid * hexSize + shiftX + offSetX;
                    var y = r * Math.sin(a * Math.PI / 180) + yGrid * yHexSize + offSetY;
                    if(i === 0)
                        mapGridCanvas.moveTo(x, y);
                    else
                        mapGridCanvas.lineTo(x, y);
                }
            }
        }
        mapGridCanvas.stroke();

        mapGridCanvas.fillStyle = color;
        mapGridCanvas.strokeStyle = color;
        mapGridCanvas.font = '14px courier';
        for(var xGrid = 0; xGrid <= xHexes; xGrid++) {
            for(var yGrid = 0; yGrid <= yHexes; yGrid++) {
                var shiftX = yGrid % 2 * hexRad;
                var x = xGrid * hexSize + shiftX + offSetX;
                var y = yGrid * yHexSize + offSetY;

                y -= r *.6;
                var xg = xGrid - mapOffSet.x;
                var yg = yGrid - mapOffSet.y;
                var out = xg + ', ' + yg;
                x -= out.length / 4 * 14;
                mapGridCanvas.fillText(xg + ', ' + yg, x, y);
            }
        }

        mouse.click = { x: null, y: null };

        return returnData;
    }
});
