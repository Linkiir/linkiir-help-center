---
title: Lua IO Library (files/stdio)
---

# Lua IO Library (files/stdio)

`io`

Standard Lua 5.1 io library: local file and standard-stream I/O, available exactly as in stock Lua/LuaJIT (registered by the runtime alongside table/math/os/string). For directory listings, metadata, and simple file management, prefer linkiir.sys.fs, which is purpose-built for the node's working directories; for reading/writing remote files (FTP/SFTP), use linkiir.link.file. io.* is the right tool when you need actual byte-level read/write access to a local file or stdin/stdout/stderr. io.popen spawns a shell process and should be avoided in workflow scripts.

---

## `io.open`

*function*

```lua
io.open(filename [, mode])
```

Open a file.

Opens filename in the given mode ("r" read, "w" write/truncate, "a" append, with optional "b" for binary and "+" for update; default "r"). Returns a new file handle on success, or nil plus an error message on failure.

**Usage**

```lua
local f, err = io.open(filename, mode)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `filename` | string | Yes | Path to open. |
| `mode` | string | No | r/w/a, optionally with b and/or +. Default "r". |

**Returns**

- file handle on success; nil, errorMessage on failure

**Example**

```lua
local F, Err = io.open(__node_dir .. '/scratch.txt', 'w')
if not F then error(Err) end
F:write('hello')
F:close()
```


## `io.close`

*function*

```lua
io.close([file])
```

Close a file.

Closes file (default the current default output file). Equivalent to file:close().

**Usage**

```lua
io.close(file)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | file | No | File handle to close. Default the current output file. |

**Returns**

- true on success; nil, errorMessage on failure

**Example**

```lua
local F = io.open('/tmp/x.txt', 'r')
-- ... use F ...
io.close(F)
```


## `io.read`

*function*

```lua
io.read(...)
```

Read from the default input file.

Reads from the current default input file, using the same formats as file:read.

**Usage**

```lua
io.read(format)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | string | No | Format specifiers ("*l", "*n", "*a", or a byte count). Default "*l". |

**Returns**

- the values read, per format; nil at end of file

**Example**

```lua
local Line = io.read('*l')
```


## `io.write`

*function*

```lua
io.write(...)
```

Write to the default output file.

Writes the given strings/numbers to the current default output file, using the same rules as file:write.

**Usage**

```lua
io.write(...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | string\|number | Yes | Values to write (variadic). |

**Returns**

- the default output file, for chaining; nil, errorMessage on failure

**Example**

```lua
io.write('processed ', tostring(Count), ' records\n')
```


## `io.lines`

*function*

```lua
io.lines([filename, ...])
```

Iterate the lines of a file.

Opens filename (or uses the default input file if omitted), and returns an iterator function that returns a new line each time it is called, per the given format(s). The file is closed automatically when the iterator finishes (only when a filename is given).

**Usage**

```lua
for line in io.lines(filename) do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `filename` | string | No | Path to read. Default the current input file. |
| `...` | string | No | Read formats (as in file:read). Default "*l". |

**Returns**

- iterator function, for use in a generic for loop

**Example**

```lua
for Line in io.lines(__node_dir .. '/data.csv') do
   print(Line)
end
```


## `io.input`

*function*

```lua
io.input([file])
```

Get/set the default input file.

With a string, opens the named file in read mode and sets it as the default input file. With a file handle, sets it as the default input file. With no argument, returns the current default input file.

**Usage**

```lua
io.input(file)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | string\|file | No | Filename to open, or an already-open file handle. |

**Returns**

- the default input file

**Example**

```lua
io.input(__node_dir .. '/data.csv')
local Line = io.read('*l')
```


## `io.output`

*function*

```lua
io.output([file])
```

Get/set the default output file.

With a string, opens the named file in write mode and sets it as the default output file. With a file handle, sets it as the default output file. With no argument, returns the current default output file.

**Usage**

```lua
io.output(file)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `file` | string\|file | No | Filename to open, or an already-open file handle. |

**Returns**

- the default output file

**Example**

```lua
io.output('/tmp/out.txt')
io.write('done\n')
```


## `io.popen`

*function*

```lua
io.popen(prog [, mode])
```

Run a shell command, connected via a pipe.

Starts prog in a separate process (via the system shell) and returns a file handle for reading its output (mode "r", the default) or writing to its input (mode "w"). Runs with the worker process's OS privileges — avoid in workflow scripts; prefer linkiir.link.file / linkiir.link.web for external I/O.

**Usage**

```lua
local f = io.popen(prog, mode)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `prog` | string | Yes | Shell command line to run. |
| `mode` | string | No | "r" (read prog's stdout) or "w" (write to prog's stdin). Default "r". |

**Returns**

- file handle on success; nil, errorMessage on failure

**Example**

```lua
-- Avoid in Linkiir scripts; shown for reference only.
local P = io.popen('date', 'r')
print(P:read('*l'))
P:close()
```


## `io.tmpfile`

*function*

```lua
io.tmpfile()
```

Open a temporary file.

Returns a handle for a temporary file, opened in update mode ('w+'), that is automatically removed when the script ends.

**Usage**

```lua
io.tmpfile()
```

**Returns**

- file handle on success; nil, errorMessage on failure

**Example**

```lua
local F = io.tmpfile()
F:write('scratch')
F:seek('set', 0)
print(F:read('*a'))
```


## `io.type`

*function*

```lua
io.type(obj)
```

Test whether a value is a file handle.

Returns "file" if obj is an open file handle, "closed file" if it is a closed file handle, or nil if it is not a file handle at all.

**Usage**

```lua
io.type(obj)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `obj` | any | Yes | Value to test. |

**Returns**

- "file", "closed file", or nil

**Example**

```lua
local F = io.open('/tmp/x.txt', 'r')
print(io.type(F))  -- "file"
F:close()
print(io.type(F))  -- "closed file"
```


## `io.stdin`

*field*

```lua
io.stdin
```

The process's standard input file handle.

The process's standard input, as a file handle.

**Usage**

```lua
io.stdin
```

**Returns**

- file handle

**Example**

```lua
local Line = io.stdin:read('*l')
```


## `io.stdout`

*field*

```lua
io.stdout
```

The process's standard output file handle.

The process's standard output, as a file handle.

**Usage**

```lua
io.stdout
```

**Returns**

- file handle

**Example**

```lua
io.stdout:write('hello\n')
```


## `io.stderr`

*field*

```lua
io.stderr
```

The process's standard error file handle.

The process's standard error, as a file handle.

**Usage**

```lua
io.stderr
```

**Returns**

- file handle

**Example**

```lua
io.stderr:write('warning: retrying\n')
```


## File methods

### `File:read`

*method of `File`*

```lua
file:read(...)
```

Read from a file.

Reads from file per the given format(s): "*l" a line without the newline (default), "*L" a line with the newline, "*a" the whole rest of the file, "*n" a number, or an integer n for up to n bytes. Returns nil (or an empty string for "*a") at end of file.

**Usage**

```lua
local Line = f:read('*l')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | string\|integer | No | One or more read formats. Default "*l". |

**Returns**

- the value(s) read, one per format; nil at end of file

**Example**

```lua
local F = io.open(Path, 'r')
local All = F:read('*a')
F:close()
```


### `File:write`

*method of `File`*

```lua
file:write(...)
```

Write to a file.

Writes the given strings/numbers to file. Numbers are converted per their usual string representation.

**Usage**

```lua
f:write('hello')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | string\|number | Yes | Values to write (variadic). |

**Returns**

- file, for chaining; nil, errorMessage on failure

**Example**

```lua
local F = io.open(Path, 'w')
F:write('id,name\n')
F:write('1,Alice\n')
F:close()
```


### `File:close`

*method of `File`*

```lua
file:close()
```

Close a file.

Closes file. Files are also closed automatically (in an unspecified order) when their handle is garbage-collected, but explicit close is recommended.

**Usage**

```lua
f:close()
```

**Returns**

- true on success; nil, errorMessage on failure

**Example**

```lua
local F = io.open(Path, 'r')
-- ... use F ...
F:close()
```


### `File:lines`

*method of `File`*

```lua
file:lines(...)
```

Iterate the lines of an already-open file.

Returns an iterator function that, each time it is called, reads the next line from file per the given format(s) (as file:read; default "*l"). Does not close file when done.

**Usage**

```lua
for line in f:lines() do ... end
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | string | No | Read formats. Default "*l". |

**Returns**

- iterator function, for use in a generic for loop

**Example**

```lua
local F = io.open(Path, 'r')
for Line in F:lines() do
   print(Line)
end
F:close()
```


### `File:seek`

*method of `File`*

```lua
file:seek([whence [, offset]])
```

Get/set the file position.

Sets and/or gets the current file position, measured from the start of the file. whence is "set" (from the start), "cur" (from the current position, the default), or "end" (from the end of the file); offset defaults to 0. With no arguments, returns the current position without changing it.

**Usage**

```lua
local pos = f:seek('set', 0)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `whence` | string | No | "set", "cur", or "end". Default "cur". |
| `offset` | integer | No | Byte offset from whence. Default 0. |

**Returns**

- the new file position (bytes from the start); nil, errorMessage on failure

**Example**

```lua
local F = io.open(Path, 'r')
local Size = F:seek('end')
F:seek('set', 0)
F:close()
```


### `File:flush`

*method of `File`*

```lua
file:flush()
```

Flush buffered writes.

Saves any written data to file, without closing it.

**Usage**

```lua
f:flush()
```

**Returns**

- file, for chaining

**Example**

```lua
F:write('partial')
F:flush()
```


### `File:setvbuf`

*method of `File`*

```lua
file:setvbuf(mode [, size])
```

Set the file's buffering mode.

Sets the buffering mode for an output file: "no" (unbuffered), "full" (buffer up to size bytes, flushed when full or explicitly), or "line" (line-buffered).

**Usage**

```lua
f:setvbuf('line')
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `mode` | string | Yes | "no", "full", or "line". |
| `size` | integer | No | Buffer size in bytes (for "full"). |

**Returns**

- true on success

**Example**

```lua
F:setvbuf('line')
```

