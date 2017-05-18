$(function() {

    $('#about').click(() => {
        let options = {};
        $('#myModal').modal(options)
    });

    let table_size = {
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

    let table_data = [
        {
            x: 375,
            y: 250,
            type: table_size.one
        },
        {
            x: 500,
            y: 250,
            type: table_size.one
        },
        {
            x: 800,
            y: 100,
            type: table_size.two
        },
        {
            x: 600,
            y: 575,
            type: table_size.two
        },
        {
            x: 800,
            y: 350,
            type: table_size.three
        },
    ];

    let width = window.innerWidth;
    let height = window.innerHeight;

    console.log(`Width: ${width}`);

    let svg = d3.select('#vis').append('svg')
                .attr('width', width)
                .attr('height', height);
        // .atrr('width', width);
    // console.log(svg);

    let tables = svg.selectAll('rect').data(table_data);

    tables.enter().append('rect')
        .attr('x', table => table.x)
        .attr('y', table => table.y)
        .attr('width', table => table.type.width)
        .attr('height', table => table.type.height)
        .attr('fill', 'blue')


});