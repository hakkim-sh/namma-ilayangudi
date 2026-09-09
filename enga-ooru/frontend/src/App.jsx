import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PostAdPage from './pages/PostAdPage'
import FeedbackButton from './components/FeedbackButton'

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<HomePage />} /><Route path="/post-ad" element={<PostAdPage />} /></Routes><FeedbackButton /></BrowserRouter>
}

export default App
