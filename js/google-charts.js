google.load('visualization', '1.0', {'packages':['corechart']});
google.setOnLoadCallback(make_counter_query);

var current_selected_type;
var global_response;

function draw_basic_chart(response, year_option_selected) {
    if(!global_response)
        global_response = response;
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Error-Type');
    data.addColumn('number', 'Count');
    
    for(var key in global_response) {
        for(var i in global_response[key]) {
            if(global_response[key][i]["type"]==year_option_selected)
                data.addRow([key, global_response[key][i]["value"]]);
        }
    }

    // Set chart options
    var options = {
        'title':'All Errors : ' + year_option_selected,
        'width':350,
        'height':270
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));

    function selectHandler() {
      var selectedItem = chart.getSelection()[0];
      if (selectedItem) {
        var error_name = data.getValue(selectedItem.row, 0);
        $("#chart_div_monthly").val({err : error_name, type : "monthly"});
        $("#chart_div_daily").empty();
        current_selected_type="monthly";
        make_query(year_option_selected);
      }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);    
    chart.draw(data, options);
}

function draw_chart(response) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Division-Type');
    data.addColumn('number', 'Count');
    
    for(var key in response) {
        if(response[key]) {
            for(var i in response[key])  
            data.addRow([response[key][i]["type"], response[key][i]["value"]]);
        }
    }

    // Set chart options
    var options = {
        'title':'Error : ' + $("#chart_div_monthly").val().err,
        'width':350,
        'height':270
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div_' + current_selected_type));

    google.visualization.events.addListener(chart, 'select', selectHandler);    
    chart.draw(data, options);

    function selectHandler() {
        current_selected_type = "daily"    
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
            var duration_type = data.getValue(selectedItem.row, 0);
            if(duration_type.split("-").length == 2)
                make_query(duration_type);
            else
                get_daily_error_result(duration_type);
        }
    }

}