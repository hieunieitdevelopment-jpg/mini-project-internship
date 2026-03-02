import { useEffect } from 'react'

function App() {

  useEffect(() => {
    fetch('http://localhost:3000/units')
      .then(res => res.json())
      .then(data => console.log(data))
  }, [])

  return <h1>Admin Map System</h1>
}

export default App