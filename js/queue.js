var max = 5;
var parties = [];

var randParties = function(type){
    var typeHolder;
    if (typeHolder != type) {
        parties = [];
    }
    if (type == 'Skewed') {
        for (i=0; i < max; i++) {
            parties.push(rnorm(4,1.5,true));
        }
        return parties;
    } else if (type == 'Random') {
        for (i=0; i < max; i++) {
            parties.push(runif(1,6,true));
        }
        return parties;
    }
};
