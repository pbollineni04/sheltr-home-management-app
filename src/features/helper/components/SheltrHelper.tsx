"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Brain, Send, Home, Lightbulb, Wrench, DollarSign, MessageCircle } from "lucide-react"

const SheltrHelper = () => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hi! I'm your Sheltr Helper. I can answer any homeownership questions, give maintenance tips, and offer second opinions on your projects. What would you like to know?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])

  const quickQuestions = [
    {
      icon: Wrench,
      text: "How often should I replace HVAC filters?",
      category: "Maintenance",
    },
    {
      icon: DollarSign,
      text: "What's a reasonable budget for kitchen renovation?",
      category: "Budgeting",
    },
    {
      icon: Home,
      text: "How to improve home energy efficiency?",
      category: "Energy",
    },
    {
      icon: Lightbulb,
      text: "Best practices for home security?",
      category: "Security",
    },
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        content:
          "Thanks for your question! Based on your home profile, here's my recommendation... [This would be a real AI response in the actual app]",
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setMessage(question)
  }

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Sheltr Helper</h2>
        <p className="text-gray-600">Your AI assistant for all homeownership questions</p>
      </div>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Quick Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((question, index) => {
              const IconComponent = question.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto p-4 text-left bg-transparent"
                  onClick={() => handleQuickQuestion(question.text)}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <p className="font-medium">{question.text}</p>
                      <p className="text-sm text-gray-500">{question.category}</p>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col p-0">
          {/* Messages Container - Fixed height with scroll */}
          <div className="h-80 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "assistant" && (
                  <Avatar className="w-8 h-8 bg-orange-100 flex-shrink-0">
                    <Brain className="w-4 h-4 text-orange-600" />
                  </Avatar>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {msg.sender === "user" && (
                  <Avatar className="w-8 h-8 bg-blue-100 flex-shrink-0">
                    <Home className="w-4 h-4 text-blue-600" />
                  </Avatar>
                )}
              </div>
            ))}
          </div>

          {/* Input - Fixed at bottom */}
          <div className="flex-shrink-0 p-6 pt-0 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about your home..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Tailored Advice</h3>
            <p className="text-sm text-gray-600">Based on your home type and location</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Lightbulb className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
            <p className="text-sm text-gray-600">Tips to improve efficiency and value</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Second Opinion</h3>
            <p className="text-sm text-gray-600">Cross-check your ideas and budgets</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SheltrHelper
