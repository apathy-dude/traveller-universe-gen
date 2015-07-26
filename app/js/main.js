require(['lodash', 'interact', 'world', 'name/planet', 'render/grid', 'render/tile', 'render/detail'],
    function(_, interact, World, planet, grid, planets, detail) {
        var body = document.getElementById('main');

        function render(opts, canvases) {
            var returnData = {};
            for(var i in canvases) {
                var canvas = canvases[i];
                _.extend(returnData, canvas.renderer(opts, canvas.canvas));
            }
            return returnData;
        }

        var gridCanvas = document.createElement('canvas');
        gridCanvas.setAttribute('id', 'grid-canvas');

        var planetCanvas = document.createElement('canvas');
        planetCanvas.setAttribute('id', 'planet-canvas');

        var canvases = [
            { canvas: gridCanvas, renderer: grid },
            { canvas: planetCanvas, renderer: planets },
            { canvas: null, renderer: detail }
        ];

        var gridOpts = {
            background: '#000',
            offSetX: 0,
            offSetY: 0,
            radius: 80,
            lineWidth: 0.5,
            color: '#444',
            tiles: {},
            mouse: { loc: { x: null, y: null }, click: { x: null, y: null } },
            selectedGrids: {},
            detailViews: {}
        };

        for(var yGrid = -10; yGrid <= 10; yGrid++) {
            gridOpts.tiles[yGrid] = {};
            for(var xGrid = -10; xGrid <= 15; xGrid++) {
                gridOpts.tiles[yGrid][xGrid] = Math.random() > 0.5 ? {} : World.Generate();
            }
        }

        var el = body;
        for(var i in canvases) {
            var canvas = canvases[i].canvas;
            if(canvas)
                el.appendChild(canvas);
        }

        var offSetDistance = 10;
        document.onkeydown = function(e) {
            switch(e.keyCode) {
                case 17: offSetDistance *= 5; break;
                case 37: gridOpts.offSetX -= offSetDistance; break;
                case 38: gridOpts.offSetY -= offSetDistance; break;
                case 39: gridOpts.offSetX += offSetDistance; break;
                case 40: gridOpts.offSetY += offSetDistance; break;
            }
        };

        document.onkeyup = function(e) {
            switch(e.keyCode) {
                case 17: offSetDistance *= .2; break;
            }
        }

        var size = window.onresize = function() {
            body.style.height = window.innerHeight - 10;
            for(var i in canvases) {
                var canvas = canvases[i].canvas;
                if(canvas) {
                    canvas.width = window.innerWidth - 10;
                    canvas.height = window.innerHeight - 10;
                }
            }
        }

        size();

        function ev(mouseProperty, value) {
            if(value)
                return function(e) {
                    gridOpts.mouse[mouseProperty] = value;
                }

            return function(e) {
                gridOpts.mouse[mouseProperty] = { x: e.clientX, y: e.clientY };
            }
        };

        document.onmousedown = function(e) {
            if(e.target.nodeName === 'CANVAS')
                gridOpts.mouse['click'] = { x: e.clientX, y: e.clientY };
        };
        //document.onmouseup = ev;
        //document.onmouseover = ev;
        document.onmouseout = ev('loc', { x: null, y: null });
        document.onmousemove = ev('loc')

        setInterval(
            function()
            {
                var returnData = render(gridOpts, canvases);

                if(returnData.generateRequests)
                    for(var gen in returnData.generateRequests) {
                        var map = returnData.generateRequests[gen];
                        if(!gridOpts.tiles[map.y])
                            gridOpts.tiles[map.y] = {};
                        gridOpts.tiles[map.y][map.x] = Math.random() > 0.5 ? {} : World.Generate();
                    }

                if(returnData.selectedGrids)
                    gridOpts.selectedGrids = returnData.selectedGrids;

                if(returnData.mouseData)
                    gridOpts.mouseTile = returnData.mouseTile;
            }, 29
        );

        interact.maxInteractions(Infinity);
});
