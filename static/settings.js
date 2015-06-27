
var Settings = (function () {
  var settings = {
    'syncers': {
      'default': { interval: 1000, points: 30, last: 0 },
      'delay5s': { interval: 1000, points: 30, last: -5000 }
    },
    'providers': {
      'series01': {
        'initialize': function (self) {
          setInterval(function () {
            this.add({
              points: [parseInt(Math.random() * 11, 10)],
              interval: 1000
            })
          }.bind(self), 1000)
        }
      },
      'series02': {
        'initialize': function (self) {
          setInterval(function () {
            this.add({
              points: [
                parseInt(Math.random() * 6, 10),
                parseInt(Math.random() * 6, 10),
                parseInt(Math.random() * 3, 10) + 2,
                parseInt(Math.random() * 3, 10) + 2,
                parseInt(Math.random() * 3, 10) + 2
              ],
              interval: 1000
            })
          }.bind(self), 5000)
        }
      }
    },
    'charts': {
      'default': {
        'syncer': 'default',
        'interval': 1000,
        'delay': 0,
        'options': {
          'fullWidth': true,
          'series': {}, // Should be overwritten by each chart
          'axisX': {
            'onlyInteger': true,
            'labelInterpolationFnc': function (value, syncer) {
              var timestamp = parseInt((syncer.last - (syncer.interval * value)) / 1000, 10)
              // http://momentjs.com/docs/#/parsing/string-format/
              return (timestamp % 5 === 0) ?
                moment.unix(timestamp).format('mm:ss') : null
            }
          },
          'axisY': {
            'type': Chartist.AutoScaleAxis,
            'onlyInteger': true,
            'low': 0
          }
        },
        'responsiveOptions': []
      },
      'chart01': function () {
        var config = {
          'interval': 2500,
          'series': [
            { 'name': 'another-series-name', 'provider': 'series02' },
            { 'name': 'custom-series-name', 'provider': 'series01' }
          ],
          'options': {
            'series': {
              'another-series-name': {
                'lineSmooth': Chartist.Interpolation.step(),
                'showArea': true,
                'showPoint': false,
                'showLine': false
              },
              'custom-series-name': {
                'lineSmooth': Chartist.Interpolation.simple(),
                'showArea': false,
                'showPoint': true,
                'showLine': false
              }
            }
          }
        }

        return merge(settings.charts.default, config)
      },
      'chart02': function () {
        var config = {
          'series': [
            { 'name': 'different-custom-series-name', 'provider': 'series01' }
          ],
          'options': {
            'series': {
              'different-custom-series-name': {
                'lineSmooth': Chartist.Interpolation.simple(),
                'showArea': false,
                'showPoint': false
              }
            },
            'axisX': {
              'labelInterpolationFnc': function (value, syncer) {
                var timestamp = parseInt((syncer.last - (syncer.interval * value)) / 1000, 10)
                return ((value + 1) % 5 === 0) ?
                  moment.unix(timestamp).format('mm:ss') : (value === 0 ? ' ' : null)
              }
            }
          }
        }

        return merge(settings.charts.default, config)
      },
      'chart03': function () {
        var config = {
          'syncer': 'delay5s',
          'delay': 200,
          'series': [
            { 'name': 'series-name', 'provider': 'series01' }
          ],
          'options': {
            'series': {
              'series-name': {
                'lineSmooth': Chartist.Interpolation.simple(),
                'showArea': true,
                'showPoint': false
              }
            },
            'axisX': {
              'labelInterpolationFnc': function (value, syncer) {
                var timestamp = parseInt((syncer.last - (syncer.interval * value)) / 1000, 10)
                return (timestamp % 5 === 0) ?
                  moment.unix(timestamp).format('mm:ss') : (value === 0 || value === syncer.points - 1) ? ' ' : null
              }
            },
            'axisY': {
              'type': Chartist.AutoScaleAxis,
              'onlyInteger': true,
              'low': 0,
              'high': 15,
              'offset': 60,
              'scaleMinSpace': 30,
              'labelInterpolationFnc': function (value) {
                return value + ' KB/s'
              }
            }
          }
        }

        return merge(settings.charts.default, config)
      },
      'chart04': function () {
        var config = {
          'delay': 200,
          'series': [
            { 'name': 'series-name0', 'provider': 'series01' },
            { 'name': 'series-name1', 'provider': 'series01' },
            { 'name': 'line', 'provider': 'series02' }
          ],
          'options': {
            'series': {
              'series-name0': {
                'lineSmooth': Chartist.Interpolation.simple(),
                'showArea': true,
                'showPoint': false,
                'showLine': false,
                'areaBase': 0
              },
              'series-name1': {
                'lineSmooth': Chartist.Interpolation.simple(),
                'showArea': true,
                'showPoint': false,
                'showLine': false,
                'areaBase': 20
              },
              'line': {
                'lineSmooth': Chartist.Interpolation.none(),
                'showArea': false,
                'showPoint': false,
                'showLine': true
              }
            },
            'axisX': {
              'labelInterpolationFnc': function (value, syncer) {
                return (value % 5 === 0) ? value : null
              }
            },
            'axisY': {
              'type': Chartist.AutoScaleAxis,
              'onlyInteger': true,
              'low': 0,
              'high': 15,
              'offset': 60,
              'scaleMinSpace': 15,
              'labelInterpolationFnc': function (value) {
                return '$' + value + 'M'
              }
            }
          }
        }

        return merge(settings.charts.default, config)
      }
    }
  }

  // DO NOT EDIT BELOW THIS LINE
  var merge = function (target, src) {
      var array = Array.isArray(src),
        dst = array && [] || {}

      if (array) {
        target = target || []
        dst = dst.concat(target)
        src.forEach(function (e, i) {
          if (typeof dst[i] === 'undefined') {
            dst[i] = e
          } else if (typeof e === 'object') {
            dst[i] = merge(target[i], e)
          } else {
            if (target.indexOf(e) === -1) {
              dst.push(e)
            }
          }
        })
      } else {
        if (target && typeof target === 'object') {
          Object.keys(target).forEach(function (key) {
            dst[key] = target[key]
          })
        }
        Object.keys(src).forEach(function (key) {
          if (typeof src[key] !== 'object' || !src[key]) {
            dst[key] = src[key]
          } else {
            if (!target[key]) {
              dst[key] = src[key]
            } else {
              dst[key] = merge(target[key], src[key])
            }
          }
        })
      }

      return dst
    },
    charts = Object.keys(settings.charts)
  for (var i in charts) {
    if (charts[i] === 'default') continue
    settings.charts[charts[i]] = settings.charts[charts[i]]()
  }

  return settings
})()
