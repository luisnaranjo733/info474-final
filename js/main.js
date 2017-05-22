// define the table types and their areas in pixels
let TABLE_SIZE = {
    one: {
        width: 100,
        height: 100,
    },
    two: {
        width: 200,
        height: 100,
    },
    three: {
        width: 300,
        height: 100,
    }
}

// define the restaurant layout in terms of (x,y) pixel anchor points and table types
let TABLE_LAYOUT = [
    {
        x: 525,
        y: 250,
        type: TABLE_SIZE.one
    },
    {
        x: 650,
        y: 250,
        type: TABLE_SIZE.one
    },
    {
        x: 1100,
        y: 100,
        type: TABLE_SIZE.two
    },
    {
        x: 800,
        y: 575,
        type: TABLE_SIZE.two
    },
    {
        x: 1100,
        y: 350,
        type: TABLE_SIZE.three
    }
];

let DEFAULT_TABLE_FILL = 'grey';

$(function () {

    let party_pattern = 'Random';

    // open bootstrap modal to display about section on click
    $('#about').click(() => $('#myModal').modal());

    // update party_pattern global var on select change
    $('select').change(() => {
        party_pattern = $('select').val();
        console.log(`Change the party pattern to ${party_pattern} and reset the queue`);
    });

    // handle stepping through the algorithm
    $('#step-btn').click(() => {
        // pop a party off the queue and seat them according to the algorithm
        let algorithm_is_enabled = $('#algorithm-enabled').is(':checked');
        console.log(`Place the next party in the queue`);
        console.log(`algorithm_is_enabled=${algorithm_is_enabled} and party_pattern=${party_pattern}`);
    });

    let svg = d3.select('#main-svg');
    let tables = svg.selectAll('rect').data(TABLE_LAYOUT);

    tables.enter().append('rect')
        .attr('x', table => table.x)
        .attr('y', table => table.y)
        .attr('width', table => table.type.width)
        .attr('height', table => table.type.height)
        .attr('fill', DEFAULT_TABLE_FILL)


});