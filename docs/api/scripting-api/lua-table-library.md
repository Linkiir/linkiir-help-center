---
title: Lua Table Library
---

# Lua Table Library

`table`

Standard Lua 5.1 table library for building and manipulating array-style tables (insert/remove/sort/concat). Node trees returned by linkiir.data are their own object type, not plain tables — use the Node:* methods for those.

---

## `table.insert`

*function*

```lua
table.insert(t, [pos,] value)
```

Insert an element into a table.

Inserts value at position pos in table t, shifting up subsequent elements. pos defaults to #t + 1 (append to the end).

**Usage**

```lua
table.insert(t, pos, value)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to modify. |
| `pos` | integer | No | 1-based insert position. Default #t + 1. |
| `value` | any | Yes | Value to insert. |

**Returns**

- none (mutates t)

**Example**

```lua
local Items = { 'a', 'b' }
table.insert(Items, 'c')      -- { 'a', 'b', 'c' }
table.insert(Items, 1, 'z')   -- { 'z', 'a', 'b', 'c' }
```


## `table.remove`

*function*

```lua
table.remove(t [, pos])
```

Remove an element from a table.

Removes from table t the element at position pos, shifting down subsequent elements, and returns the removed value. pos defaults to #t (remove the last element).

**Usage**

```lua
table.remove(t, pos)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to modify. |
| `pos` | integer | No | 1-based position to remove. Default #t. |

**Returns**

- the removed value

**Example**

```lua
local Items = { 'a', 'b', 'c' }
local Last = table.remove(Items)     -- "c";  Items = { 'a', 'b' }
local First = table.remove(Items, 1) -- "a";  Items = { 'b' }
```


## `table.concat`

*function*

```lua
table.concat(t [, sep [, i [, j]]])
```

Join array elements into a string.

Returns t[i] .. sep .. t[i+1] .. sep .. ... .. t[j]. sep defaults to the empty string; i defaults to 1; j defaults to #t.

**Usage**

```lua
table.concat(t, sep, i, j)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table (array) of strings/numbers. |
| `sep` | string | No | Separator. Default "". |
| `i` | integer | No | Start index. Default 1. |
| `j` | integer | No | End index. Default #t. |

**Returns**

- string

**Example**

```lua
local Ids = { '1', '2', '3' }
print(table.concat(Ids, ','))  -- "1,2,3"
```


## `table.sort`

*function*

```lua
table.sort(t [, comp])
```

Sort a table's array part in place.

Sorts the elements of table t (the array part) in place, from t[1] to t[#t]. comp is an optional less-than comparator function; the default is the standard `\<` operator.

**Usage**

```lua
table.sort(t, comp)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table (array) to sort. |
| `comp` | function | No | Comparator: function(a, b) returning true when a should come before b. |

**Returns**

- none (mutates t)

**Example**

```lua
local Nums = { 3, 1, 2 }
table.sort(Nums)
print(table.concat(Nums, ','))  -- "1,2,3"

table.sort(Nums, function(a, b) return a > b end)  -- descending
```


## `table.maxn`

*function*

```lua
table.maxn(t)
```

Largest positive numeric key in a table.

Returns the largest positive numerical index of table t, or 0 if t has no positive numerical indices. Useful for arrays with holes, where #t is undefined.

**Usage**

```lua
table.maxn(t)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `t` | table | Yes | Table to inspect. |

**Returns**

- integer

**Example**

```lua
local Sparse = { [1] = 'a', [5] = 'b' }
print(table.maxn(Sparse))  -- 5
```

