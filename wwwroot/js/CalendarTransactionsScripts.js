document.getElementById("irAtrasMes")
    .addEventListener("click", function () {
        alert("Has dado para ir atras");
    });

document.getElementById("irDelanteMes")
    .addEventListener("click", function () {
        alert("Has dado para ir delante");
    });

function FuncionPulsadoTransaction(dateTimeTransaction) {

    alert("Le has dado a " + dateTimeTransaction);
}



$(document).ready(function () {

    $(".button-collapse").sideNav();
});

$(function () {
    // Sidebar toggle behavior
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar, #content').toggleClass('active');
    });
});