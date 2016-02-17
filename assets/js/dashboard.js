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
  var dashboardId = getParameterByName('dashboard-id')
  var spreadsheetURL = 'https://spreadsheets.google.com/feeds/list/1G9ZzDI90ysjLiQtAgIpEVbdcZ4s9RgYFBnWaQKOYg40/' + dashboardId + '/public/basic?alt=json-in-script'
  $.ajax({
    url: spreadsheetURL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: "callback",
  })
  .done(function (data) {
    console.log(data)
    $('.post-name').html(data.feed.title.$t + ' <a class="post-link" href="' + data.feed.entry[0].content.$t.split('posturl: ')[1].split(',')[0] + '">Post link</a>')
    $('#reach').html(data.feed.entry[0].content.$t.split('reach: ')[1].split(',')[0])
    $('#clicks').html(data.feed.entry[0].content.$t.split('clicks: ')[1].split(',')[0])
    $('#engagement').html(data.feed.entry[0].content.$t.split('engagement: ')[1].split(',')[0])
    $('#ie').html(data.feed.entry[0].content.$t.split('incomegenerated: ')[1])
    $('#cost').html(data.feed.entry[0].content.$t.split('cost: ')[1].split(',')[0] + '$')
    $('.last-update').html('Last update: ' + data.feed.entry[0].updated.$t.replace('T', ' ').split('.')[0])
  })
})