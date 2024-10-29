import { useState } from "react"
import { useLocalStorageState } from 'ahooks'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AUDIO_OUTPUT_TYPES, TEXT_OUTPUT_TYPES, AudioOutputType, TextOutputType, OutputType, useFileStore } from "@/hooks/file-store"
import { OpenAIEnum } from "@/types/openai"
import { ButtonGroup, ButtonGroupItem } from "@/components/radio-button-group"

function Rules() {
  const { setOutputType } = useFileStore()
  const [activeTab, setActiveTab] = useState<string>('audio')
  const [openAIKey, setOpenAIKey] = useLocalStorageState<string>(OpenAIEnum.API_KEY, {
    defaultValue: '',
  })
  const [openAIBaseURL, setOpenAIBaseURL] = useLocalStorageState<string>(OpenAIEnum.BASE_URL, {
    defaultValue: 'https://free.gpt.ge/v1',
  })

  const [audioOutputType, setAudioOutputType] = useState<AudioOutputType>(AUDIO_OUTPUT_TYPES[0])
  const [textOutputType, setTextOutputType] = useState<TextOutputType>(TEXT_OUTPUT_TYPES[0])

  return (
    <div className="space-y-2 mx-5 py-5">
      <div>
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value)
          setOutputType(value === 'audio' ? audioOutputType : textOutputType)
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio">转音频</TabsTrigger>
            <TabsTrigger value="text">转文本</TabsTrigger>
          </TabsList>
          <TabsContent value="audio">
            <div className="flex items-center">
              <Label htmlFor="output-type" className="flex-shrink-0 mr-2 font-bold">转换类型:</Label>
              <ButtonGroup value={audioOutputType} onValueChange={(value) => {
                setAudioOutputType(value as AudioOutputType)
                setOutputType(value as OutputType)
              }}>
                {AUDIO_OUTPUT_TYPES.map((type) => (
                  <ButtonGroupItem key={type} value={type} icon={<></>} label={type} />
                ))}
              </ButtonGroup>
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="flex items-center">
              <Label htmlFor="output-type" className="flex-shrink-0 mr-2 font-bold">转换类型:</Label>
              <ButtonGroup value={textOutputType} onValueChange={(value) => {
                setTextOutputType(value as TextOutputType)
                setOutputType(value as OutputType)
              }}>
                {TEXT_OUTPUT_TYPES.map((type) => (
                  <ButtonGroupItem key={type} value={type} icon={<></>} label={type} />
                ))}
              </ButtonGroup>
            </div>
            <div className="flex items-center my-2">
              <Label htmlFor="openai-base-url" className="flex-shrink-0 mr-2 font-bold">baseURL:</Label>
              <Input
                id="openai-base-url"
                type="text"
                value={openAIBaseURL}
                onChange={(e) => setOpenAIBaseURL(e.target.value)}
                placeholder="输入您的 OpenAI baseURL"
                className="w-[500px]"
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="openai-key" className="flex-shrink-0 mr-2 font-bold">OpenAI 密钥:</Label>
              <Input
                id="openai-key"
                type="password"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="输入您的 OpenAI 密钥"
                className="w-[500px]"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Rules
