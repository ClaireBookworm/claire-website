import HeadObject from '../components/head'
import Nav from '../components/nav'

export default function Layout({ headChildren, children, active }) {
  return (
    <div>
      <HeadObject>{headChildren}</HeadObject>
      <Nav active={active}/>
      <main className="mt-6 sm:mt-12 md:mt-16 flex flex-col text-white pl-12 md:pl-20">
        {children}
      </main>
      <footer className="text-white mt-8 md:mt-16 pl-12 md:pl-20 mb-5 flex flex-col space-y-4 text-xs sm:text-sm">
        <div className="font-gilroy uppercase opacity-40">
          Copyright {new Date().getFullYear()} Claire Wang.
        </div>
      </footer>
    </div>
  )
}