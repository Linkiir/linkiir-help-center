---
title: Lua Math Library
---

# Lua Math Library

`math`

Standard Lua 5.1 math library.

---

## `math.pi`

*field*

```lua
math.pi
```

The value of pi.

**Usage**

```lua
math.pi
```

**Returns**

- number

**Example**

```lua
print(math.pi)  -- 3.1415926535898
```


## `math.huge`

*field*

```lua
math.huge
```

A value larger than any other numeric value.

A value larger than or equal to any other numeric value (floating-point infinity).

**Usage**

```lua
math.huge
```

**Returns**

- number

**Example**

```lua
print(math.huge)  -- inf
```


## `math.abs`

*function*

```lua
math.abs(x)
```

Absolute value.

Returns the absolute value of x.

**Usage**

```lua
math.abs(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.abs(-5))  -- 5
```


## `math.ceil`

*function*

```lua
math.ceil(x)
```

Round up to an integer.

Returns the smallest integer larger than or equal to x.

**Usage**

```lua
math.ceil(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- integer

**Example**

```lua
print(math.ceil(4.1))  -- 5
```


## `math.floor`

*function*

```lua
math.floor(x)
```

Round down to an integer.

Returns the largest integer smaller than or equal to x.

**Usage**

```lua
math.floor(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- integer

**Example**

```lua
print(math.floor(4.9))  -- 4
```


## `math.sqrt`

*function*

```lua
math.sqrt(x)
```

Square root.

Returns the square root of x.

**Usage**

```lua
math.sqrt(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.sqrt(16))  -- 4
```


## `math.pow`

*function*

```lua
math.pow(x, y)
```

Exponentiation.

Returns x raised to the power y. Equivalent to the `x^y` operator.

**Usage**

```lua
math.pow(x, y)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Base. |
| `y` | number | Yes | Exponent. |

**Returns**

- number

**Example**

```lua
print(math.pow(2, 10))  -- 1024
```


## `math.exp`

*function*

```lua
math.exp(x)
```

e raised to a power.

Returns the value e^x.

**Usage**

```lua
math.exp(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Exponent. |

**Returns**

- number

**Example**

```lua
print(math.exp(1))  -- 2.718281828459
```


## `math.log`

*function*

```lua
math.log(x)
```

Natural logarithm.

Returns the natural logarithm of x.

**Usage**

```lua
math.log(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.log(math.exp(1)))  -- 1
```


## `math.log10`

*function*

```lua
math.log10(x)
```

Base-10 logarithm.

Returns the base-10 logarithm of x.

**Usage**

```lua
math.log10(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.log10(100))  -- 2
```


## `math.fmod`

*function*

```lua
math.fmod(x, y)
```

Remainder of x/y.

Returns the remainder of the division of x by y that rounds the quotient towards zero.

**Usage**

```lua
math.fmod(x, y)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Dividend. |
| `y` | number | Yes | Divisor. |

**Returns**

- number

**Example**

```lua
print(math.fmod(7, 3))   -- 1
print(math.fmod(-7, 3))  -- -1
```


## `math.modf`

*function*

```lua
math.modf(x)
```

Split a number into integral and fractional parts.

Returns the integral part of x and the fractional part of x; both have the same sign as x.

**Usage**

```lua
local ip, fp = math.modf(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- integralPart, fractionalPart

**Example**

```lua
local Ip, Fp = math.modf(3.75)
print(Ip, Fp)  -- 3  0.75
```


## `math.max`

*function*

```lua
math.max(x, ...)
```

Largest of the given numbers.

Returns the argument with the maximum value, among a list of one or more numbers.

**Usage**

```lua
math.max(x, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | number | Yes | One or more numbers. |

**Returns**

- number

**Example**

```lua
print(math.max(3, 7, 2))  -- 7
```


## `math.min`

*function*

```lua
math.min(x, ...)
```

Smallest of the given numbers.

Returns the argument with the minimum value, among a list of one or more numbers.

**Usage**

```lua
math.min(x, ...)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `...` | number | Yes | One or more numbers. |

**Returns**

- number

**Example**

```lua
print(math.min(3, 7, 2))  -- 2
```


## `math.random`

*function*

```lua
math.random([m [, n]])
```

Pseudo-random number.

With no arguments, returns a float in [0, 1). With one integer argument m, returns an integer in [1, m]. With two integer arguments m, n, returns an integer in [m, n].

**Usage**

```lua
math.random(m, n)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `m` | integer | No | Lower bound (or upper bound when n is omitted). |
| `n` | integer | No | Upper bound. |

**Returns**

- number

**Example**

```lua
print(math.random())        -- e.g. 0.6046602879796
print(math.random(6))       -- integer in [1, 6]
print(math.random(10, 20))  -- integer in [10, 20]
```


## `math.randomseed`

*function*

```lua
math.randomseed(x)
```

Seed the pseudo-random generator.

Sets x as the seed for the pseudo-random generator used by math.random.

**Usage**

```lua
math.randomseed(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Seed value. |

**Returns**

- none

**Example**

```lua
math.randomseed(os.time())
```


## `math.sin`

*function*

```lua
math.sin(x)
```

Sine.

Returns the sine of x (radians).

**Usage**

```lua
math.sin(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.sin(0))  -- 0
```


## `math.cos`

*function*

```lua
math.cos(x)
```

Cosine.

Returns the cosine of x (radians).

**Usage**

```lua
math.cos(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.cos(0))  -- 1
```


## `math.tan`

*function*

```lua
math.tan(x)
```

Tangent.

Returns the tangent of x (radians).

**Usage**

```lua
math.tan(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.tan(0))  -- 0
```


## `math.asin`

*function*

```lua
math.asin(x)
```

Arc sine.

Returns the arc sine of x (in radians).

**Usage**

```lua
math.asin(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.asin(1))  -- 1.5707963267949
```


## `math.acos`

*function*

```lua
math.acos(x)
```

Arc cosine.

Returns the arc cosine of x (in radians).

**Usage**

```lua
math.acos(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.acos(1))  -- 0
```


## `math.atan`

*function*

```lua
math.atan(x)
```

Arc tangent.

Returns the arc tangent of x (in radians).

**Usage**

```lua
math.atan(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.atan(1))  -- 0.78539816339745
```


## `math.atan2`

*function*

```lua
math.atan2(y, x)
```

Arc tangent of y/x.

Returns the arc tangent of y/x (in radians), using the signs of both arguments to determine the quadrant.

**Usage**

```lua
math.atan2(y, x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `y` | number | Yes | Numerator. |
| `x` | number | Yes | Denominator. |

**Returns**

- number

**Example**

```lua
print(math.atan2(1, 1))  -- 0.78539816339745
```


## `math.deg`

*function*

```lua
math.deg(x)
```

Radians to degrees.

Converts angle x from radians to degrees.

**Usage**

```lua
math.deg(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in radians. |

**Returns**

- number

**Example**

```lua
print(math.deg(math.pi))  -- 180
```


## `math.rad`

*function*

```lua
math.rad(x)
```

Degrees to radians.

Converts angle x from degrees to radians.

**Usage**

```lua
math.rad(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Angle in degrees. |

**Returns**

- number

**Example**

```lua
print(math.rad(180))  -- 3.1415926535898
```


## `math.sinh`

*function*

```lua
math.sinh(x)
```

Hyperbolic sine.

Returns the hyperbolic sine of x.

**Usage**

```lua
math.sinh(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.sinh(0))  -- 0.0
```


## `math.cosh`

*function*

```lua
math.cosh(x)
```

Hyperbolic cosine.

Returns the hyperbolic cosine of x.

**Usage**

```lua
math.cosh(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.cosh(0))  -- 1.0
```


## `math.tanh`

*function*

```lua
math.tanh(x)
```

Hyperbolic tangent.

Returns the hyperbolic tangent of x.

**Usage**

```lua
math.tanh(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- number

**Example**

```lua
print(math.tanh(0))  -- 0.0
```


## `math.frexp`

*function*

```lua
math.frexp(x)
```

Split a number into mantissa and exponent.

Returns m (a multiplier, |m| in [0.5, 1)) and e (an integer exponent) such that x = m * 2^e. Used for portable, precision-safe manipulation of floating-point values.

**Usage**

```lua
math.frexp(x)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | number | Yes | Input value. |

**Returns**

- m (mantissa), e (exponent)

**Example**

```lua
local M, E = math.frexp(8)
print(M, E)  -- 0.5  4
```


## `math.ldexp`

*function*

```lua
math.ldexp(m, e)
```

Build a number from a mantissa and exponent.

Returns m * 2^e. The inverse of math.frexp.

**Usage**

```lua
math.ldexp(m, e)
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `m` | number | Yes | Mantissa. |
| `e` | integer | Yes | Exponent. |

**Returns**

- number

**Example**

```lua
print(math.ldexp(0.5, 4))  -- 8
```

