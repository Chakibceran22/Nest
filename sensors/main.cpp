#include <mosquitto.h>
#include <iostream>

void on_connect(struct mosquitto *mosq, void *obj, int rc) {
    if (rc == 0) {
        std::cout << "Connected successfully!" << std::endl;
        mosquitto_subscribe(mosq, NULL, "test/topic", 0);
    } else {
        std::cout << "Connection failed with code " << rc << std::endl;
    }
}

void on_message(struct mosquitto *mosq, void *obj, const struct mosquitto_message *message) {
    std::cout << "Received message: " << (char*)message->payload << " on topic " << message->topic << std::endl;
}

int main() {
    // Initialize the Mosquitto library
    mosquitto_lib_init();

    // Create a new Mosquitto client instance
    struct mosquitto *mosq = mosquitto_new(NULL, true, NULL);
    if (!mosq) {
        std::cerr << "Failed to create Mosquitto instance!" << std::endl;
        return 1;
    }

    // Set up callback functions
    mosquitto_connect_callback_set(mosq, on_connect);
    mosquitto_message_callback_set(mosq, on_message);

    // Connect to the MQTT broker (e.g., Eclipse MQTT Broker)
    int ret = mosquitto_connect(mosq, "mqtt.eclipse.org", 1883, 60); // Broker: mqtt.eclipse.org, Port: 1883
    if (ret != MOSQ_ERR_SUCCESS) {
        std::cerr << "Failed to connect to broker!" << std::endl;
        mosquitto_destroy(mosq);
        return 1;
    }

    // Start the message loop
    mosquitto_loop_start(mosq);

    // Keep the program running to listen for incoming messages
    std::cout << "Press Enter to exit." << std::endl;
    std::cin.get();

    // Clean up
    mosquitto_loop_stop(mosq, true);
    mosquitto_destroy(mosq);
    mosquitto_lib_cleanup();

    return 0;
}
