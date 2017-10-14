$(document).ready(function() {
    $("body").tooltip({selector: '[data-toggle=tooltip]'});
    
    var num_seats = 20, total_seats = 200;
    var rows = initTheater(num_seats);
    showTheater(rows);
    
    var file, reservations;
    $('input[type="file"]').change(function(e) {
        file = e.target.files[0];
    });
    
    $("#submit").click(function() {
        if (window.File && window.FileList && window.FileReader) {
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var reservations       = parseReservations(e.target.result.split(/[\r\n]+/g));
                    var total_reservations = countReservations(reservations);
                    
                    if (total_reservations < total_seats) {
                        var final_rows = fillTheater(rows, reservations);
                        generateOutput(final_rows);
                        
                    // TODO: Decide on how to handle when there are more reservations than seats.
                    } else {
                        
                    }
                }
                
                reader.readAsText(file);
            } else {
                alert('Failed to load file');
            }
        }
    });
});

/**
 * Generates empty theater
 * @return array representing 10 rows and 20 seats per row
 */
function initTheater(num_seats) {
    var seats = [];
    seats.length = num_seats;
    seats.fill(0, 0, num_seats)
    
    var rows = {
        'A': seats.slice(),
        'B': seats.slice(),
        'C': seats.slice(),
        'D': seats.slice(),
        'E': seats.slice(),
        'F': seats.slice(),
        'G': seats.slice(),
        'H': seats.slice(),
        'I': seats.slice(),
        'J': seats.slice()
    }
    
    return rows;
}

/**
 * Displays initial theater
 */
function showTheater(rows) {
    for (var row in rows) {
        $('#theater').append('<div class="row">');
        $('#theater').append('<span class="monospace-font">' + row + ':</span>');
        var seats = rows[row];
        
        for (var i = 0; i < seats.length; i++) {
            $('#theater').append('<img class="availible" id="' + row + i + '" src="images/seat.png">');
        }
        
        $('theater').append('</div>');
    }
}

/**
 * Extracts reservations from input file
 * @return array containing reservation number and seats requested
 */
function parseReservations(content) {
    var reservations = [];
    
    content.forEach(function(reservation) {
        reservations.push(reservation.split(/[, ]+/));
    });
    
    return reservations;
}

/**
 * @return total number of reservations from input file
 */
function countReservations(reservations) {
    var total_reservations = 0;
    
    for (var i = 0; i < reservations.length; i++) {
        total_reservations += Number(reservations[i][1]);
    }
    
    return total_reservations;
}

/**
 * Assigns reservations to availible seats
 * @return array containing final seating arrangement
 * @todo handle when there are too many reservations
 */
function fillTheater(rows, reservations) {
    var final_rows = {};
    var reserve_id;
    
    for (var i = 0; i < reservations.length; i++) {
        reserve_id = reservations[i][0];
        
        var seats_needed = Number(reservations[i][1]);
        var final_seats  = [];
        
        for (var j = 0; j < seats_needed; j++) {
            
            var seat = findEmptySeat(rows);
            final_seats.push(seat);
            
            $('#' + seat).removeClass('availible');
            $('#' + seat).addClass('reserved');
            $('#' + seat).attr('data-toggle', 'tooltip');
            $('#' + seat).attr('src', 'images/ticket.png');
            $('#' + seat).attr('title', reserve_id);
        }
        
        final_rows[reserve_id] = final_seats;
    }
    
    return final_rows;
}

/**
 * @return next availible seat
 */
function findEmptySeat(rows) {
    for (var row in rows) {
        var seats = rows[row];
        
        for (var i = 0; i < seats.length; i++) {
            if (seats[i] === 0) {
                seats[i] = 1;
                
                return row + i;
            }
        }
    }
}

/**
 * Generates output file and enables download
 */
function generateOutput(final_rows) {
    var content = '';
    for (var row in final_rows) {
        var seats = final_rows[row];
        content += row + ' ' + final_rows[row + 1] + '\n';
    }
    
    $('#download').removeClass('disabled');
    $('#download').click(function() {
        var output = document.createElement('a');
        output.setAttribute('href', 'data:text/plain; charset=utf-8,' + encodeURIComponent(content));
        output.setAttribute('download', 'output.txt');
        
        output.style.display = 'none';
        document.body.appendChild(output);
        
        output.click();
        document.body.removeChild(output);
    })
}

