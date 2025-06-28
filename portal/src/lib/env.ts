interface Env {
  VITE_SERVER_URL: string
}

function getEnv(): Env {
  return {
    VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
  }
}

export const env = getEnv()
