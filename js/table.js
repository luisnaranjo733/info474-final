// Bubble Chart
var Table = function() {
    // Set default values
    var height = 500,
        width = 500,
        color = 'black',
        x_position = 0,
        y_position = 0;

    // Function returned by BubbleChart
    var chart = function(selection) {
        console.log('charting');
        console.log(selection);
        // Iterate through selections, in case there are multiple
        selection.each(function(data) {
            console.log('loop');
            console.log(data);
            x_position = data.x;
            y_position = data.y;
            height = data.height;
            width = data.width;
            color = data.color || 'black';

            var ele = d3.select(this);
            console.log(ele);


            var svg = ele.selectAll('svg');
            console.log(svg);

            

            svg.enter().append('rect')
                .attr('x', (table) => {
                    console.log('table');
                    console.log(table);
                })
                .attr('y', y_position)
                .attr('height', height)
                .attr('width', width)
                .attr('fill', color);
        });
    };

    // Getter/setter methods to change locally scoped options
    // chart.height = function (value)
    // {
    //     if (!arguments.length) return height;
    //     height = value;
    //     return chart;
    // };
    //
    // chart.width = function (value)
    // {
    //     if (!arguments.length) return width;
    //     width = value;
    //     return chart;
    // };
    //
    // chart.colorValues = function(values)
    // {
    //     if (!arguments.length) return colorValues;
    //     colorValues = values;
    //     return chart;
    // };
    //
    // chart.colorBy = function (value)
    // {
    //     if (!arguments.length) return colorBy;
    //     colorBy = value;
    //     return chart;
    // };
    //
    // chart.title = function (value)
    // {
    //     if (!arguments.length) return title;
    //     title = value;
    //     return chart;
    // };
    //
    // chart.titleSize = function (value)
    // {
    //     if (!arguments.length) return titleSize;
    //     titleSize = value;
    //     return chart;
    // };
    //
    // chart.opacity = function (value)
    // {
    //     if (!arguments.length) return opacity;
    //     opacity = value;
    //     return chart;
    // };
    //
    // chart.margins = function (values)
    // {
    //     if (!arguments.length) return margin;
    //     margin.top = values.top || margin.top;
    //     margin.left = values.left || margin.left;
    //     margin.bottom = values.bottom || margin.bottom;
    //     margin.right = values.right || margin.right;
    //     return chart;
    // };
    //
    // chart.showLegend = function (value)
    // {
    //     if (!arguments.length) return showLegend;
    //     showLegend = value;
    //     return chart;
    // };
    //
    // chart.bubbleScale = function (value)
    // {
    //     if (!arguments.length) return bubbleScale;
    //     bubbleScale = value;
    //     return chart;
    // };
    //
    // chart.bubblePadding = function (value)
    // {
    //     if (!arguments.length) return bubblePadding;
    //     bubblePadding = value;
    //     return chart;
    // };

    return chart;
};