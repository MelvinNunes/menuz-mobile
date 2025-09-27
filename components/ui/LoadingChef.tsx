import { Image, View, Text, Animated } from "react-native"
import { useEffect, useState, useRef } from "react"



interface LoadingChefProps {
    loadingMessages: string[]
}

export default function LoadingChef({ loadingMessages }: LoadingChefProps) {
    const [progress, setProgress] = useState(0)
    const [currentMessage, setCurrentMessage] = useState(0)
    const fadeAnim = useRef(new Animated.Value(1)).current
    const scaleAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0
                return prev + Math.random() * 8 + 2 // More realistic progress
            })
        }, 300)

        const messageInterval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
        }, 2000)

        return () => {
            clearInterval(progressInterval)
            clearInterval(messageInterval)
        }
    }, [])

    useEffect(() => {
        // Fade animation for message changes
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.3,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start()
    }, [currentMessage])

    useEffect(() => {
        // Subtle scale animation for the chef
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.05,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [])

    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 38,
            backgroundColor: "#FFF"
        }}>
            <Animated.View style={{
                transform: [{ scale: scaleAnim }]
            }}>
                <Image
                    source={require("@/assets/gifs/3D_Chef_Dancing.gif")}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.Text style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1F2937",
                marginTop: 32,
                marginBottom: 24,
                textAlign: "center",
                opacity: fadeAnim
            }}>
                {loadingMessages[currentMessage]}
            </Animated.Text>

            <View style={{
                width: "100%",
                height: 8,
                backgroundColor: "#E5E7EB",
                borderRadius: 4,
                overflow: "hidden",
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2
            }}>
                <Animated.View style={{
                    width: `${Math.min(progress, 100)}%`,
                    height: "100%",
                    backgroundColor: "#FF6B35",
                    borderRadius: 4,
                    shadowColor: "#FF6B35",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3
                }} />
            </View>
        </View>
    );
}