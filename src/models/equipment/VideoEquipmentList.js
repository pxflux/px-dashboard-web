import { ListOfType } from "../ListOfType";
import { VideoEquipment } from "./VideoEquipment";

/**
 * @prop {constructor} DataType
 * @prop {array} list
 */
export class VideoEquipmentList extends ListOfType {
  constructor(jsonData) {
    super(VideoEquipment, jsonData);
  }
}
