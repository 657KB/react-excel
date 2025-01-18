import * as Excelize from 'excelize-wasm'

export class Excel {
  private file: Excelize.NewFile | null = null
  private excelize: ReturnType<typeof Excelize.init> | null = null
  private onReadyListeners = new Set<(instance: Excel) => void>()
  private available = false

  constructor(input?: Uint8Array) {
    this.excelize = Excelize.init('https://cdn.jsdelivr.net/npm/excelize-wasm@0.0.7/excelize.wasm.gz')
    this.excelize.then(excelize => {
      if (input) {
        this.file = excelize.OpenReader(input)
      } else {
        this.file = excelize.NewFile()
        const { index } = this.file.NewSheet('Sheet1')
        this.file.SetActiveSheet(index)
      }
      this.available = true
      this.notifyReady()
    })
  }

  public destroy() {
    this.file = null
    this.excelize = null
    this.onReadyListeners.clear()
    this.available = false
  }

  public onReady(callback: (instance: Excel) => void) {
    this.onReadyListeners.add(callback)
  }

  public notifyReady() {
    this.onReadyListeners.forEach(callback => callback(this))
  }

  private getFile() {
    if (!this.available)
      throw new Error('not available')
    if (this.file === null)
      throw new Error('not ready')
    return this.file
  }

  public getColWidth(sheet: string, col: number) {
    const file = this.getFile()
    const colLabel = Excel.transformColLabel(col)
    const { width, error } = file.GetColWidth(sheet, colLabel)
    if (error) throw new Error(error)
    console.log(colLabel, width)
    return width
  }

  public getRowHeight(sheet: string, row: number) {
    const file = this.getFile()
    const { height, error } = file.GetRowHeight(sheet, row + 1)
    if (error) throw new Error(error)
    console.log(row, height)
    return height
  }
 
  public setSheet(sheet: string, row: number, col: number, value: string | number) {
    const file = this.getFile()
    const cell = Excel.transformCellPosition(row, col)
    const { error } = file.SetCellValue(sheet, cell, value)
    if (error) throw new Error(error)
  }

  public async getSheet(sheet?: string) {
    const file = this.getFile()
    if (!sheet) {
      sheet = await this.getActiveSheetName()
    }
    const { result, error } = file.GetRows(sheet)
    if (error) throw new Error(error)
    return result
  }

  public getSheetList() {
    const file = this.getFile()
    const { list } = file.GetSheetList()
    return list
  }

  public getSheetCount() {
    const file = this.getFile()
    const { list } = file.GetSheetList()
    return list.length
  }

  public getActiveSheetIndex() {
    const file = this.getFile()
    const { index, error } = file.GetActiveSheetIndex()
    if (error) throw new Error(error)
    return index
  }

  public getSheetName(index: number) {
    const file = this.getFile()
    const { name, error } = file.GetSheetName(index)
    if (error) throw new Error(error)
    return name
  }

  public getActiveSheetName() {
    const index = this.getActiveSheetIndex()
    return this.getSheetName(index)
  }

  public async toBlob() {
    const file = this.getFile()
    const { buffer, error } = file.WriteToBuffer()
    if (error) throw new Error(error)
    return buffer
  }

  static transformCellPosition(row: number, col: number): string {
    return `${Excel.transformColLabel(col)}${row + 1}`;
  }

  static transformColLabel(col: number): string {
    let colLabel = ''
    while (col >= 0) {
      colLabel = String.fromCharCode('A'.charCodeAt(0) + col % 26) + colLabel
      col = Math.floor(col / 26) - 1
    }
    return colLabel;
  }
}
