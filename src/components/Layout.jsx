import Sidebar from './Sidebar'
import Header from './Header'
import AwarenessStrip from './AwarenessStrip'
import GlobalSearch from './GlobalSearch'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[200px] min-h-screen">
        <AwarenessStrip />
        <Header />
        <main className="flex-1 p-5 max-w-[1200px] w-full">
          {children}
        </main>
      </div>
      <GlobalSearch />
    </div>
  )
}
