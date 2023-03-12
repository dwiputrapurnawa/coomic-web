function setDateFooter() {
    let date = new Date();
    
    $("#date").text("© " + date.getFullYear() + " Coomic, Inc");
}


$(function() {
    

    setDateFooter();



    $("input[type=checkbox], input[type=radio]").on("click", function() {
        
        let checkboxChecked = $("input[type=checkbox]:checked")
        let radioChecked = $("input[type=radio]:checked")

        let totalChecked = checkboxChecked.length + radioChecked.length;

        if(totalChecked === 4) {

            $("#searchButton").removeAttr("disabled");
            
        } else {
            $("#searchButton").attr("disabled", true)
        }

    })
    


    $("#searchButton").on("click", function() {
        let genreSelected = [];
        let statusSelected = "";
        let typeSelected = "";
        let orderSelected = "";

        $.each($("input[name='genre']:checked"), function () { 
             genreSelected.push($(this).val())
        });

        $.each($("input[name='status']:checked"), function () { 
             statusSelected = $(this).val();
        });

        $.each($("input[name='type']:checked"), function () { 
            typeSelected = $(this).val();
       });

       $.each($("input[name='order']:checked"), function () { 
        orderSelected = $(this).val();
    });


    const path = `?genres=${genreSelected}&status=${statusSelected}&type=${typeSelected}&order=${orderSelected}`;
    
    window.location.href = path
    
    })
    

    $("#chapterSelect").on("change", function() {

        const titlePath = $("input[name='titlePath']").val();

        window.location = "/comics/" + titlePath + "/" + $(this).val();
    })

    $("#resetSearch").on("click", function(){

        window.location.href = window.location.href.split("?")[0];
    })


    $(".rate").on("mouseenter", function(){

        if($(this).hasClass("fa-regular")) {
            $(this).removeClass("fa-regular");
            $(this).addClass("fa-solid");
            $(this).addClass("selected")
        } else {
            $(this).removeClass("fa-solid");
            $(this).addClass("fa-regular");
            $(this).removeClass("selected");
        }
        
       
        
    })

    $("#submitRatingForm").on("submit", function(){

        $("input[name='ratingNumber']").val($(".selected").length)

    })
    

    $("#searchBar").on("click", function(){
        const searchValue = $("input[name='search']").val();
        const path = `/?search=${searchValue}`;

        window.location.href = path;
    })

    $("input[name='search']").keypress(function(e) {
        if(e.which == 13) {
            $("#searchBar").trigger("click");
        }
    })

    $(".account").on("mouseenter", function() {
        $(".account .fa-user").removeClass("fa-regular");
        $(".account .fa-user").addClass("fa-solid");
    })

    $(".account").on("mouseleave", function() {
        $(".account .fa-user").removeClass("fa-solid");
        $(".account .fa-user").addClass("fa-regular");
    })


})