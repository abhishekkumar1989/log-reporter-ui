var base_site = "/backend/";

$(document).ready(function(){
	$("#tab-contents").css("overflow", "hidden")
});

$('#tab-list a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
})

$('#query-form').submit(function(e) {
	e.preventDefault();
	var form = this;
	var stop_time_in_mins = $("input[name = 'stop_time']", form).val();
	if(!stop_time_in_mins)
		stop_time_in_mins = 0;
	get_error_search_results($(":input[value][value!='']",form).serialize()+"&stop_time="+stop_time_in_mins, true);
});	

function get_error_search_results(uri, is_search_done) {
	$.ajax({
		url : "/backend/get_error_details",
		data : uri,
		dataType : "json",
		beforeSend: function() {
			pre_query(is_search_done);
		},
		error: function() {
			post_error_response();
		},
		success: function(response) {
			post_response_result(response, is_search_done);
		}
	});
}

function get_daily_error_result(day) {
	var error_name = $("#chart_div_monthly").val().err;
	day = day.replace("-0","-");
	var start_time_in_mins = Math.floor((new Date() - new Date(day))/60000);
	var stop_time_in_mins = start_time_in_mins > 1440 ? start_time_in_mins - 1440 : 0;
	get_error_search_results("row_key="+error_name+"&start_time=" + start_time_in_mins + "&stop_time="+stop_time_in_mins ,false);
}

function populate_year_selection_area(response, display_time_range) {
	var elem = $("select", "#tab1");
	var diff_dates = [];
	var data_html;

    for(var error_type in response) {
        for(var i in response[error_type]) {
        	var time_range = response[error_type][i]["type"]
            if(diff_dates.indexOf(time_range) < 0) {
            	diff_dates.push(time_range);
            	if(time_range == display_time_range)
            		data_html = data_html + "<option value=" + time_range + " selected='selected'>" + time_range + "</option>";
            	else
            		data_html = data_html + "<option value="+ time_range +">" + time_range + "</option>";
            }
        }
    }
    elem.html(data_html);
}

$("select:first", "#tab1").change(function(event) {
	$("#chart_div_monthly").empty();
	$("#chart_div_daily").empty();
	$("#search-result").empty();
	draw_basic_chart(global_response, event.currentTarget.value);
});

function make_initial_counter_query(event, time_range_display) {
	if(!time_range_display)
		time_range_display = "monthly"
	$("#chart_div").val({type:"yearly"})
	$.ajax({
		url : "/backend/all_error_details",
		data : "type=" + time_range_display,
		dataType : "json",
		success : function(response) {
			var display_time_range = time_range_display.match("yearly") ? new Date().getFullYear() : new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
			populate_year_selection_area(response, display_time_range);														// getMonth() + 1
			draw_basic_chart(response, display_time_range);
			// populate the google chart
		},
		error : function(error) {
			$("#chart_div").append("Error : " + error.statusText);
		}
	});
}

function make_error_count_query(duration_type) {
	var error_name = $("#chart_div_monthly").val().err;
	$.ajax({
		url : "/backend/get_counter",				// issues here
		data : "row_key="+error_name + "&type=" + current_selected_type + "&cf=" + duration_type,
		dataType : "json",
		success : function(response) {
	        draw_chart_for_error(response);
		},
		error : function(response) {
			// notify the user
		}
	});
}

function post_error_response() {
	$("#result-area").show();
	add_error_message(true);
	search_button_effects(false);	
}

function pre_query(is_search_done) {
	if(is_search_done) {
		add_error_message(false);
		search_button_effects(true);
	}
}

function post_response_result(response, is_search_done) {
	var div_element = is_search_done ? "#search-result" : "#day-result";
	if(is_search_done) {
		$("#result-area").show();
		search_button_effects(false);
		$("button",'#result-area').show();		
	}
	add_response_results(response, div_element);	
	add_mouse_over_on_results(div_element);
}

function add_mouse_over_on_results(div_element) {
   $(div_element+' dl').mouseover(function(){
      $(this).addClass('hover');
   });
        
   $(div_element+' dl').mouseout(function(){
      $(this).removeClass('hover');
   });
}

function add_response_results(response, div_element) {
	var data_html = "<hr>";
	for(var i in response) {
		data_html = data_html + "<dl><dt>"+ response[i]["date"] +"</dt><dd class='offset1'>"+ response[i]["error"] +"</dd></dl>"
	}
	$(div_element).html(data_html);
}

$("button",'#result-area').click(function() {
	$("#result-area").hide();
});

function search_button_effects(is_search_in_progress) {
	$("button[type='submit']",$('#query-form')).disabled = is_search_in_progress
	if(is_search_in_progress) {
		$('#query-progress').find("div").show();
	} else {
		$('#query-progress').find("div").hide();
	}
	var temp = $("i" ,$("button[type='submit']", $('#query-form')));
	temp.removeClass(is_search_in_progress ? 'icon-search' : 'icon-stop');
	temp.addClass(is_search_in_progress ? 'icon-stop' : 'icon-search');
}

function add_error_message(add) {
	if(add)
		$('#error').text("Error in fetching the rows");
	else
		$('#error').text("");
}
