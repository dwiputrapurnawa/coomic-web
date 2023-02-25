$(function() {
    
    let date = new Date();
    
    $("#date").text("© " + date.getFullYear() + " Coomic, Inc")


    $("#searchButton").on("click", function() {
        let genreSelected = [];
        let statusSelected;
        let typeSelected;
        let orderSelected;

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

        $("input[name='selectedGenre']").val(genreSelected);
        $("input[name='selectedStatus']").val(statusSelected);
        $("input[name='selectedType']").val(typeSelected);
        $("input[name='selectedOrder']").val(orderSelected);
    })

})