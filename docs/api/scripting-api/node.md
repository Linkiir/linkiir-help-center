---
title: Node
---

# Node

`linkiir.node`

Facts about the node the script runs for.

---

## `linkiir.node.dev`

*function*

```lua
linkiir.node.dev()
```

Return true when the script runs from the editor (Run Test or Debug), false in a started node.

Tells the script where it is running. It returns true when you run the script from the editor with Run Test or Debug, and false when it runs in a started node. Use it to keep test-only behaviour, such as a fixed sample or skipped side effects, out of the running node. A script can't change the answer.

**Usage**

```lua
local InEditor = linkiir.node.dev()
```

**Returns**

- `boolean` — true in Run Test or Debug, false in a started node.

**Example**

```lua
function main(Data)
  if linkiir.node.dev() then
    linkiir.log.info('Run Test: skipping the upload')
    return
  end
  -- started node: send the message on
  linkiir.flow.push{ data = Data }
end
```

```lua
-- Log more detail while testing in the editor.
local Verbose = linkiir.node.dev()

function main(Data)
  if Verbose then print('input: ' .. Data) end
end
```

