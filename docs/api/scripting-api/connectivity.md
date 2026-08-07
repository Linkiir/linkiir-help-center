---
title: Connectivity
---

# Connectivity

`linkiir.link`

All connectivity to external systems, named for the heart of Linkiir. Sub-areas: web (HTTP), socket (TCP), mail (SMTP), file (FTP/FTPS/SFTP). All calls return result, err.

---

## `linkiir.link.web.get`

*function*

```lua
linkiir.link.web.get{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP GET request.

**Usage**

```lua
linkiir.link.web.get{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.get{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
print(Resp.code, Resp.body)
```


## `linkiir.link.web.post`

*function*

```lua
linkiir.link.web.post{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP POST request.

Perform an outbound HTTP POST request, sending `body` as the request payload.

**Usage**

```lua
linkiir.link.web.post{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.post{
   url     = 'https://fhir.example.com/Patient',
   headers = { ['Content-Type'] = 'application/fhir+json' },
   body    = linkiir.data.serialize{ data = Out },
   auth    = { type = 'bearer', token = Token },
}
if not Resp then error(Err.message) end
print(Resp.code, Resp.body)
```


## `linkiir.link.web.put`

*function*

```lua
linkiir.link.web.put{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP PUT request.

Perform an outbound HTTP PUT request, sending `body` as the request payload.

**Usage**

```lua
linkiir.link.web.put{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.put{
   url  = 'https://fhir.example.com/Patient/123',
   body = linkiir.data.serialize{ data = Out },
}
if not Resp then error(Err.message) end
```


## `linkiir.link.web.patch`

*function*

```lua
linkiir.link.web.patch{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP PATCH request.

Perform an outbound HTTP PATCH request, sending `body` as the request payload.

**Usage**

```lua
linkiir.link.web.patch{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.patch{
   url  = 'https://fhir.example.com/Patient/123',
   body = linkiir.json.serialize{ active = false },
}
if not Resp then error(Err.message) end
```


## `linkiir.link.web.delete`

*function*

```lua
linkiir.link.web.delete{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP DELETE request.

**Usage**

```lua
linkiir.link.web.delete{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.delete{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
```


## `linkiir.link.web.head`

*function*

```lua
linkiir.link.web.head{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP HEAD request.

Perform an outbound HTTP HEAD request; the response has no body.

**Usage**

```lua
linkiir.link.web.head{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.head{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
print(Resp.code)
```


## `linkiir.link.web.options`

*function*

```lua
linkiir.link.web.options{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

Perform an outbound HTTP OPTIONS request.

**Usage**

```lua
linkiir.link.web.options{ url=, headers=, params=, body=, auth=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string | Yes | Target URL. |
| `headers` | table | No | Request headers. |
| `params` | table | No | Query-string parameters. |
| `body` | string | No | Request body (POST/PUT/PATCH). |
| `auth` | table | No | `{ type='basic'\|'bearer', user=, password=, token= }.` |
| `timeout` | integer | No | Seconds. |
| `verifyTls` | boolean | No | Default true. |
| `live` | boolean | No | Default true. |

**Returns**

- `resp = { code=<int>, body=<string>, headers=<table> } on success`
- nil, err on failure

**Errors**

Returns result, err (err = \{ code=, message= \}).

Codes: `INVALID_URL`, `TIMEOUT`, `TLS_ERROR`, `CONNECT_FAILED`, `HTTP_ERROR`

**Example**

```lua
local Resp, Err = linkiir.link.web.options{ url = 'https://fhir.example.com/Patient/123' }
if not Resp then error(Err.message) end
print(Resp.headers['Allow'])
```


## `linkiir.link.web.request`

*function*

```lua
linkiir.link.web.request()
```

Read the inbound HTTP request (From-HTTP context).

In an inbound HTTP context, returns the parsed inbound request.

**Usage**

```lua
local Req = linkiir.link.web.request()
```

**Returns**

- `{ method=, path=, headers=, params=, body= }` — the parsed inbound request.

**Errors**

Raises a Lua error on failure.

Codes: `CONTEXT_UNAVAILABLE`

**Example**

```lua
local Req = linkiir.link.web.request()
```


## `linkiir.link.web.respond`

*function*

```lua
linkiir.link.web.respond{ code=, body=, headers= }
```

Send the HTTP response (From-HTTP context).

In an inbound HTTP context, sends the HTTP response for the current request.

**Usage**

```lua
linkiir.link.web.respond{ code=, body=, headers= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `code` | integer | Yes | HTTP status code. |
| `body` | string | No | Response body. |
| `headers` | table | No | Response headers. |

**Returns**

- ok, err

**Errors**

respond() returns ok, err.

Codes: `CONTEXT_UNAVAILABLE`, `IO_ERROR`

**Example**

```lua
linkiir.link.web.respond{ code = 200, body = '{"status":"ok"}',
                    headers = { ['Content-Type'] = 'application/json' } }
```


## `linkiir.link.socket.connect`

*function*

```lua
linkiir.link.socket.connect{ host=, port=, timeout= }
```

Open a raw TCP socket.

Open a raw TCP socket for custom LLP/TCP clients.

**Usage**

```lua
local sock, err = linkiir.link.socket.connect{ host=, port=, timeout= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `host` | string | Yes | Target host. |
| `port` | integer | Yes | Target port. |
| `timeout` | integer | No | Connect timeout (seconds). |

**Returns**

- sock (socket object) on success — see the Socket:* methods in this module.
- nil, err on failure

**Errors**

Returns result, err.

Codes: `CONNECT_FAILED`, `TIMEOUT`, `IO_ERROR`

**Example**

```lua
local Sock, Err = linkiir.link.socket.connect{ host = '10.0.0.5', port = 5001, timeout = 5 }
if not Sock then error(Err.message) end
Sock:send(Msg:text())
local Reply = Sock:recv()
Sock:close()
```


## `linkiir.link.mail.send`

*function*

```lua
linkiir.link.mail.send{ server=, from=, to=, header=, body=, … }
```

Send an email over SMTP.

Send email through SMTP via libcurl. Returns ok, err following the I/O convention.

**Usage**

```lua
linkiir.link.mail.send{ server=, from=, to=, header=, body=, username=, password=, use_ssl=, timeout=, verifyTls=, live= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `server` | string | Yes | SMTP URL (smtp://host:port) or plain hostname. |
| `from` | string | Yes | Envelope sender address (MAIL FROM). |
| `to` | table | Yes | Array of recipient addresses (RCPT TO). |
| `header` | table | No | Email headers as key/value pairs (Subject, From, To, Date). |
| `body` | string | No | Email body text. |
| `username` | string | No | SMTP auth username. |
| `password` | string | No | SMTP auth password. |
| `use_ssl` | string | No | 'yes' (require TLS), 'try' (STARTTLS if available), or '' (none). |
| `timeout` | integer | No | Seconds (default 15). |
| `verifyTls` | boolean | No | TLS verification, default true. |
| `live` | boolean | No | Default true; false simulates. |

**Returns**

- true on success
- nil, err on failure

**Errors**

Returns ok, err.

Codes: `INVALID_SERVER`, `MISSING_PARAM`, `AUTH_FAILED`, `CONNECT_FAILED`, `TLS_ERROR`, `TIMEOUT`, `SEND_FAILED`

**Example**

```lua
local ok, err = linkiir.link.mail.send{
   server   = 'smtp://mail.example.com:587',
   from     = 'alerts@example.com',
   to       = { 'oncall@example.com', 'admin@example.com' },
   header   = { From = 'alerts@example.com', To = 'oncall@example.com',
                Subject = 'Interface Alert', Date = os.date() },
   body     = 'The ADT feed has stopped.',
   username = 'alerts@example.com', password = Secret,
   use_ssl  = 'try',
}
if not ok then error(err.message) end
```


## `linkiir.link.file.open`

*function*

```lua
linkiir.link.file.open{ scheme='ftp'|'ftps'|'sftp', host=, … }
```

File transfer over FTP / FTPS / SFTP.

Unified file transfer with a scheme selector, instead of three near-identical modules (net.ftp / net.ftps / net.sftp).

**Usage**

```lua
local conn, err = linkiir.link.file.open{ scheme=, host=, port=, user=, password=, key=, timeout= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `scheme` | string | Yes | 'ftp' \| 'ftps' \| 'sftp'. |
| `host` | string | Yes | Server host. |
| `user` | string | No | Username. |
| `password` | string | No | Password. |
| `key` | string | No | Private key (SFTP). |
| `port` | integer | No | Server port. |
| `timeout` | integer | No | Connect timeout. |

**Returns**

- conn (connection object) on success — see the FileConnection:* methods in this module.
- nil, err on failure

**Errors**

Returns result, err.

Codes: `AUTH_FAILED`, `CONNECT_FAILED`, `NOT_FOUND`, `IO_ERROR`

**Example**

```lua
local Conn, Err = linkiir.link.file.open{ scheme = 'sftp', host = 'sftp.lab.example.com',
                                   user = 'feed', key = KeyPem }
if not Conn then error(Err.message) end
Conn:put{ ['local'] = '/tmp/out.hl7', remote = '/inbound/out.hl7' }
Conn:close()
```


## Socket methods

### `Socket:send`

*method of `Socket`*

```lua
sock:send(data [, startByte [, endByte]])
```

Send bytes over the socket.

**Usage**

```lua
local n, err = sock:send(data)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | string | Yes | Bytes to send. |
| `startByte` | integer | No | 1-based start offset into data; defaults to the beginning. |
| `endByte` | integer | No | 1-based end offset into data; defaults to the end. |

**Returns**

- bytesSent, err

**Example**

```lua
local Sent, Err = Sock:send(Msg:text())
if not Sent then error(Err.message) end
```


### `Socket:recv`

*method of `Socket`*

```lua
sock:recv([maxBytes])
```

Receive data (nil when closed).

**Usage**

```lua
local data, err = sock:recv()
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `maxBytes` | integer | No | Maximum bytes to read; defaults to a runtime buffer size. |

**Returns**

- data, err

**Example**

```lua
local Reply, Err = Sock:recv()
if Reply == nil then print('connection closed') end
```


### `Socket:close`

*method of `Socket`*

```lua
sock:close()
```

Close the socket.

**Usage**

```lua
sock:close()
```

**Returns**

- none

**Example**

```lua
Sock:close()
```


## FileConnection methods

### `FileConnection:get`

*method of `FileConnection`*

```lua
conn:get{ remote=, local= }
```

Download a file.

**Usage**

```lua
local ok, err = conn:get{ remote=, local= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `remote` | string | Yes | Remote file path to download. |
| `local` | string | Yes | Local destination path. |

**Returns**

- ok, err

**Example**

```lua
local Ok, Err = Conn:get{ remote = '/inbound/out.hl7', ['local'] = '/tmp/out.hl7' }
if not Ok then error(Err.message) end
```


### `FileConnection:put`

*method of `FileConnection`*

```lua
conn:put{ local=, remote= }
```

Upload a file.

**Usage**

```lua
local ok, err = conn:put{ local=, remote= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `local` | string | Yes | Local file path to upload. |
| `remote` | string | Yes | Remote destination path. |

**Returns**

- ok, err

**Example**

```lua
Conn:put{ ['local'] = '/tmp/out.hl7', remote = '/inbound/out.hl7' }
```


### `FileConnection:list`

*method of `FileConnection`*

```lua
conn:list{ path= }
```

List a directory.

**Usage**

```lua
local files, err = conn:list{ path= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Remote directory to list. |

**Returns**

- array, err

**Example**

```lua
local Files, Err = Conn:list{ path = '/inbound' }
if not Files then error(Err.message) end
for _, f in ipairs(Files) do print(f) end
```


### `FileConnection:delete`

*method of `FileConnection`*

```lua
conn:delete{ path= }
```

Delete a file.

**Usage**

```lua
local ok, err = conn:delete{ path= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | Yes | Remote file path to delete. |

**Returns**

- ok, err

**Example**

```lua
local Ok, Err = Conn:delete{ path = '/inbound/old.hl7' }
if not Ok then error(Err.message) end
```


### `FileConnection:rename`

*method of `FileConnection`*

```lua
conn:rename{ from=, to= }
```

Rename/move a file.

**Usage**

```lua
local ok, err = conn:rename{ from=, to= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `from` | string | Yes | Current remote path. |
| `to` | string | Yes | New remote path. |

**Returns**

- ok, err

**Example**

```lua
Conn:rename{ from = '/inbound/tmp', to = '/inbound/out.hl7' }
```


### `FileConnection:close`

*method of `FileConnection`*

```lua
conn:close()
```

Close the connection.

**Usage**

```lua
conn:close()
```

**Returns**

- none

**Example**

```lua
Conn:close()
```

