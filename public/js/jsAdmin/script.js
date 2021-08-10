$(document).ready(function () {
  $(".data-user-table").each(function (_, table) {
    $(table).DataTable({
      "columns": [
        { "width": "5%" },
        { "width": "20%" },
        { "width": "25%" },
        { orderable: false,"width": "30%" },
        { "width": "15%" },
        { orderable: false,"width": "5%" }
      ]
      
    });

  });
  $(".data-writer-table").each(function (_, table) {
    $(table).DataTable({
      "columns": [
        { "width": "5%" },
        { "width": "20%" },
        { "width": "25%" },
        { "width": "15%" },
        { orderable: false,"width": "30%" },
        { orderable: false,"width": "5%" }
      ]
      
    });

  });
  $(".data-editAdmin-table").each(function (_, table) {
    $(table).DataTable({
      "columns": [
        { "width": "5%" },
        { "width": "25%" },
        { "width": "30%" },
        { orderable: false,"width": "35%" },
        { orderable: false,"width": "5%" }
      ]
      
    });

  });
  $(".data-tag-table").each(function (_, table) {
    $(table).DataTable({
      "columns": [
        { "width": "5%" },
        { "width": "90%" },
        { orderable: false,"width": "5%" }
      ]
      
    });

  });

  $(".data-post-table").each(function (_, table) {
    $(table).DataTable({
      "columns": [
        { "width": "5%" },
        { "width": "47%" },
        { "width": "15%" },
        { "width": "12%" },
        { orderable: false,"width": "5%" },
        { orderable: false,"width": "5%" },
        {"width": "11%" }
      ]
      
    });

  });
});


