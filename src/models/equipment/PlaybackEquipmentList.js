import { ListOfType } from "../ListOfType";
import { PlaybackEquipment } from "./PlaybackEquipment";

/**
 * @prop {constructor} DataType
 * @prop {array} list
 */
export class PlaybackEquipmentList extends ListOfType {
  constructor(jsonData) {
    super(PlaybackEquipment, jsonData);
  }
}
