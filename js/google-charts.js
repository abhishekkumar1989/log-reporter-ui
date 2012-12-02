google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(make_counter_query);

var all_types = ["yearly", "monthly", "daily"];
var current_loaded_type = "yearly";
var current_type_value;
var current_error;

function draw_basic_chart(response) {
    var year = new Date().getFullYear();
    current_type_value = year;
    
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Error-Type');
    data.addColumn('number', 'Count');
    
    for(var key in response) {
        data.addRow([key, response[key][year]]);
    }

    // Set chart options
    var options = {
        'title':'All Count Errors',
        'width':400,
        'height':300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));

    function selectHandler() {
      var selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        var error_name = data.getValue(selectedItem.row, 0);
        $("#chart_div").val(error_name);
        make_query();
      }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);    
    chart.draw(data, options);
}

function draw_chart(response, error_name) {
    current_error = error_name;
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Division-Type');
    data.addColumn('number', 'Count');
    
    for(var key in response) {
        if(response[key]) {
            for(var key2 in response[key])  
            data.addRow([key2, response[key][key2]]);
        }
    }

    // Set chart options
    var options = {
        'title':'Count Errors : ' + $("#chart_div").val(),
        'width':400,
        'height':300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));

    google.visualization.events.addListener(chart, 'select', selectHandler);    
    chart.draw(data, options);

    function selectHandler() {
    // current_type_value : depends on what got selected
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
            var duration_type = data.getValue(selectedItem.row, 0);
            current_type_value = duration_type;
            make_query(current_error);
        }
    }

}