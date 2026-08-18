---
title: Byte Transforms
---

# Byte Transforms

`linkiir.codec`

Everything that turns bytes into other bytes and back: text encodings, compression, and character-set conversion. Consistent verbs: encode/decode, compress/decompress. Pure functions (raise on error).

---

## `linkiir.codec.base64.encode`

*function*

```lua
linkiir.codec.base64.encode(s)
```

Encode using base64.

Encode arbitrary bytes as a base64 string.

**Usage**

```lua
linkiir.codec.base64.encode(s)   -- or linkiir.codec.base64.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local B64 = linkiir.codec.base64.encode(Pdf)
local Raw = linkiir.codec.base64.decode(B64)
```


## `linkiir.codec.base64.decode`

*function*

```lua
linkiir.codec.base64.decode(s)
```

Decode using base64.

Decode a base64-encoded string back to raw bytes.

**Usage**

```lua
linkiir.codec.base64.decode(s)   -- or linkiir.codec.base64.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local B64 = linkiir.codec.base64.encode(Pdf)
local Raw = linkiir.codec.base64.decode(B64)
```


## `linkiir.codec.hex.encode`

*function*

```lua
linkiir.codec.hex.encode(s)
```

Encode using hex.

Encode arbitrary bytes as a lowercase hex string.

**Usage**

```lua
linkiir.codec.hex.encode(s)   -- or linkiir.codec.hex.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Hex = linkiir.codec.hex.encode(Pdf)
local Raw = linkiir.codec.hex.decode(Hex)
```


## `linkiir.codec.hex.decode`

*function*

```lua
linkiir.codec.hex.decode(s)
```

Decode using hex.

Decode a hex-encoded string back to raw bytes.

**Usage**

```lua
linkiir.codec.hex.decode(s)   -- or linkiir.codec.hex.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Hex = linkiir.codec.hex.encode(Pdf)
local Raw = linkiir.codec.hex.decode(Hex)
```


## `linkiir.codec.uri.encode`

*function*

```lua
linkiir.codec.uri.encode(s)
```

Encode using uri.

Percent-encode a string for safe use in a URI.

**Usage**

```lua
linkiir.codec.uri.encode(s)   -- or linkiir.codec.uri.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Enc = linkiir.codec.uri.encode('a b&c')
local Dec = linkiir.codec.uri.decode(Enc)
```


## `linkiir.codec.uri.decode`

*function*

```lua
linkiir.codec.uri.decode(s)
```

Decode using uri.

Decode a percent-encoded URI string.

**Usage**

```lua
linkiir.codec.uri.decode(s)   -- or linkiir.codec.uri.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Enc = linkiir.codec.uri.encode('a b&c')
local Dec = linkiir.codec.uri.decode(Enc)
```


## `linkiir.codec.html.encode`

*function*

```lua
linkiir.codec.html.encode(s)
```

Encode using html.

Escape HTML-significant characters (&, \<, \>, ", ', ;) in a string. Quotes become &quot; and &#39;; the semicolon becomes &#59;.

**Usage**

```lua
linkiir.codec.html.encode(s)   -- or linkiir.codec.html.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Esc = linkiir.codec.html.encode('<b>Tom & Jerry</b>')
```


## `linkiir.codec.html.decode`

*function*

```lua
linkiir.codec.html.decode(s)
```

Decode using html.

Decode HTML entities and numeric character references back to text. Handles the named entities &amp;, &lt;, &gt;, &quot; and &nbsp; (decoded as a plain space), decimal references (&#39;) and hex references (&#x27;, &#X27;). Numeric references are emitted as UTF-8, so codepoints above U+007F expand to multiple bytes. Unknown entities and malformed sequences (no closing semicolon within 12 characters) pass through verbatim, so decode(encode(s)) round-trips.

**Usage**

```lua
linkiir.codec.html.decode(s)   -- or linkiir.codec.html.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Txt = linkiir.codec.html.decode('&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;')
-- '<b>Tom & Jerry</b>'

-- Round-trips with encode
local Src = [[<script>alert("xss's");</script>]]
assert(linkiir.codec.html.decode(linkiir.codec.html.encode(Src)) == Src)
```


## `linkiir.codec.uu.encode`

*function*

```lua
linkiir.codec.uu.encode(s)
```

Encode using uu.

Encode arbitrary bytes using uuencoding.

**Usage**

```lua
linkiir.codec.uu.encode(s)   -- or linkiir.codec.uu.encode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Uu  = linkiir.codec.uu.encode(Pdf)
local Raw = linkiir.codec.uu.decode(Uu)
```


## `linkiir.codec.uu.decode`

*function*

```lua
linkiir.codec.uu.decode(s)
```

Decode using uu.

Decode a uuencoded string back to raw bytes.

**Usage**

```lua
linkiir.codec.uu.decode(s)   -- or linkiir.codec.uu.decode{ data = s }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Input string (positional) or named data= field. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `DECODE_ERROR`

**Example**

```lua
local Uu  = linkiir.codec.uu.encode(Pdf)
local Raw = linkiir.codec.uu.decode(Uu)
```


## `linkiir.codec.gzip.compress`

*function*

```lua
linkiir.codec.gzip.compress(s)
```

Compress using gzip.

Compress a string payload using gzip.

**Usage**

```lua
linkiir.codec.gzip.compress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.gzip.compress(Payload)
local Raw   = linkiir.codec.gzip.decompress(Small)
```


## `linkiir.codec.gzip.decompress`

*function*

```lua
linkiir.codec.gzip.decompress(s)
```

Decompress using gzip.

Decompress a gzip-compressed string payload.

**Usage**

```lua
linkiir.codec.gzip.decompress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.gzip.compress(Payload)
local Raw   = linkiir.codec.gzip.decompress(Small)
```


## `linkiir.codec.bzip2.compress`

*function*

```lua
linkiir.codec.bzip2.compress(s)
```

Compress using bzip2.

Compress a string payload using bzip2.

**Usage**

```lua
linkiir.codec.bzip2.compress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.bzip2.compress(Payload)
local Raw   = linkiir.codec.bzip2.decompress(Small)
```


## `linkiir.codec.bzip2.decompress`

*function*

```lua
linkiir.codec.bzip2.decompress(s)
```

Decompress using bzip2.

Decompress a bzip2-compressed string payload.

**Usage**

```lua
linkiir.codec.bzip2.decompress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.bzip2.compress(Payload)
local Raw   = linkiir.codec.bzip2.decompress(Small)
```


## `linkiir.codec.zip.compress`

*function*

```lua
linkiir.codec.zip.compress(s)
```

Compress using zip.

Compress a string payload using zip.

**Usage**

```lua
linkiir.codec.zip.compress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.zip.compress(Payload)
local Raw   = linkiir.codec.zip.decompress(Small)
```


## `linkiir.codec.zip.decompress`

*function*

```lua
linkiir.codec.zip.decompress(s)
```

Decompress using zip.

Decompress a zip-compressed string payload.

**Usage**

```lua
linkiir.codec.zip.decompress(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Payload to transform. |

**Returns**

- The transformed string.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `COMPRESSION_ERROR`

**Example**

```lua
local Small = linkiir.codec.zip.compress(Payload)
local Raw   = linkiir.codec.zip.decompress(Small)
```


## `linkiir.codec.charset.convert`

*function*

```lua
linkiir.codec.charset.convert{ data=, from=, to= }
```

Character-set conversion.

Convert between character sets.

**Usage**

```lua
local out, err = linkiir.codec.charset.convert{ data=, from='cp1252', to='utf-8' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Bytes to convert. |
| `from` | string | Yes | Source encoding (e.g. 'cp1252'). |
| `to` | string | Yes | Target encoding (e.g. 'utf-8'). |

**Returns**

- converted string on success
- nil, err on failure

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Utf8, Err = linkiir.codec.charset.convert{ data = Legacy, from = 'iso-8859-1', to = 'utf-8' }
```


## `linkiir.codec.charset.list`

*function*

```lua
linkiir.codec.charset.list()
```

List known encodings.

Return the list of character-set names supported by linkiir.codec.charset.convert.

**Usage**

```lua
local result = linkiir.codec.charset.list()
```

**Returns**

- `array` — List known encodings.

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Result = linkiir.codec.charset.list()
```


## `linkiir.codec.charset.supported`

*function*

```lua
linkiir.codec.charset.supported(name)
```

Test whether an encoding is supported.

Test whether the given character-set name is supported by linkiir.codec.charset.convert.

**Usage**

```lua
local result = linkiir.codec.charset.supported(name)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Encoding name to test. |

**Returns**

- `boolean` — Test whether an encoding is supported.

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Result = linkiir.codec.charset.supported(name)
```


## `linkiir.codec.charset.aliases`

*function*

```lua
linkiir.codec.charset.aliases(name)
```

Aliases for an encoding.

Return the known aliases for a supported character-set name.

**Usage**

```lua
local result = linkiir.codec.charset.aliases(name)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Encoding name. |

**Returns**

- `array` — Aliases for an encoding.

**Errors**

Returns result, err.

Codes: `UNSUPPORTED_ENCODING`, `CONVERT_ERROR`

**Example**

```lua
local Result = linkiir.codec.charset.aliases(name)
```

