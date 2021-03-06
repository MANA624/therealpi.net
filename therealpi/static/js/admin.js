function switch_proxy(enabling){
    $.ajax({
        data: {
            "is_enable": enabling
        },
        type: "POST",
        dataType: 'json',
        url: "_proxy_switch",
    }).done(function(data){
        $("#proxy-status").html(data.status);
        createAlert("success", "Success!", data.message)
    }).fail(function(data){
        createAlert("danger", "Oops!", data.responseText)
    });
}

$(document).ready(function(){

    $("#create-user-form").submit(function(event){
        $("#add-user-error-text").html("");
        var form = document.getElementById('create-user-form');
        if(form.checkValidity() == false){
            return false
        }
        else if($("#pass").val() !== $("#confirm-pass").val()){
            $("#add-user-error-text").html("Passwords do not match!");
            return false;
        }
        else{
            var privileges = [''];
            if($("#roommate-checkbox").is(":checked")){
                privileges.push("roommate")
            }
            if($("#employer-checkbox").is(":checked")){
                privileges.push("employer")
            }
            if($("#admin-checkbox").is(":checked")){
                privileges.push("admin")
            }
            $.ajax({
                data: {
                    "username": $("#user").val(),
                    "password": $("#pass").val(),
                    "other": privileges
                },
                type: "POST",
                url: "_create_user",
                traditional: true
            }).done(function(data){
                // window.location = "/admin";
                $("#create-user-form")[0].reset();
                createAlert("success", "Success!", data)
            }).fail(function(data){
                createAlert("danger", "Oops!", data.responseText)
            });
            event.preventDefault();

        }
    });

    $("#create-job-form").submit(function(event){
        var form = $('#create-job-form');
        if(form[0].checkValidity() == false){
            return false
        }
        else{
            $.ajax({
                data: {
                    "heading": $("#heading").val(),
                    "dates_worked": $("#dates").val(),
                    "job_title": $("#title").val(),
                    "job_description": $("#description").val()
                },
                type: "POST",
                url: "_create_job"
            }).done(function(data){
                // window.location = "/admin";
                $("#create-job-form")[0].reset();
                createAlert("success", "Success!", data)
            }).fail(function(data){
                createAlert("danger", "Oops!", data.responseText)
            });
            event.preventDefault();
        }
    });

    $("#edit-job-form").submit(function(event){
        var form = $('#edit-job-form');
        if(form[0].checkValidity() == false){
            return false;
        }
        else{
            $.ajax({
                data: {
                    "old_title": $("#old-job-title").val(),
                    "job_title": $("#new-job-title").val(),
                    "dates_worked": $("#new-dates").val(),
                    "heading": $("#new-heading").val(),
                    "order": $("#new-order").val(),
                    "job_description": $("#new-description").val()
                },
                type: "POST",
                url: "_edit_job"
            }).done(function(data){
                form[0].reset();
                createAlert("success", "Success!", data)
            }).fail(function(data){
                createAlert("danger", "Oops!", data.responseText)
            });
            event.preventDefault();
        }
    });
});