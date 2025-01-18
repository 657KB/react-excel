import { useCallback, useEffect, useRef } from 'react'

type SizeRecord = Map<number, number>

export const useSizeRecord = (defaultSize: number) => {
  const record = useRef<SizeRecord>(new Map())

  const getSize = useCallback((index: number) => {
    return record.current.get(index) || defaultSize
  }, [defaultSize])

  const setSize = useCallback((index: number, size: number) => {
    record.current.set(index, size)
  }, [])

  useEffect(() => {
    const recordRef = record.current
    return () => {
      recordRef.clear()
    }
  }, [])

  return [getSize, setSize] as [typeof getSize, typeof setSize]
}
