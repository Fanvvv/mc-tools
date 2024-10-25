import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {OutputType, useFileStore } from "@/hooks/file-store"
import { useOpenAI } from "@/hooks/openai"
import { Button } from "@/components/ui/button"
function Rules() {
  // const { outputType, setOutputType } = useFileStore()
  const { getApiKey, getBaseURL, setApiKey, setBaseURL } = useOpenAI()
  const [activeTab, setActiveTab] = useState<string>('audio')
  const [openAIKey, setOpenAIKey] = useState<string>(async () => await getApiKey() || '')
  const [openAIBaseURL, setOpenAIBaseURL] = useState<string>(async () => await getBaseURL() || '')
  useEffect(() => {
    getApiKey().then((key) => setOpenAIKey(key || ''))
    getBaseURL().then((url) => setOpenAIBaseURL(url || ''))
  }, [])
  const save = () => {
    if (openAIKey && openAIBaseURL) {
      setApiKey(openAIKey)
      setBaseURL(openAIBaseURL)
    }
  }
  return (
    <div className="space-y-2 mx-5 py-5">
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audio">转音频</TabsTrigger>
            <TabsTrigger value="text">转文本</TabsTrigger>
          </TabsList>
          <TabsContent value="audio">
            <div>
              <Label htmlFor="output-type" className="flex-shrink-0 mr-2 font-bold">转换类型:</Label>
              {
                // 实现单选按钮组
                Object.values(OutputType).map((type) => (
                  <div key={type}>
                    {type}
                  </div>
                ))
              }
            </div>
          </TabsContent>

          <TabsContent value="text">
            <div className="flex items-center">
              <Label htmlFor="openai-base-url" className="flex-shrink-0 mr-2">baseURL</Label>
              <Input id="openai-base-url" type="text" value={openAIKey} onChange={(e) => setOpenAIBaseURL(e.target.value)} placeholder="输入您的 OpenAI baseURL" />
            </div>
            <div className="flex items-center">
              <Label htmlFor="openai-key" className="flex-shrink-0 mr-2">OpenAI 密钥</Label>
              <Input id="openai-key" type="password" value={openAIBaseURL} onChange={(e) => setOpenAIKey(e.target.value)} placeholder="输入您的 OpenAI 密钥" />
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
