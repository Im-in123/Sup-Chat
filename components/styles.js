
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 10,
        // borderBottomColor: rgb(216, 216, 216),
        // border-bottom-width: 1px,
        // box-shadow: rgb(216, 216, 216) 0px 0px 0px,
        borderBottomWidth:0.5,
        borderBottomColor:"rgb(216, 216, 216)",
        

    },
    rightContainer: {
        flex: 1,
        justifyContent: "center",

    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    text: {
        color: "gray"
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 40,
        marginRight: 10,
    },
    badgeContainer: {
        backgroundColor: "#3777f0",
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "white",
        position: "absolute",
        left: 45,
        top: 10,

    },
    badgeText: {
        color: "white",
        fontSize: 12,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 3,
    },

});

export default styles;