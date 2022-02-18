import { useContext } from 'react'
import { RefreshContext } from '../contexts/RefreshContext'

export default function useRefresh() {
  const { fast, slow } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow }
}
