import React from 'react'
import Layout from './layout'

const File = ({ content }: { content: string }) => {
  return (
    <main className="h-[100%] bg-gray-50 p-6">
      <section></section>
    </main>
  )
}
File.layout = (page: React.ReactNode) => <Layout children={page} />
export default File
