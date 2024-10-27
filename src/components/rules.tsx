import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AUDIO_OUTPUT_TYPES, TEXT_OUTPUT_TYPES, AudioOutputType, TextOutputType, OutputType, useFileStore } from "@/hooks/file-store"
import { Button } from "@/components/ui/button"
import { OpenAIEnum } from "@/types/openai"
import { ButtonGroup, ButtonGroupItem } from "@/components/radio-button-group"

function Rules() {
  const { setOutputType } = useFileStore()
  const [activeTab, setActiveTab] = useState<string>('audio')
  const [openAIKey, setOpenAIKey] = useState<string>(() => localStorage.getItem(OpenAIEnum.API_KEY) || '')
  const [openAIBaseURL, setOpenAIBaseURL] = useState<string>(() => localStorage.getItem(OpenAIEnum.BASE_URL) || '')

  const [audioOutputType, setAudioOutputType] = useState<AudioOutputType>(AUDIO_OUTPUT_TYPES[0])
  const [textOutputType, setTextOutputType] = useState<TextOutputType>(TEXT_OUTPUT_TYPES[0])
  const save = () => {
    if (openAIKey && openAIBaseURL) {
      localStorage.setItem(OpenAIEnum.API_KEY, openAIKey)
      localStorage.setItem(OpenAIEnum.BASE_URL, openAIBaseURL)
    }
  }
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
              <Label htmlFor="openai-base-url" className="flex-shrink-0 mr-2">baseURL</Label>
              <Input 
              id="openai-base-url" 
              type="text" 
              value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} 
              placeholder="输入您的 OpenAI baseURL"
              />
            </div>
            <div className="flex items-center">
              <Label htmlFor="openai-key" className="flex-shrink-0 mr-2">OpenAI 密钥</Label>
              <Input id="openai-key" type="password" value={openAIBaseURL} onChange={(e) => setOpenAIBaseURL(e.target.value)} placeholder="输入您的 OpenAI 密钥" />
            </div>
            <Button onClick={save}>保存</Button>
          </TabsContent>
        </Tabs>
      </div>
      {/* <div className="flex items-center">
        <Label htmlFor="output-type" className="flex-shrink-0 mr-2 font-bold">转换类型:</Label>
        <Select value={outputType} onValueChange={setOutputType}>
          <SelectTrigger id="output-type" className="w-[180px]">
            <SelectValue placeholder="选择转换类型" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(OutputType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <Label htmlFor="openai-key" className="flex-shrink-0 mr-2">OpenAI 密钥</Label>
          <Input
            id="openai-key"
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="输入您的 OpenAI 密钥"
          />
        </div>
      </div> */}
    </div>
  )
}

export default Rules
