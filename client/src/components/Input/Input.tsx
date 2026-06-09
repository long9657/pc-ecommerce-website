import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string
  className?: string
  placeholder?: string
  register: UseFormRegister<any>
  errorMessage?: string
  name: string
  rules?: RegisterOptions
  autocomplete?: string
}
function Input({ autocomplete, name, type, className, placeholder, register, errorMessage, rules }: Props) {
  return (
    <div>
      <div className={className}>
        <input
          type={type}
          {...register(name, rules)}
          className='p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
          placeholder={placeholder}
          autoComplete={autocomplete}
        />
        <div className='mt-1 text-red-600 min-h-[1rem] text-sm'>{errorMessage}</div>
      </div>
    </div>
  )
}

export default Input
