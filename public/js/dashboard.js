$(function() {

    $(".table").DataTable();

    $("#addModal input[name='password'], #addModal input[name='confirmPassword']").on("change", function() {
        if($("#addModal input[name='password']").val() === $("#addModal input[name='confirmPassword']").val()) {
            $("#addModal button[type='submit']").removeAttr("disabled")
        } else if($("#addModal input[name='password']").val() === "" && $("#addModal input[name='confirmPassword']").val() === ""){
            $("#addModal button[type='submit']").attr("disabled", true)
        } else {
            $("#addModal button[type='submit']").attr("disabled", true)
        }
    })

    $("#genres").tagEditor();

    $("#thumbnail").on("change", function() {
        $("#preview").attr("src", window.URL.createObjectURL(this.files[0]));

        $("#preview ").removeAttr("hidden");
    })



})