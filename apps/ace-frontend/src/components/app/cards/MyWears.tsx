import Link from 'next/link'
import React from 'react'

type Props = {}

function MyWears({ }: Props) {
    return (
        <Link href="/app" className='h-56 w-64 bg-white rounded-md grid grid-rows-3 grid-cols-4 grid-flow-col gap-4 p-4 shadow-sm'>
            <div className="rounded-lg col-span-2 bg-neutral-100 p-4" />
            <div className="rounded-lg row-span-2 col-span-2 bg-neutral-100 p-4" />
            <div className="rounded-lg row-span-3 col-span-2 bg-neutral-100 p-4" />
        </Link>
    )
}

export default MyWears