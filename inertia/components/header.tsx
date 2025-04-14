import { Link, router, usePage } from '@inertiajs/react'

const Header = ({ size = 'base' as 'sm' | 'base' | 'lg', fullWidth = false }) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    base: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  const { user } = usePage().props

  return (
    <>
      <header className="p-4 flex gap-4 h-[fit-content] justify-end w-full">
        {user ? (
          <>
            <Link className="underline text-indigo-500 h-fit self-center" href={'/dashboard'}>
              Dashboard
            </Link>
            <button
              onClick={() => router.visit('/settings')}
              className="w-fit justify-self-end inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg
                className="h-5 w-5 mr-2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 3a.75.75 0 01.75.75v.402a7.503 7.503 0 012.25 0v-.402a.75.75 0 011.5 0v.535a7.48 7.48 0 013.03 1.247l.382-.382a.75.75 0 011.061 1.06l-.382.382a7.48 7.48 0 011.248 3.03h.535a.75.75 0 010 1.5h-.402a7.503 7.503 0 010 2.25h.402a.75.75 0 010 1.5h-.535a7.48 7.48 0 01-1.248 3.03l.382.382a.75.75 0 01-1.06 1.061l-.383-.382a7.48 7.48 0 01-3.03 1.247v.535a.75.75 0 01-1.5 0v-.402a7.503 7.503 0 01-2.25 0v.402a.75.75 0 01-1.5 0v-.535a7.48 7.48 0 01-3.03-1.248l-.382.383a.75.75 0 01-1.061-1.061l.382-.382a7.48 7.48 0 01-1.247-3.03h-.535a.75.75 0 010-1.5h.402a7.503 7.503 0 010-2.25H3a.75.75 0 010-1.5h.535a7.48 7.48 0 011.247-3.03l-.382-.382a.75.75 0 011.06-1.061l.383.382A7.48 7.48 0 019 4.285V3.75A.75.75 0 019.75 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </>
        ) : null}
        <Link
          href={user ? '/logout' : '/login'}
          className={`
        inline-flex items-center justify-center
        border border-transparent
        rounded-md shadow-sm
        font-medium text-white
        bg-indigo-600 hover:bg-indigo-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        transition-colors duration-200
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
      `}
        >
          {user ? (
            <svg
              className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} mr-2`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405 1.405A2.003 2.003 0 0116.586 21H7a2 2 0 01-2-2v-1.586A2.003 2.003 0 016.586 16L8 17h7zM7 9V7a5 5 0 0110 0v2m-10 0a5.002 5.002 0 00-.553 9.95A4.992 4.992 0 007 9z"
              />
            </svg>
          ) : (
            <svg
              className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} mr-2`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          )}
          {user ? 'Logout' : 'Login'}
        </Link>
      </header>
    </>
  )
}

export default Header
