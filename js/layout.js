class Layout {
    constructor(table_layout) {
        this._seats = [];

        let table_count = 0;
        let seat_count = 0;
        
        this._tables = table_layout.map(table => {
            let absolute_seats = [];
            table.type.seats.forEach(relative_seat => {
                let absolute_seat = {
                    seat_x: table.x + relative_seat.x,
                    seat_y: table.y + relative_seat.y,
                    seat_id: seat_count,

                    table_width: table.type.width,
                    table_height: table.type.height,
                    table_type: table.type.name
                };
                seat_count += 1;
                absolute_seats.push(absolute_seat);
                this._seats.push(absolute_seat);
            });

            table = {
                table_type: table.type.name,
                table_id: table_count,
                table_width: table.type.width,
                table_height: table.type.height,
                table_x: table.x,
                table_y: table.y,
                seats: absolute_seats
            };
            table_count += 1;
            return table;

        });

    }

    getTables() {
        return this._tables;;
    }

    getSeats() {
        return this._seats;
    }
}