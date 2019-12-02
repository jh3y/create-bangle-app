/*
Gordon Williams (gw@pur3.co.uk)

If we're running in an iframe, this gets enabled and allows the IDE
to work by passing messages using window.postMessage.

Use embed.js on the client side to link this in.
*/

var DEVICE = 20 // USB
var BTN1 = 24
var BTN2 = 22
var BTN3 = 23
var BTN4 = 11
var BTN5 = 16
var jsRXCallback
var jsIdleTimeout
// used to interface to Espruino emscripten...
var hwPinValue = new Uint8Array(32)
function hwSetPinValue(pin, v) {
  hwPinValue[pin] = v
}
function hwGetPinValue(pin) {
  return hwPinValue[pin]
}

function jsHandleIO() {
  var device
  var l = ''
  do {
    device = Module.ccall('jshGetDeviceToTransmit', 'number', [], [])
    if (device) {
      var ch = Module.ccall(
        'jshGetCharToTransmit',
        'number',
        ['number'],
        [device]
      )
      if (jsRXCallback) jsRXCallback(ch)
      l += String.fromCharCode(ch)
      var ll = l.split('\n')
      if (ll.length > 1) {
        console.log('EMSCRIPTEN:', ll[0])
        l = ll[1]
      }
    }
  } while (device)
}
function jsTransmitChar(c) {
  Module.ccall(
    'jshPushIOCharEvent',
    'number',
    ['number', 'number'],
    [DEVICE, c]
  )
  jsIdle()
}
function jsTransmitPinEvent(pin) {
  Module.ccall('jsSendPinWatchEvent', 'number', ['number'], [pin])
  jsIdle()
}
function jsIdle() {
  if (jsIdleTimeout) {
    clearTimeout(jsIdleTimeout)
    jsIdleTimeout = undefined
  }
  var tries = 5
  var msToNext = -1
  while (tries-- && msToNext < 0) {
    msToNext = Module.ccall('jsIdle', 'number', [], [])
    jsHandleIO()
  }
  if (msToNext < 10) msToNext = 10
  jsIdleTimeout = setTimeout(jsIdle, msToNext)
  jsUpdateGfx()
}
function jsUpdateGfx() {
  var changed = Module.ccall('jsGfxChanged', 'number', [], [])
  if (changed) {
    var p = Module.ccall('jsGfxGetPtr', 'number', [], []) >> 1
    var canvas = document.getElementById('gfxcanvas')
    var ctx = canvas.getContext('2d')
    var imgData = ctx.createImageData(240, 240)
    var rgba = imgData.data
    for (var i = 0; i < 240 * 240; i++) {
      var c = Module.HEAP16[p + i]
      rgba[i * 4 + 0] = (c >> 8) & 0xf8
      rgba[i * 4 + 1] = (c >> 3) & 0xfc
      rgba[i * 4 + 2] = (c << 3) & 0xf8
      rgba[i * 4 + 3] = 255
    }
    ctx.putImageData(imgData, 0, 0)
  }
  jsHandleIO()
}
function jsInit() {
  function handleButton(n, pin) {
    hwPinValue[pin] = 1 // inverted
    var btn = document.getElementById('BTN' + n)
    btn.addEventListener('mousedown', e => {
      hwPinValue[pin] = 0 // inverted
      jsTransmitPinEvent(pin)
    })
    btn.addEventListener('mouseup', e => {
      hwPinValue[pin] = 1 // inverted
      jsTransmitPinEvent(pin)
    })
  }
  handleButton(1, BTN1)
  handleButton(2, BTN2)
  handleButton(3, BTN3)
  handleButton(4, BTN4)
  handleButton(5, BTN5)

  Module.ccall('jsInit', 'number', [], [])
  jsHandleIO()
}

;(function() {
  var callbacks = {}
  var device = {
    name: 'Emulator',
    // "init" : function() {
    // },
    getPorts: function(callback) {
      callback(
        [
          {
            path: 'Emulator',
            description: 'Emulator',
            type: 'emulator',
            autoconnect: true
          }
        ],
        true /*instantPorts*/
      )
    },
    open: function(path, openCallback, receiveCallback, disconnectCallback) {
      jsRXCallback = function(c) {
        var a = new Uint8Array([c])
        receiveCallback(a.buffer)
      }
      callbacks.disconnected = disconnectCallback
      setTimeout(function() {
        jsInit()
        jsIdle()
        openCallback('Connected')
      }, 500)
    },
    write: function(d, callback) {
      for (var i = 0; i < d.length; i++) {
        jsTransmitChar(d.charCodeAt(i))
      }
      setTimeout(callback, 10)
    }
  }
  Espruino.Core.Serial.devices.push(device)
})()
