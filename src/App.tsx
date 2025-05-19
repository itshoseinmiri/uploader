import Uploader from './components/app/Uploader'
import logo from './assets/Logo.svg'

const App = () => {
  const UploaderProps = {
    formats: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg']
    },
    size: 2
  }

  return (
    <>
      <div>
        <img src={logo} className="mx-auto" alt="logo" />
        <h1 className='font-semibold tracking-tighter !text-[40px]'>
          <span className='text-[#2F2F2F]'>Upload Your</span> <span className='text-[#8E949D]'>Files</span>
        </h1>
      </div>
      <Uploader formats={UploaderProps.formats} maxSize={UploaderProps.size} />
    </>
  )
}

export default App