let DEFAULT_SEAT_FILL = 'black';
let DEFAULT_CIRCLE_RADIUS = 20;
let seater = SeatOMatic();

let party_id_count = 0;
$(function () {

    let party_pattern = 'Random';

    let tables_seats = TABLES.map(function (table)
    {
        return table.seats.length;
    });

    let queue = randParties(party_pattern).map((generated_size, i) => {
        party_id_count += 1;
        return {
            size: generated_size,
            id: party_id_count
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
        let group = queue.shift();
        drawQueue(group);
    });

    let svg = d3.select('#main-svg');

    // global variables defiend in the layout.js file
    // console.log(TABLES);
    // console.log(SEATS);

    //  Draw the static elements --------------------------------------

    // draw the tables
    function drawTables()
    {
        let tables = svg.selectAll('rect').data(TABLES);
        tables.enter().append('rect')
            .attr('x', table => table.table_x)
            .attr('y', table => table.table_y)
            .attr('width', table => table.table_width)
            .attr('height', table => table.table_height)
            .attr('fill', DEFAULT_TABLE_FILL);
    }

    drawTables();

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

    let queue_x = $('#left-pane').width() / 2;
    let left_pane_height = $('#left-pane').height() / 6;
    let queue_y_start = 100;

    let QUEUE_SLOTS = {
        0: {
            x: queue_x,
            y: queue_y_start
        },
        1: {
            x: queue_x,
            y: queue_y_start + left_pane_height
        },
        2: {
            x: queue_x,
            y: queue_y_start + (left_pane_height * 2)
        },
        3: {
            x: queue_x,
            y: queue_y_start + (left_pane_height * 3)
        },
        4: {
            x: queue_x,
            y: queue_y_start + (left_pane_height * 4)
        }
    };

    function drawQueue(group) {
        let parties = svg.selectAll('.party').data(queue, party => party.id);
        let text = svg.selectAll('.text').data(queue, party => party.id);

        if (group)
        {
            seatGroup(group, parties.exit())
        }

        parties
            .transition()
            .duration(500)
            .attr('cx', (party, i) => QUEUE_SLOTS[i].x)
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y)

        parties.enter().append('circle')
            .attr('class', 'party')
            .attr('r', DEFAULT_CIRCLE_RADIUS)
            .attr('fill', 'blue')
            .attr('cx', queue_x)
            .attr('cy', $('#left-pane').height() + 100)
            .transition()
            .delay(circle => circle.id * 150)
            .attr('cx', (party, i) => QUEUE_SLOTS[i].x)
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y);

        text.exit().remove();

        text
            .transition()
            .duration(500)
            .attr("x", (party, i) => {
                console.log(party);
                return QUEUE_SLOTS[i].x;
            })
            .attr("y", (party, i) => QUEUE_SLOTS[i].y + 5);

        text.enter()
            .append('text')
            .attr('class', 'text')
            .attr("x", (party, i) => QUEUE_SLOTS[i].x)
            .attr("y", (party, i) => QUEUE_SLOTS[i].y + 5)
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(function(q){return +q.size});

        text.exit().remove();

    }

    function seatGroup(group, groupCircle)
    {
        let table_index = seater.seq(tables_seats, group.size);
        if (table_index[0] != table_index[1])
        {
            let seated_flag = false;
            for (var i = table_index[0]; i < table_index[1]; i++)
            {
                let selected_table = TABLES[i];
                if (!seated_flag)
                {
                    console.log(groupCircle);
                    groupCircle
                        .transition()
                        .attr('cx', selected_table.table_x)
                        .attr('cy', selected_table.table_y)
                        .transition()
                        .remove();
                }
            }
        }
        else
        {
            let selected_table = TABLES[table_index[0]];
            groupCircle
                .transition()
                .attr('cx', selected_table.table_x)
                .attr('cy', selected_table.table_y)
                .transition()
                .remove();
        }

    }

    drawQueue();


});