import { Err } from '@/types'

interface props {
    error?: Err | null
    retryLabel?: string
    onRetry?: () => any
}

export default function ErrorOver({ error, retryLabel, onRetry }: props) {
    return (
        <div className="fixed top-0 right-0 w-full h-full  z-50  justify-center place-items-center">
            <div
                role="status"
                className={` top-0 left-0  w-full flex flex-col items-center  h-full   justify-center min-h-80  z-50 bg-gray-50`}
            >
                <h2 className="text-red-500 mb-2">{error?.messaggioErrore}</h2>
                {retryLabel && (
                    <button
                        className="cursor-pointer py-2 px-4 rounded shadow border-0 bg-blue-500 text-white"
                        onClick={onRetry}
                    >
                        {retryLabel}
                    </button>
                )}
            </div>
        </div>
    )
}
