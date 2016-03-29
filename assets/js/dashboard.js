/* globals $, document */

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function formatMoney (value) {
  if (value) {
    if (value.charAt(0) === '0') {
      value = '$0'
    } else {
      if (value.charAt(value.length - 1) === '$') {
        value = value.split(value.charAt(value.length - 1))[0]
      }
      if (value[0] !== '$') {
        value = '$' + value.split('.')[0]
      } else {
        value = value.split('.')[0]
      }
      value = value.replace(',', '.')
      if (value.substr(value.length - 1) === '$') {
        value = value.replace('$', '')
      }
      var rx = /(\d+)(\d{3})/
      if (value.length >= 5) {
        value = value.replace('.', ' ')
        while (rx.test(value)) {
          value = value.replace(rx, '$1 $2')
        }
      } else {
        value = value.split('.')[0]
      }
      return value
    }
  }
}

function formatPercentage (value) {
  if (value.charAt(1) === ',') {
    value = value.replace(',', '.')
  }
  return Math.round(100 * value) + '%'
}

function formatThousands (value) {
  if (value.charAt(0) === '0') {
    value = '0'
  } else {
    value = value.replace(',', '.')
    value = value.replace('.', ' ')
    var rx = /(\d+)(\d{3})/
    if (value.length >= 5) {
      value = value.replace('.', ' ')
      while (rx.test(value)) {
        value = value.replace(rx, '$1 $2')
      }
    } else {
      value = value.split('.')[0]
    }
    return value
  }
}

function setDashboardElements (date) {
  if ($('.dashboard-section').length === 4) {
    $('.dashboard-section').css('width', '24.2%')
    $('.dashboard-section').addClass('four')
  }

  if ($('.dashboard-section').length === 3) {
    $('.dashboard-section').css('width', '33%')
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
  date = date.split(':')[0] + ':' + date.split(':')[1]

  $('.last-update').html('Last update: ' + date)
  $('.dashboard-name').show()
  $('.dashboard-detail').children().show()
}

function displayElements (data) {
  $('.sidebox').hide()
  $('.dashboard').css('height', 'auto')
  $('.dashboard-detail').show()
  if (!data.feed.entry) document.location = '/error'

  if (data.feed.entry[0].gsx$reach) {
    var i = 0
    var reachTimer = setInterval(function () {
      const tmpReach = data.feed.entry[0].gsx$reach.$t.replace(',', '')
      if (parseInt(tmpReach, 10) <= 10) i++
      if (parseInt(tmpReach, 10) <= 100 && parseInt(tmpReach, 10) >= 10) i += 10
      if (parseInt(tmpReach, 10) <= 1000 && parseInt(tmpReach, 10) >= 100) i += 10
      if (parseInt(tmpReach, 10) <= 10000 && parseInt(tmpReach, 10) >= 1000) i += 100
      if (parseInt(tmpReach, 10) <= 100000 && parseInt(tmpReach, 10) >= 10000) i += 200
      if (parseInt(tmpReach, 10) <= 1000000 && parseInt(tmpReach, 10) >= 100000) i += 10000
      $('#reach').html(i)

      if (i > parseInt(tmpReach, 10)) {
        clearInterval(reachTimer)
        const reach = formatThousands(data.feed.entry[0].gsx$reach.$t)
        $('#reach').html(reach)
      }
    }, 1)
  } else {
    $('#reach').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$clicks) {
    var j = 0
    var clicksTimer = setInterval(function () {
      var tmpClicks = data.feed.entry[0].gsx$clicks.$t.replace(',', '')
      if (parseInt(tmpClicks, 10) <= 10) j++
      if (parseInt(tmpClicks, 10) <= 100 && parseInt(tmpClicks, 10) >= 10) j += 10
      if (parseInt(tmpClicks, 10) <= 1000 && parseInt(tmpClicks, 10) >= 100) j += 10
      if (parseInt(tmpClicks, 10) <= 10000 && parseInt(tmpClicks, 10) >= 1000) j += 100
      if (parseInt(tmpClicks, 10) <= 100000 && parseInt(tmpClicks, 10) >= 10000) j += 200
      $('#clicks').html(j)

      if (j > parseInt(tmpClicks, 10)) {
        clearInterval(clicksTimer)
        const clicks = formatThousands(data.feed.entry[0].gsx$clicks.$t)
        $('#clicks').html(clicks)
      }
    }, 1)
  } else {
    $('#clicks').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$incomegenerated) {
    var l = 0
    var ieTimer = setInterval(function () {
      var tmpIe = data.feed.entry[0].gsx$incomegenerated.$t.replace('$', '').replace(',', '').split('.')[0]
      if (parseInt(tmpIe, 10) <= 10) l++
      if (parseInt(tmpIe, 10) <= 100 && parseInt(tmpIe, 10) >= 10) l += 10
      if (parseInt(tmpIe, 10) <= 1000 && parseInt(tmpIe, 10) >= 100) l += 10
      if (parseInt(tmpIe, 10) <= 10000 && parseInt(tmpIe, 10) >= 1000) l += 100
      if (parseInt(tmpIe, 10) <= 100000 && parseInt(tmpIe, 10) >= 10000) l += 200
      $('#ie').html('$' + l)

      if (l > parseInt(tmpIe, 10)) {
        clearInterval(ieTimer)
        const ie = formatMoney(data.feed.entry[0].gsx$incomegenerated.$t)
        $('#ie').html(ie)
      }
    }, 1)
  } else {
    $('#ie').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$engagement) {
    const engagement = formatPercentage(data.feed.entry[0].gsx$engagement.$t)
    var k = 0
    var engagementTimer = setInterval(function () {
      var tmpEngagement = engagement.replace('%', '')
      k++
      $('#engagement').html(k + '%')
      if (k > parseInt(tmpEngagement, 10)) {
        clearInterval(engagementTimer)
        $('#engagement').html(engagement)
      }
    }, 30)
  } else {
    $('#engagement').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$cost) {
    var m = 0
    var costTimer = setInterval(function () {
      var tmpCost = data.feed.entry[0].gsx$cost.$t.replace('$', '').replace(',', '').split('.')[0]
      if (parseInt(tmpCost, 10) <= 10) m++
      if (parseInt(tmpCost, 10) <= 100 && parseInt(tmpCost, 10) >= 10) m += 10
      if (parseInt(tmpCost, 10) <= 1000 && parseInt(tmpCost, 10) >= 100) m += 10
      if (parseInt(tmpCost, 10) <= 10000 && parseInt(tmpCost, 10) >= 1000) m += 100
      if (parseInt(tmpCost, 10) <= 100000 && parseInt(tmpCost, 10) >= 10000) m += 200
      $('#cost').html('$' + m)

      if (m > parseInt(tmpCost, 10)) {
        clearInterval(costTimer)
        const cost = formatMoney(data.feed.entry[0].gsx$cost.$t)
        $('#cost').html(cost)
      }
    }, 1)
  } else {
    $('#cost').parent().parent().remove()
  }

  const email = data.feed.author[0].email.$t.substr(-11)
  if (email !== '@viewrz.com') document.location = '/error'

  if (data.feed.entry[0].gsx$posturl.$t) {
    $('.dashboard-name').html(data.feed.title.$t + ' <a class="post-link" href="' + data.feed.entry[0].gsx$posturl.$t + '" target="_blank">Post link</a>')
  } else {
    $('.dashboard-name').html(data.feed.title.$t)
    $('.dashboard-name').css('padding-left', '0')
  }
  if (data.feed.entry[0].gsx$embedkey.$t) {
    if (/[a-zA-Z0-9-_]+$/.test(data.feed.entry[0].gsx$embedkey.$t) && data.feed.entry[0].gsx$embedkey.$t.indexOf('/') > -1) {
      $('.embed').html('<div class="tumblr-post" data-href="https://embed.tumblr.com/embed/post/' + data.feed.entry[0].gsx$embedkey.$t + '"></div><script async src="https://secure.assets.tumblr.com/post.js"></script>')
    }
  } else {
    $('.sidebox-tumblr').remove()
  }

  if (!$('#reach').html() && !$('#clicks').html() && !$('#engagement').html() && !$('#ie').html() && !$('#cost').html()) {
    $('.dashboard').css('height', 'auto')
  }

  setDashboardElements(new Date(data.feed.entry[0].updated.$t).toString())
}

$(document).ready(function () {
  $('.dashboard-detail').hide()
  $('.dashboard').css('height', '280px')
  $('.dashboard-section').last().css('border', 'none !important')
  const dashboardID = getParameterByName('dashboard-id')
  const reportID = getParameterByName('report-id')
  const URL = 'https://spreadsheets.google.com/feeds/list/' + reportID + '/' + dashboardID + '/public/full?alt=json-in-script'

  $.ajax({
    url: URL,
    type: 'GET',
    dataType: 'jsonp',
    jsonp: 'callback'
  })
    .done(function (data) {
      displayElements(data)
    })
    .fail(function () {
      document.location = '/error'
    })
})
