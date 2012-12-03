var base_site = "/backend/";

$(document).ready(function(){
	$("#result-area").hide();
});

$('.site-home').click(function() {
	$('#home').show();
});
$('#query-form').submit(function(e) {
	e.preventDefault();
	var form = this;
	var stop_time = $("input[name = 'stop_time']", form).val();
	// TODO : all the basic check like non-negative, empty fields
	// check_fields(form)
	if(!stop_time)
		$("input[name = 'stop_time']", form).val(0);
	$.ajax({
		url : "/backend/get_error_details",
		data : $(":input[value][value!='']",form).serialize(),
		dataType : "json",
		beforeSend: function() {
			pre_query();
		},
		error: function() {
			post_error();
			// enable_query_button();
		},
		success: function(response) {
			post_query_result(response);
		}
	});
});	

function get_daily_error_result(day) {
	var error_name = $("#chart_div_monthly").val().err;
	day = day.replace("-0","-");
	var start_date = new Date(day);
	var start_time_mins = Math.floor((new Date() - new Date(day))/60000);
	var stop_time_mins = start_time_mins > 1440 ? start_time_mins - 1440 : 0;
		$.ajax({
		url : "/backend/get_error_details",
		data : "row_key="+error_name+"&start_time=" + start_time_mins + "&stop_time="+stop_time_mins,
		dataType : "json",
		beforeSend: function() {
			pre_query();
		},
		error: function() {
			post_error();
			// enable_query_button();
		},
		success: function(response) {
			post_query_result(response);
		}
	});
}

function make_counter_query() {
	$("#chart_div").val({type:"yearly"})
	$.ajax({
		url : "/backend/all_error_details",
		data : "type=yearly",
		dataType : "json",
		success : function(response) {
			draw_basic_chart(response);
			// populate the google chart
		},
		error : function(error) {
			$("#chart_div").append("Error : " + error.statusText);
			// notify the user
		}
	});
}

function make_query(duration_type) {
	var error_name = $("#chart_div_monthly").val().err;

	// get the current selected division-type ie "yearly, monthly, daily"

	if(current_selected_type) {
		$.ajax({
			url : "/backend/get_counter",
			data : "row_key="+error_name + "&type=" + current_selected_type + "&cf=" + duration_type,
			dataType : "json",
			success : function(response) {
		        draw_chart(response);
			},
			error : function(response) {
				// notify the user
			}
		});
	}
}

function check_fields(form) {
	var form_params = $(":input[value][value!='']",form).serialize();
	return false;
}

function post_error() {
	$("#result-area").show();
	add_error_message(true);
	enable_query_button();
	flip_icon(false);	
}

function post_query_result(response) {
	$("#result-area").show();
	add_success_results(response);	
	enable_query_button();
	flip_icon(false);
	$("button",'#result-area').show();		
}

$("button",'#result-area').click(function() {
	clear_result();
	$(this).hide();
});

function pre_query() {
	add_error_message(false);
	$("button[type='submit']",$('#query-form')).disabled = true;
	flip_icon(true);
	clear_result();
	$('#query-success').find("div").show();
}

function flip_icon(side) {
	var temp = $("i" ,$("button[type='submit']", $('#query-form')));
	temp.removeClass(side ? 'icon-search' : 'icon-stop');
	temp.addClass(side ? 'icon-stop' : 'icon-search');
}

function enable_query_button() {
	$('#query-success').find("div").hide();
	$("button[type='submit']",$('#query-form')).disabled = false;
}

function add_success_results(data) {
	var data_html = "";
	for(var key in data) {
		data_html = data_html + "<dl><dt>"+ key +"</dt><dd>"+ data[key] +"</dd></dl>"
	}
	$('#result').html(data_html);
}

function clear_result() {
	$('#result').html("");
}

function add_error_message(add) {
	if(add)
		$('#error').text("Error in fetching the rows");
	else
		$('#error').text("");
}
