var content = {}
var reach
var clicks
var ie
var engagement
var cost
var postURL
var embedKey

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
  var spreadsheetData = data.feed.entry[0].content.$t

  var re = /(\w+): (.+?(?=(?:, \w+:|$)))/mgi;
  var contentArray = re.exec(spreadsheetData)
  while (contentArray != null) {
    var propName = contentArray[1]
    var propValue = contentArray[2]

    content[propName] = propValue
    contentArray = re.exec(spreadsheetData)
  }

  if (content["posturl"] || content["embedkey"] || content["reach"] || content["clicks"] || content["incomegenerated"] || content["cost"]) {
    postURL = content["posturl"]
    embedKey = content["embedkey"]
    reach = content["reach"]
    clicks = content["clicks"]
    ie = content["incomegenerated"]
    engagement = content["engagement"]
    cost = content["cost"]
  } else if (!content["posturl"] && content["embedkey"] && content["reach"] && content["clicks"] && content["incomegenerated"] && content["cost"]) {
    document.location = '/error'
  }
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
    
    if (ie) ie = '$' + ie.replace('$', '')
    if (cost) cost = '$' + cost.replace('$', '')
    if (engagement) engagement = Math.round(100 * engagement) + '%'
    
    if (embedKey) {
      if (/[a-zA-Z0-9-_]+$/.test(embedKey) && embedKey.indexOf("/") > -1) {
        $('.embed').html('<div class="tumblr-post" data-href="https://embed.tumblr.com/embed/post/' + embedKey + '"></div><script async src="https://secure.assets.tumblr.com/post.js"></script>')
      }
    } 

    if (!reach || /[a-zA-Z]/.test(reach)) $("#reach").parent().parent().remove()
    if (!clicks || /[a-zA-Z]/.test(clicks)) $("#clicks").parent().parent().remove()
    if (!engagement || /[a-zA-Z]/.test(engagement)) $("#engagement").parent().parent().remove()
    if (!ie || /[a-zA-Z]/.test(ie)) $("#ie").parent().parent().remove()
    if (!cost || /[a-zA-Z]/.test(cost)) $("#cost").parent().parent().remove()

    if (!$('#reach').html() && !$('#clicks').html() && !$('#engagement').html() && !$('#ie').html() && !$('#cost').html()) {
      $('.dashboard').css('height', 'auto')
    }

    $('.dashboard-name').html(data.feed.title.$t + ' <a class="post-link" href="' + postURL + '">Post link</a>')
    $('#reach').html(reach)
    $('#clicks').html(clicks)
    $('#engagement').html(engagement)
    $('#ie').html(ie)
    $('#cost').html(cost)

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