'use client'

import { useFilter, type FilterParams } from "."

export default function FromFilterParam<T>({
  filters
}: {
  filters: FilterParams<T>[]
}) {
  const kits = filters.map(o => useFilter(o.title, o.options, o.toList))
  return <div>{kits.map((k, i) => k.c())}</div>
}