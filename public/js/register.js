$(function() {
    let date = new Date();
    
    $("#date").text("© " + date.getFullYear() + " Coomic, Inc")

    $("#password, #confirmPassword").on("change", function() {
        if($("#password").val() === $("#confirmPassword").val()) {
            $("#submitButton").removeAttr("disabled")
        } else if($("#password").val() === "" && $("#confirmPassword").val() === ""){
            $("#submitButton").attr("disabled", true)
        } else {
            $("#submitButton").attr("disabled", true)
        }
    })
})