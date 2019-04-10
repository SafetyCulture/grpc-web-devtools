
const ENCODED_VALS_BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    '0123456789';

const ENCODED_VALS = ENCODED_VALS_BASE + '+/=';

const ENCODED_VALS_WEBSAFE = ENCODED_VALS_BASE + '-_.';

var byteToCharMap_ = null;
var charToByteMap_ = null;
var byteToCharMapWebSafe_ = null;

export function decodeStringToUint8Array(input) {
    var len = input.length;
    // Check if there are trailing '=' as padding in the b64 string.
    var placeholders = 0;
    if (input[len - 2] === '=') {
        placeholders = 2;
    } else if (input[len - 1] === '=') {
        placeholders = 1;
    }
    var output = new Uint8Array(Math.ceil(len * 3 / 4) - placeholders);
    var outLen = 0;
    function pushByte(b) {
        output[outLen++] = b;
    }
    _decodeStringInternal(input, pushByte);
    return output.subarray(0, outLen);
}

function _decodeStringInternal(input, pushByte) {
    _init();

    var nextCharIndex = 0;

    function getByte(default_val) {
        while (nextCharIndex < input.length) {
            var ch = input.charAt(nextCharIndex++);
            var b = charToByteMap_[ch];
            if (b != null) {
                return b;  // Common case: decoded the char.
            }
            if (!isEmptyOrWhitespace(ch)) {
                throw new Error('Unknown base64 encoding at char: ' + ch);
            }
            // We encountered whitespace: loop around to the next input char.
        }
        return default_val;  // No more input remaining.
    }

    while (true) {
        var byte1 = getByte(-1);
        var byte2 = getByte(0);
        var byte3 = getByte(64);
        var byte4 = getByte(64);

        if (byte4 === 64) {
            if (byte1 === -1) {
                return;  // Terminal case: no input left to decode.
            }
        }

        var outByte1 = (byte1 << 2) | (byte2 >> 4);
        pushByte(outByte1);

        if (byte3 !== 64) {
            var outByte2 = ((byte2 << 4) & 0xF0) | (byte3 >> 2);
            pushByte(outByte2);

            if (byte4 !== 64) {
                var outByte3 = ((byte3 << 6) & 0xC0) | byte4;
                pushByte(outByte3);
            }
        }
    }
}

function _init() {
    if (!byteToCharMap_) {
        byteToCharMap_ = {};
        charToByteMap_ = {};
        byteToCharMapWebSafe_ = {};
    }

    for (var i = 0; i < ENCODED_VALS.length; i++) {
        byteToCharMap_[i] = ENCODED_VALS.charAt(i);
        charToByteMap_[byteToCharMap_[i]] = i;
        byteToCharMapWebSafe_[i] = ENCODED_VALS_WEBSAFE.charAt(i);

        if (i >= ENCODED_VALS_BASE.length) {
            charToByteMap_[ENCODED_VALS_WEBSAFE.charAt(i)] = i;
        }
    }
}

function isEmptyOrWhitespace(str) {
    var safeStr = str == null ? '' : String(str)
    return /^[\s\xa0]*$/.test(safeStr);
}