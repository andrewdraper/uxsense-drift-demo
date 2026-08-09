import type { ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export default function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
