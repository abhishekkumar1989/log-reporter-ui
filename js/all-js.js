var base_site = "/backend/";

$('.site-home').click(function() {
	$('#home').show();
});
$('#query-form').submit(function(e) {
	e.preventDefault();
	var form = this;
	var stop_time = $("input[name = 'stop_time']", form).val();
	// TODO : all the basic check like non-negative, empty fields
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

function post_error() {
	add_error_message(true);
	enable_query_button();
	flip_icon(false);	
}

function post_query_result(response) {
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
