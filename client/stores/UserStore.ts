import Axios from 'axios';
import Cookies from 'js-cookie';
import io from "socket.io-client";
import { makeAutoObservable, autorun, runInAction } from 'mobx';

export default class UserStore {
  nickname: string;
  invicode: string;
  isAuth: boolean;

  constructor() {
    makeAutoObservable(this);
  
    this.nickname = "";
    this.invicode = "";
    this.isAuth = false;

    autorun(() => {
      console.log('set nickname - ', this.nickname);
    })
    autorun(() => {
      console.log('set invicode - ', this.invicode);
    })
    autorun(() => {
      console.log('isAuth - ', this.isAuth);
    })
  }

  setNickname(nickname: string) {
    this.nickname = nickname;
  }

  setInvicode(invicode: string) {
    this.invicode = invicode;
    Cookies.set("invicode", invicode, { expires: 30 });
  }  

  async requestAuth() {
    try {
      const result = await Axios.get(`/api/auth`, {
        withCredentials: true,
      });
      runInAction(() => {
        this.isAuth = result.data.success;
      });
    } catch (error) {
      runInAction(() => {
        this.isAuth = error.response.data.success;
      });
    }
  }
}