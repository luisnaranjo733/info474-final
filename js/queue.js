var max = 6;
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
        console.log(parties);
    } else if (type == 'Random') {
        for (i=0; i < max; i++) {
            parties.push(runif(1,6,true));
        }
        console.log(parties);
    }
};

d3.select("#left-pane")
    .append("svg");
