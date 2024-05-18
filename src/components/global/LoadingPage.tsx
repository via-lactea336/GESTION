import LoadingCirleIcon from './LoadingCirleIcon'

export default function LoadingPage() {
  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <LoadingCirleIcon className='w-16 h-16 animate-spin' />
    </div>
  )
}