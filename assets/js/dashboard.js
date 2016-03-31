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
  if (value[0] === '0' && value[1] !== '') return formatThousands(value.substring(1))
  if (value[0] === '$') return formatThousands(value.split(value[0])[1].split('.')[0])
  if (/\$$/.test(value)) return formatThousands(value.split(value.charAt(value.length - 1))[0])
  if (value[0] !== '$') return formatThousands(value.split('.')[0].replace(',', ' '))
  else return formatThousands(value.split('.')[0])
}

function formatPercentage (value) {
  if (value.charAt(1) === ',') return value.replace(',', '.')
  return Math.round(100 * value).toString()
}

function formatThousands (value) {
  if (value.length >= 5) {
    var rx = /(\d+)(\d{3})/
    while (rx.test(value)) return (value[0] === '0' && value[1] !== '') ? value.replace(rx, '$1 $2').substring(1) : value.replace(rx, '$1 $2')
  } else {
    return value.split('.')[0]
  }
  return value.replace(',', '.').replace('.', ' ')
}

function setDashboardElements (date) {
  var settings = {1: {className: 'one'}, 2: {className: 'two'}, 3: {className: 'three'}, 4: {className: 'four'}}
  if (settings[$('.dashboard-section').length]) {
    $('.dashboard-section').addClass(settings[$('.dashboard-section').length].className)
  }
  $('.last-update').html('Last update: ' + date.split(':')[0] + ':' + date.split(':')[1])
  $('.dashboard-name').show()
  $('.dashboard-detail').children().show()
}

function incrementValues (tag, target, iterationNumber) {
  var tmp = target.replace(/[\s|,|.|$|%]/g, '')
  if (tmp !== '0') {
    var currentValue = 0
    var timer = setInterval(function () {
      currentValue += (parseInt(tmp, 10) / iterationNumber)
      tag.html(Math.round(currentValue))

      if (currentValue >= parseInt(tmp, 10)) {
        clearInterval(timer)
        tag.html(target)
      }
    }, 50, iterationNumber)
  } else {
    clearInterval(timer)
    tag.html('0')
  }
}

function displayElements (data) {
  $('.sidebox').hide()
  $('.dashboard').css('height', 'auto')
  $('.dashboard-detail').show()
  if (!data.feed.entry) document.location = '/error'

  if (data.feed.entry[0].gsx$reach) incrementValues($('#reach'), formatThousands(data.feed.entry[0].gsx$reach.$t), 7)
  else $('#reach').parent().parent().remove()

  if (data.feed.entry[0].gsx$clicks) incrementValues($('#clicks'), formatThousands(data.feed.entry[0].gsx$clicks.$t), 7)
  else $('#clicks').parent().parent().remove()

  if (data.feed.entry[0].gsx$incomegenerated) incrementValues($('#ie'), formatMoney(data.feed.entry[0].gsx$incomegenerated.$t), 7)
  else $('#ie').parent().parent().remove()

  if (data.feed.entry[0].gsx$engagement) incrementValues($('#engagement'), formatPercentage(data.feed.entry[0].gsx$engagement.$t), 7)
  else $('#engagement').parent().parent().remove()

  if (data.feed.entry[0].gsx$cost) incrementValues($('#cost'), formatMoney(data.feed.entry[0].gsx$cost.$t), 7)
  else $('#cost').parent().parent().remove()

  if (data.feed.author[0].email.$t.substr(-11) !== '@viewrz.com') document.location = '/error'

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
