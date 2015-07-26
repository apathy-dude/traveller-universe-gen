define('util/find', ['lodash'], function(_) {
   return function find(roll) {
        return function rollMatch(tab) {
            if(tab.MinValue !== undefined && roll < tab.MinValue)
                return false;
            if(tab.MaxValue !== undefined && roll > tab.MaxValue)
                return false;
            if(tab.MinValue === undefined && tab.MaxValue === undefined && tab.ValueArray !== undefined && _.find(tab.ValueArray, function(num) { return num === roll; }) === undefined)
                return false;
            if(tab.MinValue === undefined && tab.MaxValue === undefined && tab.ValueArray === undefined && tab.Value !== undefined && tab.Value !== roll)
                return false;
            return true;
        };
    };
});
