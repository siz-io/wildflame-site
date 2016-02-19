var content = {}
var reach
var clicks
var ie
var engagement
var cost

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getContent (data) {
  data = data.feed.entry[0].content.$t

  var re = /(\w+): (.+?(?=(?:, \w+:|$)))/mgi;
  var contentArray = re.exec(data)
  while (contentArray != null) {
    var propName = contentArray[1]
    var propValue = contentArray[2]

    content[propName] = propValue
    contentArray = re.exec(data)
  }

  reach = content["reach"]
  clicks = content["clicks"]
  ie = '$' + content["incomegenerated"].replace('$', '')
  engagement = content["engagement"]
  engagement = Math.round(100 * engagement) + '%'
  cost = '$' + content["cost"]
}

$(document).ready(function() {

  $('.dashboard-name').hide()
  $('.dashboard-detail').children().hide()
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
    getContent(data)
    var email = data.feed.author[0].email.$t.substr(-11)
    if (email !== "@viewrz.com") document.location = '/error'
    

    $('.dashboard-name').html(data.feed.title.$t + ' <a class="post-link" href="' + data.feed.entry[0].content.$t.split('posturl: ')[1].split(',')[0] + '">Post link</a>')
    $('#reach').html(reach)
    $('#clicks').html(clicks)
    $('#engagement').html(engagement)
    $('#ie').html(ie)
    $('#cost').html(cost)

    if (reach === "0") $("#reach").parent().parent().remove()
    if (clicks === "0") $("#clicks").parent().parent().remove()
    if (engagement === "0%" || engagement === "0.0") $("#engagement").parent().parent().remove()
    if (ie === "$0") $("#ie").parent().parent().remove()
    if (cost === "$0") $("#cost").parent().parent().remove()

    if ($('.dashboard-section').length === 4) {
      $('.dashboard-section').css('width', '24.2%')
      $('.dashboard-section').addClass('four')
    }

    if ($('.dashboard-section').length === 3) {
      $('.dashboard-section').css('width', '33.1%')
      $('.dashboard-section').addClass('three')
    }

    if ($('.dashboard-section').length === 2) {
      $('.dashboard-section').css('width', '49.2%')
      $('.dashboard-section').addClass('two')
    }

    if ($('.dashboard-section').length === 1) {
      $('.dashboard-section').css('width', '101%')
      $('.dashboard-section').addClass('one')
    }
    var date = new Date(data.feed.entry[0].updated.$t).toString()
    date = date.split(':')[0] + ':' + date.split(':')[1]

    $('.last-update').html('Last update: ' + date)
    $('.dashboard-name').show()
    $('.dashboard-detail').children().show()
  })
  .fail(function () {
    document.location = '/error'
  })
})