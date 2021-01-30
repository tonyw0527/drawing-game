import UserStore from "./UserStore";
import { enableStaticRendering } from "mobx-react";

enableStaticRendering(typeof window === "undefined");

export default class RootStore {
  userStore;

  constructor() {
    this.userStore = new UserStore();
  }
}
