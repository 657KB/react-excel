import { useEffect, useRef } from 'react'

type Size = { width: number, height: number }

type CellProps = {
  rowIndex: number
  columnIndex: number
  rowCount: number
  columnCount: number
  children: React.ReactNode
  className?: string
  style: React.CSSProperties
  textWrap?: boolean
  padding?: number
  borderColor?: string
  onSizeMeasured?: (size: Size) => void
  onSizeChanged?: (size: Size) => void
} & React.HTMLAttributes<HTMLDivElement>

export const Cell: React.FC<CellProps> = ({
  rowIndex,
  columnIndex,
  rowCount,
  columnCount,
  children,
  className,
  style,
  textWrap = false,
  padding = 0,
  borderColor,
  onSizeMeasured,
  onSizeChanged,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  const onMeasuredSizeRef = useRef(onSizeMeasured)
  const onSizeChangedRef = useRef(onSizeChanged)

  useEffect(() => {
    if (ref.current !== null) {
      const { width, height } = ref.current.getBoundingClientRect()
      onMeasuredSizeRef.current?.({ width, height })
    }

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      onSizeChangedRef.current?.({ width, height })
    })

    if (ref.current !== null) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    onMeasuredSizeRef.current = onSizeMeasured
  }, [onSizeMeasured])

  useEffect(() => {
    onSizeChangedRef.current = onSizeChanged
  }, [onSizeChanged])

  useEffect(() => {
    isFirstRender.current = false
  }, [])

  return (
    <div {...rest} style={style}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div
          ref={ref}
          className={className}
          style={{
            position: textWrap ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            whiteSpace: textWrap ? 'normal' : 'nowrap',
            overflow: textWrap ? 'unset' : 'hidden',
            textOverflow: textWrap ? 'unset' : 'ellipsis',
            cursor: 'pointer',
            boxSizing: 'border-box',
            borderRight: columnIndex === columnCount - 1 ? '' : `1px solid ${borderColor}`,
            borderBottom: rowIndex === rowCount - 1 ? '' : `1px solid ${borderColor}`,
            padding: padding / 2,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default Cell
