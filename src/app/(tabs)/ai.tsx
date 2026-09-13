import { ChatHeader, ChatInput, EmptyState, MessageBubble, TypingIndicator } from "@/components/ai";
import { useChatSession } from "@/hooks/useChatSession";
import { useBottomTabBarHeight } from "expo-router/js-tabs";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIScreen() {
  const { messages, loading, sending, error, sendMessage, startNewSession } = useChatSession();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);
  const tabBarHeight = useBottomTabBarHeight();

  const handleSend = useCallback(
    (text?: string) => {
      const toSend = text ?? input;
      if (!toSend.trim() || sending) return;
      setInput("");
      sendMessage(toSend);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    },
    [input, sending, sendMessage]
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ChatHeader onNewSession={startNewSession} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{ paddingBottom: tabBarHeight }}
      >
        {messages.length === 0 && !sending ? (
          <EmptyState onPickSuggestion={(s) => handleSend(s)} />
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => String(item.message_id)}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={sending ? <TypingIndicator /> : null}
          />
        )}

        {error && (
          <Animated.View entering={FadeInUp} className="mx-4 mb-2 bg-red-50 rounded-lg px-3 py-2">
            <Text className="text-red-600 text-sm">{error}</Text>
          </Animated.View>
        )}

        <ChatInput value={input} onChangeText={setInput} onSend={() => handleSend()} sending={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}