const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center space-x-8">
          <a href="#" className="text-base text-gray-500 hover:text-gray-900">
            About
          </a>
          <a href="#" className="text-base text-gray-500 hover:text-gray-900">
            Features
          </a>
          <a href="#" className="text-base text-gray-500 hover:text-gray-900">
            Pricing
          </a>
          <a href="#" className="text-base text-gray-500 hover:text-gray-900">
            Docs
          </a>
          <a href="#" className="text-base text-gray-500 hover:text-gray-900">
            Contact
          </a>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Access Manager. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
