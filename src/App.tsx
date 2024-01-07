import classNames from 'classnames'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

class RatingError {
  message: string

  constructor(message: string) {
    this.message = message
  }
}

type Rating = {
  id: number
  value: number
  active: boolean
}

const App = () => {
  const [rating, setRating] = useState<Rating[]>([
    {
      id: 1,
      value: 1,
      active: false,
    },
    {
      id: 2,
      value: 2,
      active: false,
    },
    {
      id: 3,
      value: 3,
      active: false,
    },
    {
      id: 4,
      value: 4,
      active: false,
    },
    {
      id: 5,
      value: 5,
      active: false,
    },
  ])

  const [submitted, setSubmitted] = useState<Rating | null>(null)

  const onRate = (id: number) => {
    const updatedRating = [...rating].map(item => {
      if (item.id === id) item.active = !item.active
      else item.active = false
      return item
    })

    setRating(updatedRating)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      const data = rating.filter(item => item.active)
      if (!data.length) {
        throw new RatingError('You have to select one rating to submit')
      }

      toast
        .promise(
          new Promise((resolve, reject) => {
            const callbacks = [resolve, reject]
            setTimeout(() => {
              callbacks[Math.round(Math.random())]('')
            }, 1000)
          }),
          {
            loading: 'Submitting',
            success: 'Successfully rated',
            error: 'Something went wrong',
          }
        )
        .then(() => setSubmitted(data[0]))
        .catch(() => setSubmitted(null))
    } catch (reason) {
      if (reason instanceof RatingError) toast.error(reason.message)
      else {
        toast.error('Something went wrong')
        console.log(`Cannot submit because of ${reason}`)
      }
    }
  }

  return (
    <main>
      <div className="h-screen bg-very-dark-blue flex justify-center items-center p-4">
        <div className="bg-dark-blue text-medium-grey p-6 rounded-xl max-w-[23rem]">
          {!submitted && (
            <form onSubmit={onSubmit}>
              <div className="relative inline-block p-3 rounded-full mb-5">
                <img
                  src="/images/icon-star.svg"
                  alt="Star icon"
                  className="relative z-[1]"
                />
                <span className="w-full h-full absolute top-0 left-0 bg-medium-grey rounded-full z-0 opacity-20" />
              </div>

              <h1 className="text-white font-bold text-3xl mb-2">
                How did we do?
              </h1>
              <p className="mb-5">
                Please let us know how we did with your support request. All
                feedback is appreciated to help us improve our offering!
              </p>

              <div className="flex justify-between items-center gap-5">
                {rating.map(item => (
                  <button
                    type="button"
                    key={item.id}
                    className={classNames(
                      'font-bold relative rounded-full w-full aspect-square mb-5 btn-rating',
                      item.active && 'active'
                    )}
                    onClick={() => onRate(item.id)}
                  >
                    {item.value}
                    <span className="w-full h-full absolute top-0 left-0 bg-medium-grey rounded-full z-0 opacity-20" />
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="bg-orange text-white w-full uppercase tracking-widest font-bold py-3 rounded-full btn-submit"
              >
                Submit
              </button>
            </form>
          )}

          {submitted && (
            <div className="text-center">
              <img
                src="/images/illustration-thank-you.svg"
                alt="Thanks for submitting"
                className="inline-block
                mt-4 mb-8"
              />

              <div className="inline-block text-orange relative py-1 px-3 mb-8">
                You selected {submitted.value} out of {rating.length}
                <span className="w-full h-full absolute top-0 left-0 bg-medium-grey rounded-full z-0 opacity-20" />
              </div>

              <h1 className="text-white font-bold text-3xl mb-2">Thank you!</h1>
              <p className="mb-5">
                We appreciate you taking the time to give a rating. If you ever
                need more support, don't hesitate to get in touch!
              </p>
            </div>
          )}
        </div>
      </div>

      <Toaster />
    </main>
  )
}

export default App
