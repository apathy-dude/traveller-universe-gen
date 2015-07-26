define('util/dice', ['lodash'], function(_) {
    function roll(size) {
        return _.random(1, size);
    }

    return {
        d: function d(number, size) {
            if (!size) {
                size = number;
                number = 1;
            }
            var total = 0;
            _.times(number, function(n) { total += roll(size); });
            return total;
        },
        dd: function dd(number, size) {
            if (!size) {
                size = number;
                number = 1;
            }
            var rolls = [];
            _.times(number, function(n) { rolls.push(roll(size)); });
            return rolls;
        }
    };
});
