import { Table, TableWrapper, Rows } from "react-native-table-component";
import Modal from "react-native-modal";
import {
  View,
  StyleSheet,
  Button,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import React from "react";

export let modalData;
export let setModalData;
export let isModalVisible;
export let setModalVisible;
export let zoneDescription;
export let setZoneDescription;
export let webHeight;
export let setWebHeight;

export const PopupWindow = () => {
  [modalData, setModalData] = React.useState([]);
  [zoneDescription, setZoneDescription] = React.useState([]);
  [isModalVisible, setModalVisible] = React.useState(false);
  [webHeight, setWebHeight] = React.useState(100);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="zoomInDown"
      animationOut="zoomOutUp"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackdropPress={toggleModal}
      hasBackdrop={false}
    >
      <ScrollView style={{ flex: 1, maxHeight: "70%" }}>
        <View style={tableStyles.container}>
          <Table borderStyle={{ borderWidth: 1 }}>
            <TableWrapper style={tableStyles.wrapper}>
              <Rows
                data={modalData}
                flexArr={[1, 2]}
                style={tableStyles.row}
                textStyle={tableStyles.text}
              />
            </TableWrapper>
          </Table>
          {zoneDescription}
          <View style={{ flex: 1, alignItems: "flex-end", padding: 5 }}>
            <Pressable style={tableStyles.close} onPress={toggleModal}>
              <Text style={{ textAlign: "center", color: "white" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const tableStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30,
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  wrapper: { flexDirection: "row" },
  title: { flex: 1, backgroundColor: "#f6f8fa" },
  row: { height: 28 },
  text: { textAlign: "center" },
  close: {
    backgroundColor: "#3b71f3",
    borderRadius: 5,
    padding: 8,
    width: "40%",
  },
});
