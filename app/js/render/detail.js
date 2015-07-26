define('render/detail', ['lodash', 'interact', 'world'], function(_, interact, World) {
    var body = document.getElementById('main');

    return function(gridOpts) {

        var sel = _.keys(gridOpts.selectedGrids);
        var det = _.chain(gridOpts.detailViews)
            .filter(function(val) { return val !== null; })
            .map(function(val) { return val; })
            .value();

        var missing = _.difference(sel, det);
        var extra = _.difference(det, sel);

        for(var m in missing) {
            var id = missing[m];
            var mis = gridOpts.selectedGrids[id];
            var tile = gridOpts.tiles[mis.y][mis.x];

            var misDiv;
            var displayId = _.find(_.keys(gridOpts.detailViews), function(key) { return gridOpts.detailViews[key] === null; });

            if(!displayId) {
                misDiv = document.createElement('div');
                displayId = _.uniqueId('detail_');
                misDiv.setAttribute('id', displayId);
                misDiv.setAttribute('class', 'detail');

                interact(misDiv).draggable({
                    max: Infinity,
                    onmove: function(event) {
                        var target = event.target,
                        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.webkitTransform =
                        target.style.transform =
                            'translate(' + x + 'px, ' + y + 'px)';

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                });

                body.appendChild(misDiv);
            }
            else
                misDiv = document.getElementById(displayId);

            gridOpts.detailViews[displayId] = id;

            if(tile.Name) {
                misDiv.innerHTML = World.UWP(tile, mis);
                misDiv.style.display = 'block';
            }

            var startX = gridOpts.mouse.loc.x - 20;
            var startY = gridOpts.mouse.loc.y - 20;

            misDiv.style.webkitTransform =
            misDiv.style.transform =
                'translate(' + startX +  'px, ' + startY + 'px)';

            misDiv.setAttribute('data-x', startX);
            misDiv.setAttribute('data-y', startY);


        }

        for(var e in extra) {
            var val = extra[e];
            var displayId = _.find(_.keys(gridOpts.detailViews), function(key) { return gridOpts.detailViews[key] === extra[e]; });

            gridOpts.detailViews[displayId] = null;
            var div = document.getElementById(displayId);
            div.style.display = 'none';
        }

    }
});
