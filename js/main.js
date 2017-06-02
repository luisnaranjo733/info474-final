let DEFAULT_SEAT_FILL = 'black';
let DEFAULT_CIRCLE_RADIUS = 20
let disableTime = 0;
let party_id_count = 0;
let curr_color = 0;
let playInterval;
let play = false;
$(function () {

    let party_pattern = 'Random';

    let edges = [ // index is table, [] at index is possible other tables to group with
        [1],        // table 0 can be moved with table 1
        [0, 2, 3, 4],  // table 1 can be moved with tables 0,2,3,4
        [4],        // table 2 can be moved with table 4
        [4],        // table 3 can be moved with table 4
        [],         // table 4 cant be moved
    ];

    let seater = SeatOMatic(TABLES, edges);

    let colorScale = function (i) {
        let color_scheme = d3.schemeDark2;
        let color = color_scheme[curr_color];
        if (curr_color == color_scheme.length - 2) {
            curr_color = 0
        } else {
            curr_color++
        }
        return color;
    };

    // temporarily override random number gen code for easier debugging
    randParties = (pattern) => [5, 4, 3, 2, 1];

    let queue = randParties(party_pattern).map((generated_size, i) => {
        let groupObject = {
            size: generated_size,
            id: party_id_count,
            color: colorScale(party_id_count)
        };
        party_id_count += 1;
        seater.addQueue(groupObject);
        return groupObject;
    });

    let svg = d3.select('#main-svg');

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

    drawTableLayout();
    drawQueue(queue);

    // draw the tables
    function drawTableLayout() {
        let tables = svg.selectAll('.restaurant-table').data(TABLES);
        tables.enter().append('rect')
            .attr('class', 'restaurant-table')
            .attr('x', table => table.table_x)
            .attr('y', table => table.table_y)
            .attr('width', table => table.table_width)
            .attr('height', table => table.table_height)
            .attr('fill', table => table.table_fill);

        // draw the seats
        let seats = svg.selectAll('.table-seat').data(SEATS);
        seats.enter().append('circle')
            .attr('class', 'table-seat')
            .attr('r', DEFAULT_CIRCLE_RADIUS)
            .attr('fill', DEFAULT_SEAT_FILL)
            .attr('cx', seat => seat.seat_x)
            .attr('cy', seat => seat.seat_y);

        let table_texts = svg.selectAll('.table-wait').data(TABLES);

        // add the wait times for each group's table(s)
        table_texts.enter().append('text')
            .attr('class', 'table-wait')
            .attr('x', table => table.table_x)
            .attr('y', table => table.table_y)
            .attr('width', table => table.table_width)
            .attr('height', table => table.table_height)
            .attr('dy', table => table.table_height / 2)
            .attr('dx', table => table.table_width / 2)
            .style('text-anchor', 'middle')
            .style("fill", "white")
            .text(table => 'Wait: ' + table.wait);
    }

    function updateTableWaits() {
        TABLES.map((table) => {
            table.wait = table.wait > 0 ? table.wait - 1 : 0
            return table 
        })

        let table_texts = svg.selectAll('.table-wait').data(TABLES);
        table_texts.text(table => 'Wait: ' + table.wait)
    }

    function clearQueue(queue) {
        svg.selectAll('.unseated_party').remove();
        svg.selectAll('.unseated_text').remove();
    }

    // int count : the number of parties/groups you want to add to the queue
    function addQueue(count) {
        for (let i = 0; i < count; i++) {
            let groupObject = {
                id: party_id_count,
                size: randParty(party_pattern),
                color: colorScale()
            };
            party_id_count += 1;
            seater.addQueue(groupObject);
        }
    }

    function drawQueue(queue) {

        let parties = svg.selectAll('.unseated_party').data(queue, party => party.id);
        let text = svg.selectAll('.unseated_text').data(queue, party => party.id);

        // enter new parties to queue
        parties.enter()
            .append('circle')
            .attr('class', party => 'unseated_party')
            .attr('r', DEFAULT_CIRCLE_RADIUS)
            .attr('fill', party => party.color)
            .attr('cx', queue_x)
            .attr('cy', $('#left-pane').height() + 100)
            .transition()
            .delay(function(circle, i) { return i * 100 })
            .attr('cx', (party, i) => { return QUEUE_SLOTS[i].x })
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y);

        // update parties in queue
        parties
            .transition()
            .duration(500)
            .attr('cx', (party, i) => QUEUE_SLOTS[i].x)
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y)

        // delete exiting text
        text.exit().remove();

        // update queue text
        text
            .transition()
            .duration(500)
            .attr("x", (party, i) => {
                return QUEUE_SLOTS[i].x;
            })
            .attr("y", (party, i) => QUEUE_SLOTS[i].y + 5);

        // add entering text to queue
        text.enter()
            .append('text')
            .attr('class', 'unseated_text')
            .attr("x", (party, i) => QUEUE_SLOTS[i].x)
            .attr("y", (party, i) => QUEUE_SLOTS[i].y + 5)
            .style("text-anchor", "middle")
            .style("fill", "white")
            .text(function (q) { return +q.size });
    }

    function removeSeatedGroups(groups) {
        let group_type_selector = '.seated_circle';

        for (let i = 0; i < groups.length; i++) {
            let group = groups[i].group;

            let x = $('#left-pane').width() + $('#right-pane').width() + 50;
            let y = 200;
            d3.selectAll(group_type_selector + group.id)
                .transition()
                .duration(1000)
                .attr('cx', group => {
                    return x;
                })
                .attr('cy', y)
                .remove();
        }
    }

    /*
    Visually seat parties from the queue to their tables.
    This method will take a selection of exiting group circles,
    and directly move them to their tables instead of deleting them from the DOM

    Params:
        groups is the array of group objects retrieved from the seater's step function.
            it represents the groups that are being seated and where they are being seated/
        groupCircle is the d3 selection of exiting group circles from our queue data join
    */
    function seatGroups(queue, seated) {
        // this should be deleting parties in the queue that have been spliced from the queue
        // but it doesn't work for some reason.
        // Parties are being copied to the restaurant, but their original queue counterparts are not being deleted as expected.
        let queue_circles = svg.selectAll('.unseated_party').data(queue, party => party.id);
        let queue_text = svg.selectAll('.unseated_text').data(queue, party => party.id);
        let seating_circles = svg.selectAll('.seating_circle').data(seated, party => party.group.id);
        let seating_text = svg.selectAll('.seating_text').data(seated, party => party.group.id);

        queue_circles.exit()
            .transition()
            .duration(500)
            .attr('cx', (party, i) => QUEUE_SLOTS[i].x + 100)
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y)
            .remove()

        queue_text.exit()
            .transition()
            .duration(500)
            .attr("x", (party, i) => QUEUE_SLOTS[i].x + 100)
            .attr("y", (party, i) => QUEUE_SLOTS[i].y)
            .remove()

        setTimeout(function() {

            seating_circles.enter()
                .append('circle')
                .attr('class', 'seating_circle')
                .attr('r', DEFAULT_CIRCLE_RADIUS)
                .attr('fill', party => party.group.color)
                .attr('cx', (party, i) => QUEUE_SLOTS[i].x + 100)
                .attr('cy', (party, i) => QUEUE_SLOTS[i].y)
                .transition()
                .duration(1000)
                .attr('cx', (party) => { return TABLES[party.tables[0]].table_x })
                .attr('cy', (party) => { return TABLES[party.tables[0]].table_y })

            seating_text.enter()
                .append('text')
                .attr('class', 'seating_text')
                .attr('x', (party, i) => QUEUE_SLOTS[i].x + 100)
                .attr('y', (party, i) => QUEUE_SLOTS[i].y)
                .style("text-anchor", "middle")
                .style("fill", "white")
                .text(party => party.group.size)
                .transition()
                .duration(1000)
                .attr('x', (party) => { return TABLES[party.tables[0]].table_x })
                .attr('y', (party) => { return TABLES[party.tables[0]].table_y });

        }, 500)

        setTimeout(function() {
            seated.forEach((grp) => {
                let seats = grp.group.size
                let circles = []
                grp.tables.forEach((tbl) => {
                    TABLES[tbl].wait = grp.wait
                    TABLES[tbl].seats.forEach((seat) => {
                        if (seats > 0) {
                            circles.push({
                                id: seat.seat_id,
                                color: grp.group.color,
                                x: seat.seat_x,
                                y: seat.seat_y
                            })
                        }
                        seats -=1
                    })
                })

                let seated_circles = svg.selectAll('.seated_circle').data(circles, seat => seat.id);

                seated_circles.enter()
                    .append('circle')
                    .attr('class', 'seated_circle' + grp.group.id)
                    .attr('r', DEFAULT_CIRCLE_RADIUS)
                    .attr('fill', seat => seat.color)
                    .attr('cx', seat => { return seat.x })
                    .attr('cy', seat => { return seat.y })
            })

            seated = []

            seating_circles = svg.selectAll('.seating_circle').data(seated);
            seating_text = svg.selectAll('.seating_text').data(seated)

            seating_circles.exit().remove()
            seating_text.exit().remove()
        }, 2000)

    }

    function stepDraw()
    {
        $('#step-btn').prop('disabled', true);
        if (!play)
        {
            $('#play-btn').prop('disabled', true);
        }
        // pop a party off the queue and seat them according to the algorithm
        let algorithm_is_enabled = $('#algorithm-enabled').is(':checked');

        let result = seater.step(!algorithm_is_enabled);
        // returns object with two fields seated and done,
        // both are arrays and both will contain. wait time, id group, and table id

        // remove parties from the queue that are going to get seated
        queue = result.queue;

        if (result.done.length > 0) removeSeatedGroups(result.done);

        if (result.seated.length > 0) {
            seatGroups(queue, result.seated)
            setTimeout(function() {
                if (!play)
                {
                    $('#step-btn').prop('disabled', false);
                }
                $('#play-btn').prop('disabled', false);
                addQueue(5 - queue.length)
                drawQueue(queue)
                updateTableWaits()
            }, 2000)
        } else {
            if (!play)
            {
                $('#step-btn').prop('disabled', false);
            }
            $('#play-btn').prop('disabled', false);
            updateTableWaits()
        }
    }

    // open bootstrap modal to display about section on click
    $('#about').click(() => $('#myModal').modal());

    // update party_pattern global var on select change
    $('select').change(() => {
        party_pattern = $('select').val();
        queue = randParties(party_pattern).map((generated_size, i) => {
            party_id_count += 1;
            return {
                size: generated_size,
                id: party_id_count
            }
        });
        clearQueue(queue);
        drawQueue(queue);
    });

    // handle stepping through the algorithm
    $('#step-btn').click(stepDraw);

    // handle playing the visualization
    $('#play-btn').click(function()
    {
        if ($(this).hasClass('btn-success'))
        {
            play = true;
            $('#step-btn').prop('disabled', true);
            $(this).removeClass('btn-success');
            $(this).addClass('btn-danger');
            $(this).html('Stop');
            stepDraw();
            playInterval = setInterval(stepDraw, 2000);
        }
        else
        {
            play = false;
            $('#step-btn').prop('disabled', false);
            $(this).removeClass('btn-danger');
            $(this).addClass('btn-success');
            $(this).html('Play');
            clearInterval(playInterval);
        }

    });
});