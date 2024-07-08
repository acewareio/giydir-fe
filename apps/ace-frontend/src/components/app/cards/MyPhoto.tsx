import Link from 'next/link'
import React from 'react'

type Props = {}

function MyPhoto({ }: Props) {
    return (
        <Link href="/app" className='h-56 w-64 bg-white rounded-md p-4 shadow-sm'>
            <div className="w-full h-full rounded-lg bg-neutral-100 p-4" />
        </Link>
    )
}

export default MyPhoto