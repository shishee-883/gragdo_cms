import { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children?: ReactNode
}

export function FormField({ id, label, required = false, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-black">
        {label}{required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface InputFieldProps extends FormFieldProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  register?: any
  icon?: ReactNode
}

export function InputField({ 
  id, 
  label, 
  required = false, 
  error, 
  type = "text", 
  placeholder = "", 
  value,
  onChange,
  register,
  icon
}: InputFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="h-12 rounded-lg border-gray-300 focus:border-[#7165e1] focus:ring-[#7165e1]"
          value={value}
          onChange={onChange}
          {...(register || {})}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
    </FormField>
  )
}

interface SelectFieldProps extends FormFieldProps {
  placeholder?: string
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
}

export function SelectField({ 
  id, 
  label, 
  required = false, 
  error, 
  placeholder = "Select", 
  options,
  value,
  onValueChange
}: SelectFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 rounded-lg border-gray-300">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}

interface RadioGroupFieldProps extends FormFieldProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  register?: any
}

export function RadioGroupField({ 
  id, 
  label, 
  required = false, 
  error, 
  options,
  value,
  onChange,
  register
}: RadioGroupFieldProps) {
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <div className="flex gap-4 pt-2">
        {options.map(option => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              {...(register || {})}
              className="w-4 h-4 text-[#7165e1] border-gray-300 focus:ring-[#7165e1]"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </FormField>
  )
}