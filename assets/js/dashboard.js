/* globals $, document */
var reach
var clicks
var ie
var engagement
var cost
var postURL
var embedKey

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

$(document).ready(function () {
  $('.dashboard-name').hide()
  $('.dashboard-detail').children().hide()
  var dashboardID = getParameterByName('dashboard-id')
  var reportID = getParameterByName('report-id')
  var URL = 'https://spreadsheets.google.com/feeds/list/' + reportID + '/' + dashboardID + '/public/full?alt=json-in-script'

  $.ajax({
    url: URL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback'
  })
    .done(function (data) {
      if (!data.feed.entry) document.location = '/error'
      if (data.feed.entry[0].gsx$posturl) postURL = data.feed.entry[0].gsx$posturl.$t
      if (data.feed.entry[0].gsx$embedkey) embedKey = data.feed.entry[0].gsx$embedkey.$t
      if (data.feed.entry[0].gsx$reach) reach = data.feed.entry[0].gsx$reach.$t
      if (data.feed.entry[0].gsx$clicks) clicks = data.feed.entry[0].gsx$clicks.$t
      if (data.feed.entry[0].gsx$incomegenerated) ie = data.feed.entry[0].gsx$incomegenerated.$t
      if (data.feed.entry[0].gsx$engagement) engagement = data.feed.entry[0].gsx$engagement.$t
      if (data.feed.entry[0].gsx$cost) cost = data.feed.entry[0].gsx$cost.$t
      var email = data.feed.author[0].email.$t.substr(-11)
      if (email !== '@viewrz.com') document.location = '/error'
      if (embedKey) {
        if (/[a-zA-Z0-9-_]+$/.test(embedKey) && embedKey.indexOf('/') > -1) {
          $('.embed').html('<div class="tumblr-post" data-href="https://embed.tumblr.com/embed/post/' + embedKey + '"></div><script async src="https://secure.assets.tumblr.com/post.js"></script>')
        }
      }
      if (!reach || /[a-zA-Z]/.test(reach)) $('#reach').parent().parent().remove()
      if (!clicks || /[a-zA-Z]/.test(clicks)) $('#clicks').parent().parent().remove()
      if (!engagement || /[a-zA-Z]/.test(engagement)) $('#engagement').parent().parent().remove()
      if (!ie || /[a-zA-Z]/.test(ie)) $('#ie').parent().parent().remove()
      if (!cost || /[a-zA-Z]/.test(cost)) $('#cost').parent().parent().remove()

      if (!$('#reach').html() && !$('#clicks').html() && !$('#engagement').html() && !$('#ie').html() && !$('#cost').html()) {
        $('.dashboard').css('height', 'auto')
      }

      if (postURL) {
        $('.dashboard-name').html(data.feed.title.$t + ' <a class="post-link" href="' + postURL + '" target="_blank">Post link</a>')
      } else {
        $('.dashboard-name').html(data.feed.title.$t)
        $('.dashboard-name').css('padding-left', '0')
      }

      if (reach && reach !== 0) {
        reach = reach.replace(',', ' ')
        reach = reach.replace('.', ',')
        var tmp = reach
        var rx = /(\d+)(\d{3})/
        while (rx.test(tmp)) {
          tmp = tmp.replace(rx, '$1 $2')
        }
        reach = tmp
      }
      if (clicks) {
        clicks = clicks.replace(',', ' ')
        clicks = clicks.replace('.', ',')
        var tmp = clicks
        var rx = /(\d+)(\d{3})/
        while (rx.test(tmp)) {
          tmp = tmp.replace(rx, '$1 $2')
        }
        clicks = tmp
      }
      if (engagement) engagement = Math.round(100 * engagement) + '%'
      if (ie) {
        ie = ie.replace(',', ' ')
        ie = ie.replace('.', ',')
        if (ie.substr(ie.length - 1) === '$') {
          ie = ie.replace('$', '')
        }
        if (ie[0] !== '$') {
          ie = '$' + ie.split('.')[0]
        } else {
          ie = ie.split('.')[0]
        }
        var tmp = ie
        var rx = /(\d+)(\d{3})/
        while (rx.test(tmp)) {
          tmp = tmp.replace(rx, '$1 $2')
        }
        ie = tmp
      }
      if (cost) {
        cost = cost.replace(',', ' ')
        cost = cost.replace('.', ',')
        if (cost[0] !== '$') {
          cost = '$' + cost.split('.')[0]
        } else {
          cost = cost.split('.')[0]
        }
      }


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
