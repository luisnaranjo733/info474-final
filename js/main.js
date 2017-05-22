// define the table types and their areas in pixels
// each seat is defined relative to the top left corner of the table.
let TABLE_TYPE = {
    one: {
        width: 100,
        height: 100,
        seats: [
            {
                x: 50,
                y: 0
            },
            {
                x: 50,
                y: 100
            }
        ]
    },
    two: {
        width: 200,
        height: 100,
        seats: [
            {
                x: 50,
                y: 0
            },
            {
                x: 150,
                y: 0
            },
            {
                x: 50,
                y: 100
            },
            {
                x: 150,
                y: 100
            }
        ]
    },
    three: {
        width: 300,
        height: 100,
        seats: [
            {
                x: 50,
                y: 0
            },
            {
                x: 150,
                y: 0
            },
            {
                x: 250,
                y: 0
            },

            {
                x: 50,
                y: 100
            },
            {
                x: 150,
                y: 100
            },
            {
                x: 250,
                y: 100
            },
        ]
    }
}

// define the table layout in terms of (x,y) pixel anchor points and table types
// (0, 0) is the top left corner of the svg NOT the window.
// This means that a table placed at (0, 0) would actually end up at (0, 125) since the
// navbar and toolbar are 125 pixels tall
// NOTE: The seats in the table layout type are defined relative to the table's (x,y).
//      The absolute coordinates for each seat need to be calculated based on the table's (x, y)
//      and each seat's relative (x, y) from that point.
let TABLE_LAYOUT = [
    {
        x: 525,
        y: 250,
        type: TABLE_TYPE.one
    },
    {
        x: 650,
        y: 250,
        type: TABLE_TYPE.one
    },
    {
        x: 1100,
        y: 100,
        type: TABLE_TYPE.two
    },
    {
        x: 800,
        y: 575,
        type: TABLE_TYPE.two
    },
    {
        x: 1100,
        y: 350,
        type: TABLE_TYPE.three
    }
];

let DEFAULT_TABLE_FILL = 'grey';
let DEFAULT_CIRCLE_FILL = 'black';
let DEFAULT_CIRCLE_RADIUS = 25;

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

    // draw the tables
    let tables = svg.selectAll('rect').data(TABLE_LAYOUT);
    tables.enter().append('rect')
        .attr('x', table => table.x)
        .attr('y', table => table.y)
        .attr('width', table => table.type.width)
        .attr('height', table => table.type.height)
        .attr('fill', DEFAULT_TABLE_FILL);
    
    // compute the absolute coordinates for all of the seats
    // loop over each
    let seat_layout = [];
    let seat_count = 0;
    TABLE_LAYOUT.forEach(table => {
        table.type.seats.forEach(relative_seat => {
            let absolute_seat = {
                x: table.x + relative_seat.x,
                y: table.y + relative_seat.y,
                id: seat_count // assign an arbitrary id to each seat for the delay
            };
            seat_layout.push(absolute_seat);
            seat_count += 1;
        });
    });

    // draw the seats
    let seats = svg.selectAll('circle').data(seat_layout);
    seats.enter().append('circle')
        .attr('r', DEFAULT_CIRCLE_RADIUS)
        .attr('fill', DEFAULT_CIRCLE_FILL)
        .attr('cx', 200)
        .attr('cy', 200)
        .transition() // example of how the queue transition might look (even though these are the table seats rn lol)
        .delay(seat => seat.id * 250)
        .attr('cx', seat => seat.x)
        .attr('cy', seat => seat.y);


});