var max = 5;
var parties = [];

// generate a set of random party sizes
var randParties = function(type){
    var typeHolder;
    if (typeHolder != type) {
        parties = [];
    }
    if (type == 'Uniform') {
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

// generate a single random party size
let randParty = function(type)
{
    if (type == 'Uniform') {
        return rnorm(4, 1.5, true);
    } else if (type == 'Random') {
        return runif(1, 6, true);
    }
};
