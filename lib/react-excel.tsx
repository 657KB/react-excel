import { useEffect, useRef, useState } from 'react'
import { VariableSizeGrid } from 'react-window'
import { useSizeRecord } from './hooks'
import { Excel } from './excel'
import { Cell } from './cell'
import AutoSizer from 'react-virtualized-auto-sizer'

type Cell = {
  rowIndex: number
  columnIndex: number
  value: string
}

type ReactExcelProps = {
  input?: Uint8Array
  borderColor?: string
  cellPadding?: number
  defaultColWidth?: number
  defaultRowHeight?: number
  classNameContainer?: string
  classNameCell?: string
  onReady?: () => void
  onClickCell?: (cell: Cell) => void
}

export const ReactExcel: React.FC<ReactExcelProps> = ({
  input,
  borderColor = 'black',
  cellPadding = 8,
  defaultColWidth = 100,
  defaultRowHeight = 21,
  classNameContainer,
  classNameCell,
  onReady,
  onClickCell,
}) => {
  const [data, setData] = useState<string[][]>([])

  const excel = useRef<Excel | null>(null)
  const grid = useRef<VariableSizeGrid>(null)
  const onReadyRef = useRef(onReady)

  const [getColWidth] = useSizeRecord(defaultColWidth)
  const [getRowHeight] = useSizeRecord(defaultRowHeight)

  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    excel.current = new Excel(input)
    excel.current.onReady(excel => {
      excel.getSheet().then(setData)
      onReadyRef.current?.()
    })
    return () => {
      excel.current?.destroy()
    }
  }, [input, onReady])

  return (
    <AutoSizer>
      {({ width, height }) => {
        const rowCount = data.length
        const columnCount = data[0]?.length || 0
        return (
          <VariableSizeGrid
            ref={grid}
            width={width}
            height={height}
            rowCount={data.length}
            rowHeight={index => getRowHeight(index) + cellPadding}
            columnCount={data[0]?.length || 0}
            columnWidth={index => getColWidth(index) + cellPadding}
            className={classNameContainer}
          >
            {({ rowIndex, columnIndex, style }) => {
              return (
                <Cell
                  rowIndex={rowIndex}
                  columnIndex={columnIndex}
                  rowCount={rowCount}
                  columnCount={columnCount}
                  className={classNameCell}
                  style={style}
                  borderColor={borderColor}
                  padding={cellPadding}
                  onClick={() => {
                    onClickCell?.({
                      rowIndex,
                      columnIndex,
                      value: data[rowIndex][columnIndex],
                    })
                  }}
                >
                  {data[rowIndex][columnIndex]}
                </Cell>
              )
            }}
          </VariableSizeGrid>
        )
      }}
    </AutoSizer>
  )
}

export default ReactExcel
