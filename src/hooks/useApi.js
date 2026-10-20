import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../services/api'

export function useApi(fetcher, { interval = 0, enabled = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher
  const reload = useCallback(async ({ silent = false } = {}) => {
    if (!enabled) return
    if (!silent) setLoading(true)
    try {
      setData(await fetcherRef.current())
      setError('')
      setLastUpdated(new Date().toISOString())
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [enabled])
  useEffect(() => {
    if (!enabled) {
      setData(null)
      setLoading(false)
      setError('')
      setLastUpdated(null)
      return undefined
    }
    reload()
    if (!interval) return undefined
    const timer = window.setInterval(() => reload({ silent: true }), interval)
    return () => window.clearInterval(timer)
  }, [enabled, reload, interval])

  return { data, loading, error, reload, lastUpdated }
}