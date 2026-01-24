import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const classes = [
    baseClasses,
    errorClasses,
    widthClasses,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={classes}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input