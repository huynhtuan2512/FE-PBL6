import { useEffect, useState } from 'react'
import { getOrder } from '../services/orderService'
import { getErrorMessage } from '../services/api'

export function useOrderDetails(order) {
  const [state, setState] = useState({
    orderId: null,
    details: [],
    loading: false,
    error: '',
  })
  const [retryVersion, setRetryVersion] = useState(0)
  const orderId = order?.order_id ?? null
  const inlineDetails = Array.isArray(order?.order_details) ? order.order_details : null

  useEffect(() => {
    if (!orderId) {
      setState({ orderId: null, details: [], loading: false, error: '' })
      return undefined
    }

    if (inlineDetails) {
      setState({ orderId, details: inlineDetails, loading: false, error: '' })
      return undefined
    }

    let cancelled = false
    setState({ orderId, details: [], loading: true, error: '' })
    getOrder(orderId)
      .then((fullOrder) => {
        if (!cancelled) {
          setState({
            orderId,
            details: fullOrder?.order_details ?? [],
            loading: false,
            error: '',
          })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ orderId, details: [], loading: false, error: getErrorMessage(error) })
        }
      })

    return () => {
      cancelled = true
    }
  }, [orderId, inlineDetails, retryVersion])

  const isCurrentOrder = state.orderId === orderId
  return {
    details: isCurrentOrder ? state.details : [],
    loading: orderId !== null && (!isCurrentOrder || state.loading),
    error: isCurrentOrder ? state.error : '',
    retry: () => setRetryVersion((version) => version + 1),
  }
}
