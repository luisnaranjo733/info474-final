/*

This script defines the restaurant table and seat layout.

CONFIGURATION
=============

TABLE_TYPE is an object. It's keys are the names of table types.
It's value are objects that represent the name, width, height, and seats for that table type.
Modify this object if you want to tweak how all tables of a particular type are formed..

TABLE_LAYOUT is an array of objects. It's objects represent the tables in the restaurant.
Each table has an (x, y) coordinate, and a table type (see above data structure).
Modify these objects if you want to change where tables are placed, and what kind of tables are placed
at particular coordinates (e.g. change a 1+1 into a 2+2).

OUTPUT
======

The output of this script are the SEATS and TABLES global variables.
These are both flattened arrays of objects computed from the TABLE_TYPE and TABLE_LAYOUT
configurations. They are designed to be convenient for a D3 data join.

TABLES is an array of table objects. They look like this:
{
    table_height: 200,
    table_width: 200,
    table_x: 525,
    table_y: 250,
    table_id: 2,
    table_type: '1+1',
    seats: [array of seat objects for this table]
}

SEATS is an array of seat objects. They look like this:
{
    seat_x: 575,
    seat_y: 250,
    seat_id: 0,
    table_type: '1+1'
}

You can use either of these arrays to do data joins. Their structure can be tweaked.
We can also include parent table data on each seat if that helps.

*/

// define the table types and their areas in pixels
// each seat is defined relative to the top left corner of the table.
let TABLE_TYPE = {
    one: {
        name: '1+1',
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
        name: '2+2',
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
        name: '3+3',
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

let TABLES = [];
let SEATS = [];

let _table_count = 0;
let _seat_count = 0;

TABLES = TABLE_LAYOUT.map(table => {
    let absolute_seats = [];
    table.type.seats.forEach(relative_seat => {
        let absolute_seat = {
            seat_id: _seat_count,
            seat_x: table.x + relative_seat.x,
            seat_y: table.y + relative_seat.y,
            table_type: table.type.name
        };
        _seat_count += 1;
        absolute_seats.push(absolute_seat);
        SEATS.push(absolute_seat);
    });

    table = {
        table_id: _table_count,
        table_type: table.type.name,
        table_x: table.x,
        table_y: table.y,
        table_width: table.type.width,
        table_height: table.type.height,

        seats: absolute_seats
    };
    _table_count += 1;
    return table;
});