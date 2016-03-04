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
  $('.dashboard-detail').hide()
  $('.dashboard').css('height', '280px')
  $('.dashboard-section').last().css('border', 'none')
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
      $('.sidebox').hide()
      $('.dashboard').css('height', 'auto')
      $('.dashboard-detail').show()
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
      } else {
        $('.sidebox-tumblr').remove()
      }

      if (!reach) $('#reach').parent().parent().remove()
      if (!clicks) $('#clicks').parent().parent().remove()
      if (!engagement) $('#engagement').parent().parent().remove()
      if (!ie) $('#ie').parent().parent().remove()
      if (!cost) $('#cost').parent().parent().remove()

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
        if (reach.charAt(0) === '0') {
          reach = '0'
        } else {      
          reach = reach.replace(',', '.')
          reach = reach.replace('.', ' ')
          var tmpR = reach
          var rx = /(\d+)(\d{3})/
          if (tmpR.length >= 5) {
            tmpR = tmpR.replace('.', ' ')
            while (rx.test(tmpR)) {
               tmpR = tmpR.replace(rx, '$1 $2')
            }
          } else {
            tmpR = tmpR.split('.')[0]
          }
          reach = tmpR
        }
      }
      if (clicks) {
        if (clicks.charAt(0) === '0') {
          clicks = '0'
        } else {
          clicks = clicks.replace(',', '.')
          var tmpC = clicks
          var rx = /(\d+)(\d{3})/
          if (tmpC.length >= 5) {
            tmpC = tmpC.replace('.', ' ')
            while (rx.test(tmpC)) {
               tmpC = tmpC.replace(rx, '$1 $2')
            }
          } else {
            tmpC = tmpC.split('.')[0]
          }
          clicks = tmpC
        }
      }
      if (engagement) engagement = Math.round(100 * engagement) + '%'
      if (ie) {
        if (ie.charAt(0) === '0') {
          ie = '$0'
        } else {
          if (ie.charAt(ie.length - 1) === '$') {
            ie = ie.split(ie.charAt(ie.length - 1))[0]
          }
          if (ie[0] !== '$') {
            ie = '$' + ie.split('.')[0]
          } else {
            ie = ie.split('.')[0]
          }
          ie = ie.replace(',', '.')
          if (ie.substr(ie.length - 1) === '$') {
            ie = ie.replace('$', '')
          }
          var tmpIE = ie
          var rx = /(\d+)(\d{3})/
          if (tmpIE.length >= 5) {
            tmpIE = tmpIE.replace('.', ' ')
            while (rx.test(tmpIE)) {
               tmpIE = tmpIE.replace(rx, '$1 $2')
            }
          } else {
            tmpIE = tmpIE.split('.')[0]
          }
          ie = tmpIE
        }
      }
      if (cost) {
        if (cost.charAt(0) === '0') {
          cost = '$0'
        } else {   
          if (cost.charAt(cost.length - 1) === '$') {
            cost = cost.split(cost.charAt(cost.length - 1))[0]
          }
          if (cost[0] !== '$') {
            cost = '$' + cost.split('.')[0]
          } else {
            cost = cost.split('.')[0]
          }
          if (cost.length <= 5) {
            cost = cost.replace('.', ' ')
          }
          cost = cost.replace(',', '.')
          var tmpCo = cost
          var rx = /(\d+)(\d{3})/
          if (tmpCo.length >= 5) {
            tmpCo = tmpCo.replace('.', ' ')
            while (rx.test(tmpCo)) {
               tmpCo = tmpCo.replace(rx, '$1 $2')
            }
          } else {
            tmpCo = tmpCo.split('.')[0]
          }
          cost = tmpCo
        }
      }

      var i = 0
      var j = 0
      var k = 0
      var l = 0
      var m = 0

      if (reach) {
        var reachTimer = setInterval(function () {
          var tmpReach = reach.replace(',', '')
          if (parseInt(tmpReach) <= 10) i++
          if (parseInt(tmpReach) <= 100 && parseInt(tmpReach) >= 10) i += 10
          if (parseInt(tmpReach) <= 1000 && parseInt(tmpReach) >= 100) i += 10
          if (parseInt(tmpReach) <= 10000 && parseInt(tmpReach) >= 1000) i += 100
          if (parseInt(tmpReach) <= 100000 && parseInt(tmpReach) >= 10000) i += 200
          if (parseInt(tmpReach) <= 1000000 && parseInt(tmpReach) >= 100000) i += 10000
          $('#reach').html(i)

          if (i > parseInt(tmpReach)) {
            clearInterval(reachTimer)
            $('#reach').html(reach)
          }
        }, 1)
      }

      if (clicks) {
        var clicksTimer = setInterval(function () {
          var tmpClicks = clicks.replace(' ', '')
          if (parseInt(tmpClicks) <= 10) j++
          if (parseInt(tmpClicks) <= 100 && parseInt(tmpClicks) >= 10) j += 10
          if (parseInt(tmpClicks) <= 1000 && parseInt(tmpClicks) >= 100) j += 10
          if (parseInt(tmpClicks) <= 10000 && parseInt(tmpClicks) >= 1000) j += 100
          if (parseInt(tmpClicks) <= 100000 && parseInt(tmpClicks) >= 10000) j += 200
          $('#clicks').html(j)

          if (j > parseInt(tmpClicks)) {
            clearInterval(clicksTimer)
            $('#clicks').html(clicks)
          }
        }, 1)
      }

      if (engagement) {        
        var engagementTimer = setInterval(function () {
          var tmpEngagement = engagement.replace('%', '')
          k++
          $('#engagement').html(k + '%')
          if (k > parseInt(tmpEngagement)) {
            clearInterval(engagementTimer)
            $('#engagement').html(engagement)
          }
        }, 30)
      }

      if (ie) {
        var ieTimer = setInterval(function () {
          var tmpIe = ie.replace('$', '').replace(' ', '')
          if (parseInt(tmpIe) <= 10) l++
          if (parseInt(tmpIe) <= 100 && parseInt(tmpIe) >= 10) l += 10
          if (parseInt(tmpIe) <= 1000 && parseInt(tmpIe) >= 100) l += 10
          if (parseInt(tmpIe) <= 10000 && parseInt(tmpIe) >= 1000) l += 100
          if (parseInt(tmpIe) <= 100000 && parseInt(tmpIe) >= 10000) l += 200
          $('#ie').html('$' + l)

          if (l > parseInt(tmpIe)) {
            clearInterval(ieTimer)
            $('#ie').html(ie)
          }
        }, 1)
      }

      if (cost) {
        var costTimer = setInterval(function () {
          var tmpCost = cost.replace('$', '').replace(' ', '')
          if (parseInt(tmpCost) <= 10) m++
          if (parseInt(tmpCost) <= 100 && parseInt(tmpCost) >= 10) m += 10
          if (parseInt(tmpCost) <= 1000 && parseInt(tmpCost) >= 100) m += 10
          if (parseInt(tmpCost) <= 10000 && parseInt(tmpCost) >= 1000) m += 100
          if (parseInt(tmpCost) <= 100000 && parseInt(tmpCost) >= 10000) m += 200
          $('#cost').html('$' + m)

          if (m > parseInt(tmpCost)) {
            clearInterval(costTimer)
            $('#cost').html(cost)
          }
        }, 1)
      }

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
