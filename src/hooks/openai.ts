import localforage from 'localforage'

const openaiStore = localforage.createInstance({
  name: 'openai',
})

enum OpenAI {
  API_KEY = 'apiKey',
  BASE_URL = 'baseURL',
}

export const useOpenAI = () => {
  const setApiKey = async (key: string) => await openaiStore.setItem(OpenAI.API_KEY, key)
  const getApiKey = async (): Promise<string | undefined> => await openaiStore.getItem(OpenAI.API_KEY) as string | undefined
  const removeApiKey = async () => await openaiStore.removeItem(OpenAI.API_KEY)
  const setBaseURL = async (url: string) => await openaiStore.setItem(OpenAI.BASE_URL, url)
  const getBaseURL = async (): Promise<string | undefined> => await openaiStore.getItem(OpenAI.BASE_URL) as string | undefined
  const removeBaseURL = async () => await openaiStore.removeItem(OpenAI.BASE_URL)

  return {
    setApiKey,
    getApiKey,
    removeApiKey,
    setBaseURL,
    getBaseURL,
    removeBaseURL,
  }
}
