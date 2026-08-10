---
title: Lua String Library
---

# Lua String Library

`string`

Standard Lua 5.1 string library. Available as both `string.fn(s, ...)` and object-style `s:fn(...)`, since every string has a metatable pointing back to this table. Pattern-matching functions (find, match, gmatch, gsub) use Lua patterns, not full regular expressions.

---

## `string.byte`

*function*

```lua
string.byte(s [, i [, j]])
```

Numeric byte codes of characters s[i..j].

Returns the internal numeric codes of the characters s[i], s[i+1], ..., s[j]. The default for i is 1; the default for j is i.

**Usage**

```lua
string.byte(s, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `i` | integer | No | Start index (1-based, negative counts from the end). Default 1. |
| `j` | integer | No | End index. Default i. |

**Returns**

- one integer per byte in range i..j

**Example**

```lua
print(string.byte('A'))        -- 65
print(('ABC'):byte(1, 3))      -- 65 66 67
```


## `string.char`

*function*

```lua
string.char(...)
```

Build a string from numeric byte codes.

Receives zero or more integers and returns a string with a character for each code.

**Usage**

```lua
string.char(...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | integer | No | Byte codes (variadic). |

**Returns**

- string

**Example**

```lua
print(string.char(65, 66, 67))  -- "ABC"
```


## `string.find`

*function*

```lua
string.find(s, pattern [, init [, plain]])
```

Find the first match of a pattern in a string.

Looks for the first match of pattern in s, starting search at position init. Returns the start and end indices of the match, plus any captures. Returns nil if no match. If plain is true, pattern is matched as a literal substring (no Lua pattern special characters).

**Usage**

```lua
string.find(s, pattern, init, plain)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern (or literal text when plain=true). |
| `init` | integer | No | 1-based start index (negative counts from the end). Default 1. |
| `plain` | boolean | No | When true, disables pattern matching and does a plain substring search. |

**Returns**

- start, end [, captures...] on match; nil on no match

**Example**

```lua
local S, E = string.find('hello world', 'wor')
print(S, E)  -- 7  9

local S2, E2, Cap = string.find('ID:98765', '(%d+)')
print(Cap)   -- "98765"
```


## `string.format`

*function*

```lua
string.format(formatstring, ...)
```

printf-style string formatting.

Returns a formatted version of its variable number of arguments following the description given in formatstring, which follows the rules of the C `printf`.

**Usage**

```lua
string.format(formatstring, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `formatstring` | string | Yes | printf-style format string (%d, %s, %f, %x, %q, ...). |
| `...` | any | No | Values to format (variadic). |

**Returns**

- string

**Example**

```lua
print(string.format('%s = %05d', 'count', 42))  -- "count = 00042"
```


## `string.gmatch`

*function*

```lua
string.gmatch(s, pattern)
```

Iterator over all pattern matches.

Returns an iterator function that, each time it is called, returns the next captures from pattern over string s. If pattern has no captures, the whole match is returned each time.

**Usage**

```lua
for cap1, cap2 in string.gmatch(s, pattern) do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern. |

**Returns**

- iterator function, for use in a generic for loop

**Example**

```lua
for word in string.gmatch('one two three', '%a+') do
   print(word)
end
-- one
-- two
-- three
```


## `string.gsub`

*function*

```lua
string.gsub(s, pattern, repl [, n])
```

Global substitution by pattern.

Returns a copy of s in which all (or, if n is given, at most n) occurrences of pattern have been replaced by repl. repl may be a string (with %1..%9 capture references and %0 for the whole match), a table (indexed by the first capture), or a function (called with the captures; its result replaces the match, or the match is kept unchanged if it returns nil/false).

**Usage**

```lua
string.gsub(s, pattern, repl, n)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern. |
| `repl` | string\|table\|function | Yes | Replacement string, capture-indexed table, or replacement function. |
| `n` | integer | No | Maximum number of substitutions; default is unlimited. |

**Returns**

- `string` — the resulting string.
- `count` — number of substitutions made.

**Example**

```lua
local Out, N = string.gsub('hello world', 'o', '0')
print(Out, N)  -- "hell0 w0rld"  2

local Wire = ('ADT^A01|20260101'):gsub('%^', '-')
print(Wire)    -- "ADT-A01|20260101"

local Redacted = string.gsub('REF: 123-45-6789', '%d', '#')
print(Redacted)  -- "REF: ###-##-####"
```


## `string.len`

*function*

```lua
string.len(s)
```

Length of a string (= #s).

Receives a string and returns its length. Equivalent to the `#` operator on a string.

**Usage**

```lua
string.len(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- integer

**Example**

```lua
print(string.len('hello'))  -- 5
print(#'hello')             -- 5
```


## `string.lower`

*function*

```lua
string.lower(s)
```

Lowercase copy of a string.

Receives a string and returns a copy of it with all uppercase letters changed to lowercase; other characters are unchanged.

**Usage**

```lua
string.lower(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- string

**Example**

```lua
print(string.lower('HELLO'))  -- "hello"
```


## `string.match`

*function*

```lua
string.match(s, pattern [, init])
```

Return the first match's captures (or the whole match).

Looks for the first match of pattern in s, starting at position init, and returns the captures from the pattern, or the whole match if the pattern specifies no captures. Returns nil on no match.

**Usage**

```lua
string.match(s, pattern, init)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `pattern` | string | Yes | Lua pattern. |
| `init` | integer | No | 1-based start index (negative counts from the end). Default 1. |

**Returns**

- captures... (or the whole match); nil on no match

**Example**

```lua
local Id = string.match('CODE:98765', 'CODE:(%d+)')
print(Id)  -- "98765"
```


## `string.rep`

*function*

```lua
string.rep(s, n [, sep])
```

Repeat a string n times.

Returns a string that is the concatenation of n copies of s, optionally separated by sep between each pair.

**Usage**

```lua
string.rep(s, n, sep)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | String to repeat. |
| `n` | integer | Yes | Number of copies. |
| `sep` | string | No | Separator inserted between copies. |

**Returns**

- string

**Example**

```lua
print(string.rep('ab', 3))       -- "ababab"
print(string.rep('ab', 3, '-'))  -- "ab-ab-ab"
```


## `string.reverse`

*function*

```lua
string.reverse(s)
```

Reverse a string.

Returns a string that is the string s reversed.

**Usage**

```lua
string.reverse(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- string

**Example**

```lua
print(string.reverse('hello'))  -- "olleh"
```


## `string.sub`

*function*

```lua
string.sub(s, i [, j])
```

Substring s[i..j].

Returns the substring of s that starts at i and continues until j; i and j can be negative, counting from the end of the string. The default for j is -1 (the end of the string).

**Usage**

```lua
string.sub(s, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |
| `i` | integer | Yes | Start index (1-based, negative counts from the end). |
| `j` | integer | No | End index. Default -1 (end of string). |

**Returns**

- string

**Example**

```lua
print(string.sub('hello world', 1, 5))  -- "hello"
print(string.sub('hello world', -5))    -- "world"
```


## `string.upper`

*function*

```lua
string.upper(s)
```

Uppercase copy of a string.

Receives a string and returns a copy of it with all lowercase letters changed to uppercase; other characters are unchanged.

**Usage**

```lua
string.upper(s)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `s` | string | Yes | Source string. |

**Returns**

- string

**Example**

```lua
print(string.upper('hello'))  -- "HELLO"
```

