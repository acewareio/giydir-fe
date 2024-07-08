import React from 'react'

interface Props {
    children: React.ReactNode

}

function FeatureIcon({ children }: Props) {
    return (
        <div className='flex items-center justify-center bg-white border border-neutral-200 button-outline h-12 w-12 rounded-full'>
            {children}
        </div>
    )
}

export default FeatureIcon