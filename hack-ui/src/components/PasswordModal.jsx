import { useState } from "react"

export function PasswordModal({ title, onSubmit, onSkip, onCancel }) {
  const [password, setPassword] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(password)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 id="password-modal-title" className="modal__title">
          Open as root
        </h2>
        <p className="modal__body">
          Enter the root password to run <strong>{title}</strong> in a root shell. Sent once, straight
          to <code className="mono">sudo</code> on this machine over the local connection &mdash; never stored.
        </p>
        <input
          type="password"
          className="modal__input"
          placeholder="root password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className="modal__actions">
          <button type="button" className="modal__button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="modal__button" onClick={onSkip}>
            Open without root
          </button>
          <button type="submit" className="modal__button modal__button--primary" disabled={!password}>
            Unlock
          </button>
        </div>
      </form>
    </div>
  )
}
