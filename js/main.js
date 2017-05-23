let DEFAULT_TABLE_FILL = 'grey';
let DEFAULT_SEAT_FILL = 'black';
let DEFAULT_CIRCLE_RADIUS = 20;


$(function () {

    let party_pattern = 'Random';

    let queue = randParties(party_pattern).map(generated_size => {
        return {
            size: generated_size
        }
    });
    console.log(queue);

    // open bootstrap modal to display about section on click
    $('#about').click(() => $('#myModal').modal());

    // update party_pattern global var on select change
    $('select').change(() => {
        party_pattern = $('select').val();
        randParties(party_pattern);
        console.log(`Change the party pattern to ${party_pattern} and reset the queue`);
    });

    // handle stepping through the algorithm
    $('#step-btn').click(() => {
        // pop a party off the queue and seat them according to the algorithm
        let algorithm_is_enabled = $('#algorithm-enabled').is(':checked');
        // console.log(`Place the next party in the queue`);
        // console.log(`algorithm_is_enabled=${algorithm_is_enabled} and party_pattern=${party_pattern}`);
        console.log(queue);
        queue.pop();
        console.log(queue);
        drawQueue();
    });

    let svg = d3.select('#main-svg');

    // global variables defiend in the layout.js file
    // console.log(TABLES);
    // console.log(SEATS);

    //  Draw the static elements --------------------------------------

    // draw the tables
    let tables = svg.selectAll('rect').data(TABLES);
    tables.enter().append('rect')
        .attr('x', table => table.table_x)
        .attr('y', table => table.table_y)
        .attr('width', table => table.table_width)
        .attr('height', table => table.table_height)
        .attr('fill', DEFAULT_TABLE_FILL);
    

    // draw the seats
    let seats = svg.selectAll('.seat').data(SEATS);
    seats.enter().append('circle')
        .attr('class', 'seat')
        .attr('r', DEFAULT_CIRCLE_RADIUS)
        .attr('fill', DEFAULT_SEAT_FILL)
        // .attr('cx', 200)
        // .attr('cy', 200)
        // .transition() // example of how the queue transition might look (even though these are the table seats rn lol)
        // .delay(seat => seat.seat_id * 250)
        .attr('cx', seat => seat.seat_x)
        .attr('cy', seat => seat.seat_y);

    // Finish drawing the static elements ------------------------------------------------------

    let QUEUE_SLOTS = {
        0: {
            x: 200,
            y: 200
        },
        1: {
            x: 200,
            y: 300
        },
        2: {
            x: 200,
            y: 400,
        },
        3: {
            x: 200,
            y: 500
        },
        4: {
            x: 200,
            y: 600
        }
    };

    function drawQueue() {
        let parties = svg.selectAll('.party').data(queue);
        parties.enter().append('circle')
            .attr('class', 'party')
            .attr('r', DEFAULT_CIRCLE_RADIUS)
            .attr('fill', 'blue')
            .attr('cx', (party, i) => QUEUE_SLOTS[i].x)
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y);

        parties.enter().append('text')
                .attr('class', 'text')
                .attr("x", (party, i) => QUEUE_SLOTS[i].x)
                .attr("y", (party, i) => QUEUE_SLOTS[i].y + 5)
                .style("text-anchor", "middle")
                .style("fill", "white")
                .text(function(q){return +q.size});   
        
        parties.exit().remove();
    }

    drawQueue();


});