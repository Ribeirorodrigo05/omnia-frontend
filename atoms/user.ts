import { atom } from "jotai";

export type UserAtom = {
  id?: string;
  role?: string;
};

export const userAtom = atom<UserAtom>({});
export const setUserAtom = atom(null, (get, set, newUser: UserAtom) => {
  set(userAtom, newUser);
});
