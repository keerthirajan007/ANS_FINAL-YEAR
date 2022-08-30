import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import React from "react";

const CustomInput = ({ control, rules, name, placeholder, ...props }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <TextInput
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
              style={styles.input}
              placeholder={placeholder}
              {...props}
            />
          </View>
          {error && (
            <Text style={{ color: "red", alignSelf: "stretch" }}>
              {error.message || "Error"}
            </Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    padding: 10,
  },
});

export default CustomInput;
