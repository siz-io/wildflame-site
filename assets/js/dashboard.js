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
  $('.post-name').hide()
  $('.post-detail').children().hide()
  var dashboardID = getParameterByName('dashboard-id')
  var reportID = getParameterByName('report-id')
  var URL = 'https://spreadsheets.google.com/feeds/list/' + reportID + '/' + dashboardID + '/public/basic?alt=json-in-script'
  
  $.ajax({
    url: URL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: "callback",
  })
  .done(function (data) {
    console.log(data)
    var reach = data.feed.entry[0].content.$t.split('reach: ')[1].split(',')[0]
    var clicks = data.feed.entry[0].content.$t.split('clicks: ')[1].split(',')[0]
    var engagement = data.feed.entry[0].content.$t.split('engagement: ')[1].split(',')[0]
    var ie = data.feed.entry[0].content.$t.split('incomegenerated: ')[1]
    var cost = data.feed.entry[0].content.$t.split('cost: ')[1].split(',')[0]
    
    $('.post-name').html(data.feed.title.$t + ' <a class="post-link" href="' + data.feed.entry[0].content.$t.split('posturl: ')[1].split(',')[0] + '">Post link</a>')
    $('#reach').html(reach)
    $('#clicks').html(clicks)
    $('#engagement').html(engagement)
    $('#ie').html(ie)
    $('#cost').html(cost)

    if (reach === "0") $("#reach").parent().parent().remove()
    if (clicks === "0") $("#clicks").parent().parent().remove()
    if (engagement === "0") $("#engagement").parent().parent().remove()
    if (ie === "0$") $("#ie").parent().parent().remove()
    if (cost === "0") $("#cost").parent().parent().remove()

    if ($('.post-section').length === 4) {
      $('.post-section').css('width', '24.2%')
      $('.post-section').addClass('four')
    }

    if ($('.post-section').length === 3) {
      $('.post-section').css('width', '33.1%')
      $('.post-section').addClass('three')
    }

    if ($('.post-section').length === 2) {
      $('.post-section').css('width', '49.2%')
      $('.post-section').addClass('two')
    }

    if ($('.post-section').length === 1) {
      $('.post-section').css('width', '101%')
      $('.post-section').addClass('one')
    }

    $('.last-update').html('Last update: ' + data.feed.entry[0].updated.$t.replace('T', ' ').split('.')[0].substring(0, 16))
    $('.post-name').show()
    $('.post-detail').children().show()
  })
  .fail(function () {
    document.location = '/error'
  })
})