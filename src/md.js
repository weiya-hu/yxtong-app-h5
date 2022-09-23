import md5 from 'js-md5'

function Decrypt() {
    let _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        _salt = '', //4124bc0a9335c27f086f24ba207a4912
        _saltIdx = 0,
        _cache = [],
        _xorKey = function(byte) {
            if (_saltIdx == 32) _saltIdx = 0
            byte = byte ^ _salt.charCodeAt(_saltIdx++)
            return _toUtf8(byte)
        },
        // utf-8字符转换
        _toUtf8 = function(byte) {
            if (_cache.length) {
                let _firstByte = _cache[0]
                // 如果缓存字节是10开头
                if (_firstByte > 191 && _firstByte < 224) {
                    _cache = []
                    return String.fromCharCode(((_firstByte & 31) << 6) | (byte & 63))
                }
                // 缓存第一个字节是110开头，当前缓存只有一个字节时追加到缓存返回空
                if (_cache.length === 1) {
                    _cache.push(byte)
                    return ''
                }
                let _secByte = _cache[1]
                _cache = []
                return String.fromCharCode(((_firstByte & 15) << 12) | ((_secByte & 63) << 6) | (byte & 63))
            }
            if (byte < 128) return String.fromCharCode(byte)
            _cache.push(byte)
            return ''
        }

    this.decryptResponse = function(input, key = 'VIP4.2.0') {
        if (!input) return false
        _salt = md5(md5(key))
        _saltIdx = 0
        let output = '',
            i = 0
        // eslint-disable-next-line no-useless-escape
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
        while (i < input.length) {
            let enc1 = _keyStr.indexOf(input.charAt(i++)),
                enc2 = _keyStr.indexOf(input.charAt(i++)),
                enc3 = _keyStr.indexOf(input.charAt(i++)),
                enc4 = _keyStr.indexOf(input.charAt(i++)),
                chr1 = (enc1 << 2) | (enc2 >> 4)
            output += _xorKey(chr1)
            if (enc3 != 64) output += _xorKey(((enc2 & 15) << 4) | (enc3 >> 2))
            if (enc4 != 64) output += _xorKey(((enc3 & 3) << 6) | enc4)
        }
        return output
    }
}
export default new Decrypt()
