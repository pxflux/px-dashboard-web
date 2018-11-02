import { ListOfType } from "../ListOfType";
import { AudioEquipment } from "./AudioEquipment";

/**
 * @prop {constructor} DataType
 * @prop {array} list
 */
export class AudioEquipmentList extends ListOfType {
  constructor(jsonData) {
    super(AudioEquipment, jsonData);
  }
}
