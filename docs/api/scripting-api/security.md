---
title: Security
---

# Security

`linkiir.sec`

Security primitives with modern, explicit parameters. Grouped into hash (digests/MAC/KDF), cipher (symmetric AES) and key (asymmetric RSA).

---

## `linkiir.sec.hash`

*function*

```lua
linkiir.sec.hash{ algorithm='sha256', data=, hex=true }
```

Compute a digest string.

Compute a one-way digest (e.g. sha256, sha1, md5) of the given data.

**Usage**

```lua
linkiir.sec.hash{ algorithm='sha256', data=, hex=true }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `algorithm` | string | No | Hash algorithm, default 'sha256' (e.g. 'sha1', 'sha256', 'sha512', 'md5'). |
| `data` | string | Yes | Data to hash. |
| `hex` | boolean | No | Return a hex-encoded string when true (default); raw bytes otherwise. |

**Returns**

- `digest string` — the computed value.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `UNSUPPORTED`

**Example**

```lua
local Digest = linkiir.sec.hash{ algorithm = 'sha256', data = Payload, hex = true }
local Mac    = linkiir.sec.hmac{ algorithm = 'sha256', key = Key, data = Payload }
```


## `linkiir.sec.hmac`

*function*

```lua
linkiir.sec.hmac{ algorithm='sha256', key=, data=, hex=true }
```

Compute a MAC string.

Compute a keyed message authentication code (HMAC) over the given data.

**Usage**

```lua
linkiir.sec.hmac{ algorithm='sha256', key=, data=, hex=true }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `algorithm` | string | No | Hash algorithm, default 'sha256'. |
| `key` | string | Yes | HMAC key. |
| `data` | string | Yes | Data to authenticate. |
| `hex` | boolean | No | Return a hex-encoded string when true (default); raw bytes otherwise. |

**Returns**

- `MAC string` — the computed value.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `UNSUPPORTED`

**Example**

```lua
local Digest = linkiir.sec.hash{ algorithm = 'sha256', data = Payload, hex = true }
local Mac    = linkiir.sec.hmac{ algorithm = 'sha256', key = Key, data = Payload }
```


## `linkiir.sec.pbkdf2`

*function*

```lua
linkiir.sec.pbkdf2{ password=, salt=, iterations=, length=, algorithm='sha256' }
```

Compute a derived key.

Derive a key from a password using PBKDF2.

**Usage**

```lua
linkiir.sec.pbkdf2{ password=, salt=, iterations=, length=, algorithm='sha256' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `password` | string | Yes | Password to derive from. |
| `salt` | string | Yes | Random salt bytes. |
| `iterations` | integer | Yes | Iteration count. |
| `length` | integer | Yes | Desired derived-key length in bytes. |
| `algorithm` | string | No | Hash algorithm, default 'sha256'. |

**Returns**

- `derived key` — the computed value.

**Errors**

Raises a Lua error on failure.

Codes: `INVALID_PARAMETER`, `UNSUPPORTED`

**Example**

```lua
local Key = linkiir.sec.pbkdf2{ password = Password, salt = Salt,
                          iterations = 100000, length = 32, algorithm = 'sha256' }
```


## `linkiir.sec.cipher.encrypt`

*function*

```lua
linkiir.sec.cipher.encrypt{ key=, iv=, mode=, data= }
```

AES encryption.

Encrypt data using AES with the given key, IV, and mode.

**Usage**

```lua
local cipher, err = linkiir.sec.cipher.encrypt{ key=, iv=, mode='gcm', data=, aad= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | Key bytes. |
| `iv` | string | Yes | Initialization vector bytes. |
| `data` | string | Yes | Plaintext (encrypt) or ciphertext (decrypt). |
| `mode` | string | No | 'gcm' (default), 'cbc', 'ctr'. |
| `aad` | string | No | Additional authenticated data (AEAD modes). |

**Returns**

- cipher/plain string on success
- nil, err on failure

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `BAD_TAG`, `CIPHER_ERROR`

**Example**

```lua
local Cipher, Err = linkiir.sec.cipher.encrypt{ key = Key, iv = Iv, mode = 'gcm', data = Plain }
local Plain,  Err2 = linkiir.sec.cipher.decrypt{ key = Key, iv = Iv, mode = 'gcm', data = Cipher }
```


## `linkiir.sec.cipher.decrypt`

*function*

```lua
linkiir.sec.cipher.decrypt{ key=, iv=, mode=, data= }
```

AES decryption.

Decrypt AES-encrypted data using the given key, IV, and mode.

**Usage**

```lua
local plain, err = linkiir.sec.cipher.decrypt{ key=, iv=, mode='gcm', data=, aad= }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | Key bytes. |
| `iv` | string | Yes | Initialization vector bytes. |
| `data` | string | Yes | Plaintext (encrypt) or ciphertext (decrypt). |
| `mode` | string | No | 'gcm' (default), 'cbc', 'ctr'. |
| `aad` | string | No | Additional authenticated data (AEAD modes). |

**Returns**

- cipher/plain string on success
- nil, err on failure

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `BAD_TAG`, `CIPHER_ERROR`

**Example**

```lua
local Cipher, Err = linkiir.sec.cipher.encrypt{ key = Key, iv = Iv, mode = 'gcm', data = Plain }
local Plain,  Err2 = linkiir.sec.cipher.decrypt{ key = Key, iv = Iv, mode = 'gcm', data = Cipher }
```


## `linkiir.sec.key.encrypt`

*function*

```lua
linkiir.sec.key.encrypt{ key=<pem>, data=, padding='oaep' }
```

RSA encrypt.

RSA-encrypt data with the given key.

**Usage**

```lua
linkiir.sec.key.encrypt{ key=<pem>, data=, padding='oaep' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded public key. |
| `data` | string | Yes | Plaintext to encrypt. |
| `padding` | string | No | Padding scheme, default 'oaep'. |

**Returns**

- Result (see usage).

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Cipher, Err = linkiir.sec.key.encrypt{ key = PubKey, data = Payload }
if not Cipher then error(Err.message) end
```


## `linkiir.sec.key.decrypt`

*function*

```lua
linkiir.sec.key.decrypt{ key=<pem>, data=, padding='oaep' }
```

RSA decrypt.

RSA-decrypt data with the given key.

**Usage**

```lua
linkiir.sec.key.decrypt{ key=<pem>, data=, padding='oaep' }
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded private key. |
| `data` | string | Yes | Ciphertext to decrypt. |
| `padding` | string | No | Padding scheme, default 'oaep'. |

**Returns**

- Result (see usage).

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Plain, Err = linkiir.sec.key.decrypt{ key = PrivKey, data = Cipher }
if not Plain then error(Err.message) end
```


## `linkiir.sec.key.sign`

*function*

```lua
linkiir.sec.key.sign{ key=<privPem>, data=, algorithm='sha256' }
```

RSA sign.

Sign data with an RSA private key.

**Usage**

```lua
linkiir.sec.key.sign{ key=<privPem>, data=, algorithm='sha256' } → signature
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded private key. |
| `data` | string | Yes | Data to sign. |
| `algorithm` | string | No | Hash algorithm, default 'sha256'. |

**Returns**

- signature

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Sig = linkiir.sec.key.sign{ key = PrivKey, data = Payload, algorithm = 'sha256' }
local Ok  = linkiir.sec.key.verify{ key = PubKey, data = Payload, signature = Sig }
```


## `linkiir.sec.key.verify`

*function*

```lua
linkiir.sec.key.verify{ key=<pubPem>, data=, signature= }
```

RSA verify.

Verify an RSA signature against data using the public key.

**Usage**

```lua
linkiir.sec.key.verify{ key=<pubPem>, data=, signature= } → boolean
```

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `key` | string | Yes | PEM-encoded public key. |
| `data` | string | Yes | Original data. |
| `signature` | string | Yes | Signature to verify. |

**Returns**

- boolean

**Errors**

Returns result, err.

Codes: `INVALID_KEY`, `VERIFY_FAILED`, `CIPHER_ERROR`

**Example**

```lua
local Sig = linkiir.sec.key.sign{ key = PrivKey, data = Payload, algorithm = 'sha256' }
local Ok  = linkiir.sec.key.verify{ key = PubKey, data = Payload, signature = Sig }
```


## `linkiir.sec.info`

*function*

```lua
linkiir.sec.info()
```

Available algorithms & library metadata.

Return crypto library metadata.

**Usage**

```lua
local info = linkiir.sec.info()
```

**Returns**

- `{ version=, ciphers={...}, digests={...} }`

**Errors**

Raises a Lua error on failure.

Codes: `RUNTIME_ERROR`

**Example**

```lua
local Info = linkiir.sec.info()
print(Info.version)
```

