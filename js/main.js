let DEFAULT_TABLE_FILL = 'grey';
let DEFAULT_CIRCLE_FILL = 'black';
let DEFAULT_CIRCLE_RADIUS = 17;

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

    // global variables defiend in the layout.js file
    console.log(TABLES);
    console.log(SEATS);

    // draw the tables
    let tables = svg.selectAll('rect').data(TABLES);
    tables.enter().append('rect')
        .attr('x', table => table.table_x)
        .attr('y', table => table.table_y)
        .attr('width', table => table.table_width)
        .attr('height', table => table.table_height)
        .attr('fill', DEFAULT_TABLE_FILL);
    

    // draw the seats
    let seats = svg.selectAll('circle').data(SEATS);
    seats.enter().append('circle')
        .attr('r', DEFAULT_CIRCLE_RADIUS)
        .attr('fill', DEFAULT_CIRCLE_FILL)
        .attr('cx', 200)
        .attr('cy', 200)
        .transition() // example of how the queue transition might look (even though these are the table seats rn lol)
        .delay(seat => seat.seat_id * 250)
        .attr('cx', seat => seat.seat_x)
        .attr('cy', seat => seat.seat_y);


});