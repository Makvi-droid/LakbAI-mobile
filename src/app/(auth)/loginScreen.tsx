import { ScrollView, View, StyleSheet, Text } from "react-native";


export default function logInScreen(){
    return(
    <ScrollView >
        <View style={styles.scrollContainer}>
            <Text>Login</Text>
        </View>
        
    </ScrollView>
    );
}


const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },



})