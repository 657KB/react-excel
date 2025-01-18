# React Excel

> working on progress

A React component for Excel file editing.

## Features

- High-performance rendering
- Read/Write Excel files directly
- Use `Excelize` as backend

## Get Started

Add `react-excel` to your project:

```bash
pnpm install react-excel
```

Use the component:

```jsx
import { useEffect, useState } from 'react'
import ReactExcel from 'react-excel'

function Demo() {
  const [input, setInput] = useState<Uint8Array>()

  useEffect(() => {
    fetch('/sample.xlsx').then(async response => {
      const input = new Uint8Array(await response.arrayBuffer())
      setInput(input)
    })
  }, [])

  return (
    <div>
      <ReactExcel
        input={input}
        classNameContainer='container'
      />
    </div>
  )
}

export default Demo

```

## TODO

- [ ] Add/Remove sheets  
- [ ] Add/Remove rows and columns  
- [ ] Drag to change row height or column width  
- [ ] Style cells  
- [ ] Export Excel file  
- [ ] Support formula  
