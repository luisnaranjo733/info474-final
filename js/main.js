$(function() {

    $('#about').click(() => {
        let options = {};
        $('#myModal').modal(options)
    })

    let table_data = [
        {
            x: 100,
            y: 20,
            width: 200,
            height: 100
        },
        {
            x: 200,
            y: 300,
            width: 200,
            height: 100
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

    let selection = svg.datum([table_data]);

    let table = Table();
    selection.call(table);


    // tables.enter().append('rect')
    //     .attr('x', table => table.x)
    //     .attr('y', table => table.y)
    //     .attr('width', table => table.width)
    //     .attr('height', table => table.height)
    //     .attr('fill', 'blue')

    // let selection = d3.select("#vis").datum(data);


});