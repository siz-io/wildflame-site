/* globals $, document */

function getParameterByName (name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  var results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function formatMoney (value) {
  if (value) {
    if (value.charAt(0) === '0') {
      return '$0'
    } else {
      if (value.charAt(value.length - 1) === '$') {
        return value.split(value.charAt(value.length - 1))[0]
      }
      if (value[0] !== '$') {
        return '$' + value.split('.')[0].replace(',', ' ')
      } else {
        return value.split('.')[0]
      }
      value.replace(',', '.')
      if (value.substr(value.length - 1) === '$') {
        return value.replace('$', '')
      }
      var rx = /(\d+)(\d{3})/
      if (value.length >= 5) {
        while (rx.test(value)) {
          return value.replace(rx, '$1 $2')
        }
      } else {
        return value.split('.')[0]
      }
    }
  }
}

function formatPercentage (value) {
  if (value.charAt(1) === ',') return value.replace(',', '.')
  return Math.round(100 * value) + '%'
}

function formatThousands (value) {
  if (value.charAt(0) === '0') {
    return '0'
  } else {
    var rx = /(\d+)(\d{3})/
    if (value.length >= 5) {
      while (rx.test(value)) {
        return value.replace(rx, '$1 $2')
      }
    } else {
      return value.split('.')[0]
    }
    return value.replace(',', '.').replace('.', ' ')
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

function incrementValues (tag, data, duration) {
  if (data) {
    var i = 0
    var result = /[\s|,|.|$|%]/g.exec(data)
    var timer = setInterval(function () {
      var tmp = data.replace(/[\s|,|.|$|%]/g, '')
      if (tmp !== '0') {
        if (parseInt(tmp, 10) <= 10) i++
        if (parseInt(tmp, 10) <= 100 && parseInt(tmp, 10) >= 10) i += 10
        if (parseInt(tmp, 10) <= 1000 && parseInt(tmp, 10) >= 100) i += 10
        if (parseInt(tmp, 10) <= 10000 && parseInt(tmp, 10) >= 1000) i += 100
        if (parseInt(tmp, 10) <= 100000 && parseInt(tmp, 10) >= 10000) i += 200
        if (parseInt(tmp, 10) <= 1000000 && parseInt(tmp, 10) >= 100000) i += 10000
        tag.html(i)

        if (i > parseInt(tmp, 10)) {
          clearInterval(timer)
          tag.html(data)
        }
      } else {
        clearInterval(timer)
        if (result) {
          if (result[0] === '$') tag.html('$0')
          if (result[0] === '%') tag.html('0%')
        } else {
          tag.html('0')
        }
      }
    }, duration)
  }
}

function displayElements (data) {
  $('.sidebox').hide()
  $('.dashboard').css('height', 'auto')
  $('.dashboard-detail').show()
  if (!data.feed.entry) document.location = '/error'

  if (data.feed.entry[0].gsx$reach) {
    incrementValues($('#reach'), formatThousands(data.feed.entry[0].gsx$reach.$t), 1)
  } else {
    $('#reach').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$clicks) {
    incrementValues($('#clicks'), formatThousands(data.feed.entry[0].gsx$clicks.$t), 1)
  } else {
    $('#clicks').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$incomegenerated) {
    incrementValues($('#ie'), formatMoney(data.feed.entry[0].gsx$incomegenerated.$t), 1)
  } else {
    $('#ie').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$engagement) {
    incrementValues($('#engagement'), formatPercentage(data.feed.entry[0].gsx$engagement.$t), 30)
  } else {
    $('#engagement').parent().parent().remove()
  }

  if (data.feed.entry[0].gsx$cost) {
    incrementValues($('#cost'), formatMoney(data.feed.entry[0].gsx$cost.$t), 1)
  } else {
    $('#cost').parent().parent().remove()
  }

  var email = data.feed.author[0].email.$t.substr(-11)
  if (email !== '@viewrz.com') document.location = '/error'

  if (data.feed.entry[0].gsx$posturl) {
    $('.dashboard-name').html(data.feed.title.$t + ' <a class="post-link" href="' + data.feed.entry[0].gsx$posturl.$t + '" target="_blank">Post link</a>')
  } else {
    $('.dashboard-name').html(data.feed.title.$t)
    $('.dashboard-name').css('padding-left', '0')
  }
  if (data.feed.entry[0].gsx$embedkey) {
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
      displayElements(data)
    })
    .fail(function () {
      document.location = '/error'
    })
})
