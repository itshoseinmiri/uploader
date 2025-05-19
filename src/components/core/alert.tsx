import LoadingSpinner from "./spinner";

import check from '../../assets/icons/check.svg'
import close from '../../assets/icons/close.svg'
import cancel from '../../assets/icons/cancel.svg'
import retry from '../../assets/icons/retry.svg'
interface AlertProps {
    name: string;
    size: string;
    status: 'Completed' | 'Uploading' | 'Failed';
    progress?: number;
    onRetry: () => void
    onDelete: () => void
}

const Alert = ({ name, size, status, progress, onRetry, onDelete }: AlertProps) => {
    const statuses = {
        Failed: 'Failed — Too Large',
        Completed: 'Completed',
        Uploading: 'Uploading'
    }
    const statusMap = {
        Completed: {
            icon: check,
            color: '#32B587',
            text: 'Completed'
        },
        Uploading: {
            icon: 'loading',
            color: '#3CA5F1',
            text: 'Uploading'
        },
        Failed: {
            icon: close,
            color: '#F13C72',
            text: 'Failed'
        }
    }
    const currentStatus = statusMap[status]

    return (
        <>
            <div className='w-full relative flex items-center justify-between mt-[9px] py-[9.5px] px-2.5 border border-solid border-[#EDEDED] rounded-md bg-[#FAFAFA]'>
                <div className='flex items-center gap-1'>
                    {currentStatus.icon === 'loading' ? <LoadingSpinner /> : <img src={currentStatus.icon} alt={status} />}
                    <p className='font-normal flex items-center'>
                        <span className='text-[#2E2D2D] text-left max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis inline-block interTight text-sm'>{name}</span>
                        <span className={`${currentStatus.text === 'Failed' ? 'text-[#F13C72]' : 'text-[#9B9B9B]'} interTight text-left text-xs mx-1`}>({size})</span>
                    </p>
                </div>
                <div className='flex items-center gap-[7px]'>
                    <div className='border border-[#DDDDDD] h-[22px] px-2.5 gap-1 flex items-center rounded-md'>
                        <span className='w-[7px] h-[7px] rounded-[2px] block' style={{ backgroundColor: currentStatus.color }}></span>
                        <span className='text-xs font-normal text-[#2E2D2D] interTight'>{statuses[currentStatus.text as keyof typeof statuses]}</span>
                    </div>
                    <div className='border w-[22px] h-[22px] cursor-pointer border-[#DDDDDD] flex items-center justify-center rounded-md'>
                        {
                            currentStatus.text === 'Failed' ? <img src={retry} alt="cancel" width="11px" onClick={onRetry} /> : <img src={cancel} alt="cancel" width="6px" height="6px" onClick={onDelete} />
                        }
                    </div>
                </div>
            </div>
            {currentStatus.icon === 'loading' &&
                <div className="px-2.5 relative bottom-1">
                    <div className="h-[3px] rounded-t-2xl bg-black transition-all duration-200" style={{ width: progress ? `${progress}%` : '0%' }}></div>
                </div>
            }
        </>
    )
}

export default Alert