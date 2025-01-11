import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Header from './frontend/components/header.jsx'
import LineDrawingDemo from './frontend/components/title.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
function Main() {
return (
  <>
  <div className="bg-white h-screen">
  <Header/>
  <div className="flex justify-center items-center">
  <div>
  <LineDrawingDemo/>
  </div>
  </div>




  </div>
  </>

);
}
export default Main;
