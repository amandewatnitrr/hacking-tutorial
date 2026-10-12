import { useEffect, useState } from "react"

const STORAGE_KEY = "hack-ui-ask-root-password"

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function useRootPasswordSetting() {
  const [askForPassword, setAskForPassword] = useState(readStored)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, askForPassword ? "1" : "0")
    } catch {
      // private browsing / blocked storage: setting still applies this session
    }
  }, [askForPassword])

  return { askForPassword, setAskForPassword }
}
