/* BEGIN REGION: CALENDAR */

function deleteEvent(id){
    $.ajax({
        data: {
            "_id": id
        },
        type: "POST",
        url: "_delete_event"
    }).done(function(data){
        createAlert("success", "Success!", data);
        $('#calendar').fullCalendar('removeEvents', [id]);
        $(".fc-event").css("background-color", "red");
    }).fail(function(data){
        createAlert("danger", "Oops!", data.responseText);
    });
}

$(document).ready(function () {
    // Make sure that slider is not on delete mode to begin with
    $('#toggle').prop('checked', false);

    // Make the toggle a toggle and not a checkbox
    $(function() {
        $('#toggle').bootstrapToggle({
            on: 'Delete',
            off: 'Regular'
        });
    });

    // Change color of elements when delete mode is active
    $("#toggle").change(function () {
        if($("#toggle").is(":checked")){
            $(".fc-event").css("background-color", "red");
        }
        else{
            $(".fc-event").css("background-color", "#3a87ad");
        }
    });

    // When events are expanded, fix the bug where expanded events don't change color
    $(".fc-more").click(function(){
        if($("#toggle").is(":checked")) {
            $(".fc-event").css("background-color", "red");
        }
    });

    /* END REGION: CALENDAR */
    /* BEGIN REGION: FORM*/
    // Code for the date picker
    $('#datepicker').datepicker({
        uiLibrary: 'bootstrap4'
    });
    $('#datepicker2').datepicker({
        uiLibrary: 'bootstrap4'
    });

    if($("input[name='freq']:checked").val() === "once") {
        $("#second-date").hide();
    }
    $("input[name='freq']").change(function(e){
        if($(this).val() === "once"){
            $("#second-date").hide();
        }
        else{
            $("#second-date").show();
        }
    });

    $(document).on('submit', "#add-event-form", function(event){
        $("#add-event-error-text").html("");
        var form = document.getElementById('add-event-form');
        if(form.checkValidity() == false){
            return false;
        }
        else if($("#datepicker").val() == ""){
            $("#add-event-error-text").html("You must pick a date!");
            return false;
        }
        else if($("input[name='freq']:checked").val() !== "once" && $("#datepicker2").val() == ""){
            $("#add-event-error-text").html("The end date is empty!");
            return false;
        }
        else{
            var title = $("#title").val(),
                special = $("#special").val(),
                date = $("#datepicker").val(),
                hour = $("#hour").val(),
                minute = $("#minute").val(),
                send_text = $("#send-text").is(":checked"),
                freq = $("input[name='freq']:checked").val(),
                end_date = $("#datepicker2").val();
            $.ajax({
                data: {
                    "title": title,
                    "more_info": special,
                    "date": date,
                    "hour": hour,
                    "minute": minute,
                    "send_text": send_text,
                    "freq": freq,
                    "end_date": end_date
                },
                dataType: 'json',
                type: "POST",
                url: "_add_event"
            }).done(function(data){
                $('#add-event-form')[0].reset();
                createAlert("success", "Success!", data.message);
                var eventData = {
                    id: data.event["_id"],
                    title: data.event["title"],
                    start: data.event["start"]
                };
                $('#calendar').fullCalendar('renderEvent', eventData, true);
            }).fail(function(data){
                createAlert("danger", "Oops!", data.responseText)
            });
        }
        event.preventDefault();
    });
});