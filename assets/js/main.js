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
  var URL = 'https://spreadsheets.google.com/feeds/worksheets/' + reportID + '/public/basic?alt=json-in-script'

  $.ajax({
    url: URL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: "callback",
  })
  .done(function (data) {
    var email = data.feed.author[0].email.$t.substr(-11)
    if (email !== "@viewrz.com") document.location = '/error'
    
    $('.report-name').html(data.feed.title.$t)
    
    for (var i = 0; i < data.feed.entry.length; i++) {
      $('.list').append('<a class=list-link href="dashboard.html?report-id=' + reportID + '&dashboard-id=' + data.feed.entry[i].id.$t.split('/basic/')[1] + '">' + data.feed.entry[i].title.$t + '<span class="arrow">></span></a>')
    }

    $('.list-link').first().css('margin-top', '15px')
  })
})