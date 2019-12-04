/*
Gordon Williams (gw@pur3.co.uk)

If we're running in an iframe, this gets enabled and allows the IDE
to work by passing messages using window.postMessage.

Use embed.js on the client side to link this in.
*/

const DEVICE = 20 // USB
const BTN1 = 24
const BTN2 = 22
const BTN3 = 23
const BTN4 = 11
const BTN5 = 16
let jsRXCallback
let jsIdleTimeout
// used to interface to Espruino emscripten...
const hwPinValue = new Uint8Array(32)
window.hwSetPinValue = (pin, v) => {
  hwPinValue[pin] = v
}
window.hwGetPinValue = pin => {
  return hwPinValue[pin]
}

const jsHandleIO = () => {
  let device
  let l = ''
  do {
    device = Module.ccall('jshGetDeviceToTransmit', 'number', [], [])
    if (device) {
      const ch = Module.ccall(
        'jshGetCharToTransmit',
        'number',
        ['number'],
        [device]
      )
      if (jsRXCallback) jsRXCallback(ch)
      l += String.fromCharCode(ch)
      let ll = l.split('\n')
      if (ll.length > 1) {
        console.log('EMSCRIPTEN:', ll[0])
        l = ll[1]
      }
    }
  } while (device)
}
const jsUpdateGfx = () => {
  const changed = Module.ccall('jsGfxChanged', 'number', [], [])
  if (changed) {
    const p = Module.ccall('jsGfxGetPtr', 'number', [], []) >> 1
    const canvas = document.getElementById('gfxcanvas')
    const ctx = canvas.getContext('2d')
    const imgData = ctx.createImageData(240, 240)
    const rgba = imgData.data
    for (let i = 0; i < 240 * 240; i++) {
      const c = Module.HEAP16[p + i]
      rgba[i * 4 + 0] = (c >> 8) & 0xf8
      rgba[i * 4 + 1] = (c >> 3) & 0xfc
      rgba[i * 4 + 2] = (c << 3) & 0xf8
      rgba[i * 4 + 3] = 255
    }
    ctx.putImageData(imgData, 0, 0)
  }
  jsHandleIO()
}
const jsIdle = () => {
  if (jsIdleTimeout) {
    clearTimeout(jsIdleTimeout)
    jsIdleTimeout = undefined
  }
  let tries = 5
  let msToNext = -1
  while (tries-- && msToNext < 0) {
    msToNext = Module.ccall('jsIdle', 'number', [], [])
    jsHandleIO()
  }
  if (msToNext < 10) msToNext = 10
  jsIdleTimeout = setTimeout(jsIdle, msToNext)
  jsUpdateGfx()
}
const jsTransmitChar = c => {
  Module.ccall(
    'jshPushIOCharEvent',
    'number',
    ['number', 'number'],
    [DEVICE, c]
  )
  jsIdle()
}
const jsTransmitPinEvent = pin => {
  Module.ccall('jsSendPinWatchEvent', 'number', ['number'], [pin])
  jsIdle()
}

const transmit = pin => {
  hwPinValue[pin] = hwPinValue[pin] ? 0 : 1 // inverted
  jsTransmitPinEvent(pin)
}

const jsInit = () => {
  const bangle = document.querySelector('.bangle')
  bangle.addEventListener('mousedown', e => {
    if (e.target.tagName === 'BUTTON') {
      const pin = parseInt(e.target.dataset.pin, 10)
      transmit(pin)
      const release = evt => {
        if (e !== evt) {
          transmit(pin)
          document.body.removeEventListener('mouseup', release)
        }
      }
      document.body.addEventListener('mouseup', release)
    }
  })
  hwPinValue[BTN1] = 1
  hwPinValue[BTN2] = 1
  hwPinValue[BTN3] = 1
  hwPinValue[BTN4] = 1
  hwPinValue[BTN5] = 1
  Module.ccall('jsInit', 'number', [], [])
  jsHandleIO()
}

;(function() {
  var callbacks = {}
  var device = {
    name: 'Emulator',
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
