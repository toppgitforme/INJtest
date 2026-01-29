import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log('🚀 main.tsx executing')

const rootElement = document.getElementById('root')
console.log('🎯 Root element:', rootElement)

if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = '<div style="color: white; padding: 20px; background: red;">ERROR: Root element not found</div>'
  throw new Error('Root element not found')
}

console.log('✅ Creating React root...')

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('✅ React root rendered')
} catch (error) {
  console.error('❌ Render error:', error)
  document.body.innerHTML = `<div style="color: white; padding: 20px; background: red;">RENDER ERROR: ${error}</div>`
}
