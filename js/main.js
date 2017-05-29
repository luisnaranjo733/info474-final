let DEFAULT_SEAT_FILL = 'black';
let DEFAULT_CIRCLE_RADIUS = 20

let party_id_count = 0;
$(function () {

    let party_pattern = 'Random';

    // let tables_seats = TABLES.map(function (table)
    // {
    //     return table.seats.length;
    // });
    let nodes = [2,2,4,4,6]; // tables
    let edges = [ // index is table, [] at index is possible other tables to group with
      [1],        // table 0 can be moved with table 1
      [0,2,3,4],  // table 1 can be moved with tables 0,2,3,4
      [4],        // table 2 can be moved with table 4
      [4],        // table 3 can be moved with table 4
      [],         // table 4 cant be moved
    ];

    let seater = SeatOMatic(nodes, edges);

    // let colorScale = d3.scaleOrdinal(d3.schemeCategory20);
    let colorScale = function(i) {
        let color_scheme = d3.schemeCategory20;
        let index = (i % color_scheme.length) + 1
        let color = color_scheme[index];
        console.log(`i: ${i}`, `color: ${color}`);
        return color;
    };

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
        drawQueue();
        console.log(`Change the party pattern to ${party_pattern} and reset the queue`);
    });

    // handle stepping through the algorithm
    $('#step-btn').click(() => {
        // pop a party off the queue and seat them according to the algorithm
        let algorithm_is_enabled = $('#algorithm-enabled').is(':checked');
        // console.log(`Place the next party in the queue`);
        // console.log(`algorithm_is_enabled=${algorithm_is_enabled} and party_pattern=${party_pattern}`);
        let result = seater.step();
        // returns object with two fields seated and done,
        // both are arrays and both will contain. wait time, id group, and table id
        // console.log('step');
        // console.log(result);
        // console.log(queue.length);
        for (let i = 0; i < result.seated.length; i++)
        {
            let groupId = result.seated[i].group.id;
            for (let j = 0; j < queue.length; j++)
            {
                let group = queue[j];
                if (group.id == groupId)
                {
                    queue.splice(j, 1);
                }
            }
        }
        // console.log(queue.length);
        // console.log(result.done);
        // console.log(result.seated);
        if (result.done.length > 0)
        {
            removeGroups(result.done, function()
            {
                drawQueue(result);
            });
        }
        else if (result.seated.length > 0)
        {
            drawQueue(result);
        }

    });

    let svg = d3.select('#main-svg');

    // global variables defined in the layout.js file
    // console.log(TABLES);
    // console.log(SEATS);

    //  Draw the static elements --------------------------------------

    // draw the tables
    function drawTableLayout()
    {
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
            // .attr('cx', 200)
            // .attr('cy', 200)
            // .transition() // example of how the queue transition might look (even though these are the table seats rn lol)
            // .delay(seat => seat.seat_id * 250)
            .attr('cx', seat => seat.seat_x)
            .attr('cy', seat => seat.seat_y);
    }
    drawTableLayout();



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

    function clearQueue(queue) {
        svg.selectAll('.party').remove();
        svg.selectAll('.text').remove();
    }

    // int count : the number of parties/groups you want to add to the queue
    function addQueue(count)
    {
        for (let i = 0; i < count; i++)
        {

            let groupObject =
                {
                    id: party_id_count,
                    size: randParty(party_pattern),
                    color: colorScale(party_id_count)
                };
            party_id_count += 1;
            queue.push(groupObject);
            seater.addQueue(groupObject);
        }
    }

    function drawQueue(groups) {
        let parties = svg.selectAll('.party').data(queue, party => party.id);
        let text = svg.selectAll('.text').data(queue, party => party.id);

        

        if (groups)
        {
            seatGroups(groups.seated, parties.exit());
        }

        parties
            .transition()
            .duration(500)
            .attr('cx', (party, i) => QUEUE_SLOTS[i].x)
            .attr('cy', (party, i) => QUEUE_SLOTS[i].y)

        parties.enter()
            .append('circle')
            .attr('class', 'party')
            .attr('id', (party) => 'group' + party.id)
            .attr('r', DEFAULT_CIRCLE_RADIUS)
            .attr('fill', party => party.color)
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

    function removeGroups(groups, callback)
    {
        for (let i = 0; i < groups.length; i++)
        {
            let group = groups[i].group;
            let tables = groups[i].tables;

            let x = $('#left-pane').width() + $('#right-pane').width() + 50;
            let y = 200;
            console.log(`(${x}, ${y})`);
            d3.select('.group' + group.id)
                .transition()
                .duration(1000)
                .attr('cx', x)
                .attr('cy', y)
                .remove();
        }
        callback();
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
    function seatGroups(groups, groupCircle)
    {
        console.log(TABLES);
        console.log('seat groups');
        // console.log(groups);
        console.log(groupCircle);
        if (groups.length > 0)
        {
            let seated_guests = [];

            groups.forEach(group => {
                console.log(group);
                let tables = group.tables.map(table_index => {
                    return TABLES[table_index]
                });
                // console.log(tables);
                tables.forEach(table => {
                    let seats = table.seats.map(seat => {
                        seat.color = group.group.color;
                        seat.group_id = group.group.id;
                        return seat;
                    });
                    let diff = table.seats.length - group.group.size;
                    seats = _.slice(seats, 0, seats.length - diff);

                    seated_guests = _.concat(seated_guests, seats);
                });
            });
            console.log(seated_guests);

            let seated = svg.selectAll('.seated_party').data(seated_guests, seat => seat.seat_id);
            console.log(seated);

            seated.enter()
                .append('circle')
                .attr('class', 'seated_party')
                .attr('class', seat => `group${seat.group_id}`)
                .attr('r', DEFAULT_CIRCLE_RADIUS)
                .attr('fill', seat => seat.color)
                .attr('cx', 200)
                .attr('cy', 200)
                .transition()
                .duration(1500)
                .attr('cx', seat => seat.seat_x)
                .attr('cy', seat => seat.seat_y);

            groupCircle.remove();


            // map of group id to table id array
            // ex: group 0 is seated at tables 1 and 2
            // {
            //     0: [1,2],
            // }
            // let groupTableMap = {};
            // for (let i = 0; i < groups.length; i++)
            // {
            //     let group = groups[i].group;
            //     groupTableMap[group.id] = groups[i].tables;
            // }

            // let waiting_area = {
            //     x: $('#left-pane').width() + 125,
            //     y: 170
            // }

            

            // groupCircle
            //     .attr('class', 'seated_party')
            //     .transition()
            //     .attr('cx', function (group)
            //     {
            //         // tables where this group should be seated
            //         let tables = groupTableMap[group.id];
            //         let selected_table = TABLES[tables[0]];
            //         return selected_table.table_x;
            //     })
            //     .attr('cy', function (group)
            //     {
            //         let tables = groupTableMap[group.id];
            //         let selected_table = TABLES[tables[0]];
            //         return selected_table.table_y;
            //     });

            // add the number of people that were just seated to the queue
            addQueue(groups.length);
            drawQueue();
        }
    }

    // console.log('TABLES');
    // console.log(TABLES);
    drawQueue();


});