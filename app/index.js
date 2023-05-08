import React, { useState, useEffect } from "react";
import * as Network from "expo-network";
import * as Battery from "expo-battery";
import * as Cellular from "expo-cellular";
import * as Device from "expo-device";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

// const HomePage = () => {
// sendPosData = async () => {
//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   var raw = JSON.stringify({
//     percentage: (battery * 100).toFixed(0).toString(),
//     ipAddress: networkIpAddress,
//     connectedToInternet: networkState.isConnected,
//     canReachInternet: networkState.isInternetReachable,
//     typeOfConnection: networkState.type,
//     carrierName: carrierName,
//     country: country,
//     deviceBrand: device.brand,
//     deviceName: device.name,
//     deviceManufacturer: device.manufacturer,
//   });

//   var requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//   };

//   fetch("http://localhost:4000", requestOptions)
//     .then((response) => response.text())
//     .then((result) => console.log(result))
//     .catch((error) => console.log("error", error));
// };

//   useEffect(() => {
//     // sendPosData();

//     // await runMonitoring();
//     // const interval = setInterval(() => {
//     //   sendPosData();
//     // }, 60 * 1000);

//     // return () => clearInterval(interval);

//     runMonitoring();
//   });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>ZORACOM POS MONITORING (RESEARCH)</Text>
//       <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
//         Battery Info
//       </Text>
//       <Text>Percentage: {(battery * 100).toFixed(0)}%</Text>
//       <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
//         Network Info
//       </Text>
//       <Text>IP Address: {networkIpAddress}</Text>
//       <Text>
//         Connected to internet: {networkState.isConnected ? "true" : "false"}
//       </Text>
//       <Text>
//         Can Reach internet:
//         {networkState.isInternetReachable === true ? "true" : "false"}
//       </Text>
//       <Text>Type of connection: {networkState.type}</Text>
//       <Text>Carrier Name: {carrierName}</Text>
//       <Text>Country: {country}</Text>
//       <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
//         Device Info
//       </Text>

//       <Text>Brand: {device.brand}</Text>
//       <Text>Name: {device.name}</Text>
//       <Text>Manufacturer: {device.manufacturer}</Text>
//     </View>
//   );
// };

// export default HomePage;

const API_URL = "https://zpm.onrender.com/";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [battery, setBattery] = useState(0);
  const [networkIpAddress, setNetworkIpAddress] = useState("");
  const [networkState, setNetworkState] = useState({
    isConnected: false,
    isInternetReachable: false,
    type: null,
  });
  const [carrierName, setCarrierName] = useState("");
  const [country, setCountry] = useState("");
  const [device, setDevice] = useState({
    brand: null,
  });

  const runMonitoring = async () => {
    Battery.getBatteryLevelAsync().then((b) => setBattery(b));
    const expoNetworkIpAddress = await Network.getIpAddressAsync();
    setNetworkIpAddress(expoNetworkIpAddress);
    const expoNetworkState = await Network.getNetworkStateAsync();
    setNetworkState({
      isConnected: expoNetworkState.isConnected,
      isInternetReachable: expoNetworkState.isInternetReachable,
      type: expoNetworkState.type,
    });
    const carrierName = await Cellular.getCarrierNameAsync();
    setCarrierName(carrierName);
    const country = await Cellular.getIsoCountryCodeAsync();
    setCountry(country);
    setDevice({
      brand: Device.brand,
      name: Device.deviceName,
      manufacturer: Device.manufacturer,
    });
  };

  const handlePress = async () => {
    setIsLoading(true);
    await runMonitoring();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          percentage: (battery * 100).toFixed(0).toString(),
          ipAddress: networkIpAddress,
          connectedToInternet: networkState.isConnected,
          canReachInternet: networkState.isInternetReachable,
          typeOfConnection: networkState.type,
          carrierName: carrierName,
          country: country,
          deviceBrand: device.brand,
          deviceName: device.name,
          deviceManufacturer: device.manufacturer,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await runMonitoring();
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.text}>ZORACOM POS MONITORING (RESEARCH)</Text>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
          Battery Info
        </Text>
        <Text>Percentage: {(battery * 100).toFixed(0)}%</Text>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
          Network Info
        </Text>
        <Text>IP Address: {networkIpAddress}</Text>
        <Text>
          Connected to internet: {networkState.isConnected ? "true" : "false"}
        </Text>
        <Text>
          Can Reach internet:
          {networkState.isInternetReachable === true ? "true" : "false"}
        </Text>
        <Text>Type of connection: {networkState.type}</Text>
        <Text>Carrier Name: {carrierName}</Text>
        <Text>Country: {country}</Text>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
          Device Info
        </Text>
        <Text>Brand: {device.brand}</Text>
        <Text>Name: {device.name}</Text>
        <Text>Manufacturer: {device.manufacturer}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Sending..." : "Send Data"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
