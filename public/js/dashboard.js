$(function() {

    $(".table").DataTable();

    $("#addAdminModal input[name='password'], #addAdminModal input[name='confirmPassword']").on("change", function() {
        if($("#addAdminModal input[name='password']").val() === $("#addAdminModal input[name='confirmPassword']").val()) {
            $("#addAdminModal button[type='submit']").removeAttr("disabled")
        } else if($("#addAdminModal input[name='password']").val() === "" && $("#addAdminModal input[name='confirmPassword']").val() === ""){
            $("#addAdminModal button[type='submit']").attr("disabled", true)
        } else {
            $("#addAdminModal button[type='submit']").attr("disabled", true)
        }
    })


})