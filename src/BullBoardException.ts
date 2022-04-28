import { Exception } from "@adonisjs/core/build/standalone";

export default class BullBoardException extends Exception {
  constructor(message: string, code: string = "E_BULL_BOARD_EXCEPTION") {
    super(message, 500, code);
  }
}
