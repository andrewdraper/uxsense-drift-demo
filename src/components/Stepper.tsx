const STEPS = ['Search', 'Choose train', 'Passenger', 'Payment', 'Confirmation'] as const

export default function Stepper({ current }: { current: number }) {
  return (
    <ol className="stepper" aria-label="Booking progress">
      {STEPS.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : 'todo'
        return (
          <li className={`stepper__step stepper__step--${state}`} key={step}>
            <span className="stepper__index">{index + 1}</span>
            <span className="stepper__label">{step}</span>
          </li>
        )
      })}
    </ol>
  )
}
