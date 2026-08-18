

import Navbar from '@/components/Navbar'
import Jumbotron from './components/Jumbotron'
import BlogList from './components/BlogList'

export const dynamic = 'force-dynamic'
const Home = () => {
  return (
    <div>
      <Navbar  />
      <Jumbotron />
      <BlogList />
      </div>
  )
}

export default Home