import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Main from './pages/Main'
import Dashboard from './pages/Dashboard'
import Axios from 'axios'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'

function App() {
  Axios.defaults.withCredentials = true
  const client = new QueryClient()

  return (
    <QueryClientProvider client={client}>
      <Router>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/dash' element={<Dashboard />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
