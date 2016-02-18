function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function() {
  if (!getParameterByName('report-id')) document.location = '/error'
  var reportID = getParameterByName('report-id')
  var spreadsheetURL = 'https://spreadsheets.google.com/feeds/worksheets/' + reportID + '/public/basic?alt=json-in-script'

  $.ajax({
    url: spreadsheetURL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: "callback",
  })
  .done(function (data) {
    $('.report-name').html(data.feed.title.$t)
    for (var i = 0; i < data.feed.entry.length; i++) {
      $('.list').append('<a class=list-link href="dashboard.html?dashboard-id=' + data.feed.entry[i].id.$t.split('/basic/')[1] + '&report-id=' + reportID +'">' + data.feed.entry[i].title.$t + '<span class="arrow">></span></a>')
    }

    $('.list-link').first().css('margin-top', '15px')
  })
})