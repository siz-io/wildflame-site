$(document).ready(function() {
  var spreadsheetURL = 'https://spreadsheets.google.com/feeds/worksheets/1G9ZzDI90ysjLiQtAgIpEVbdcZ4s9RgYFBnWaQKOYg40/public/basic?alt=json-in-script'

  $.ajax({
    url: spreadsheetURL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: "callback",
  })
  .done(function (data) {
    $('.report-name').html(data.feed.title.$t)
    for (var i = 0; i < data.feed.entry.length; i++) {
      $('.list').append('<a class=list-link href="dashboard.html?dashboard-id=' + data.feed.entry[i].id.$t.split('/basic/')[1] + '">' + data.feed.entry[i].title.$t + '<span class="arrow">></span></a>')
    }

    $('.list-link').first().css('margin-top', '15px')
  })
})