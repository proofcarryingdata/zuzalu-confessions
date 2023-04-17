export const IS_PROD = process.env.NODE_ENV === "production";

export const PASSPORT_URL = IS_PROD
  ? "https://zupass.org/"
  : "http://localhost:3000/";

export const PASSPORT_SERVER_URL = IS_PROD
  ? "https://api.pcd-passport.com/"
  : "http://localhost:3002/";

export const CONFESSIONS_SERVER_URL = IS_PROD
  ? "https://confessions-server.onrender.com/"
  : "http://localhost:3005/";

export const PARTICIPANTS_URL = PASSPORT_SERVER_URL + "semaphore/1";
export const RESIDENTS_URL = PASSPORT_SERVER_URL + "semaphore/2";
export const VISITORS_URL = PASSPORT_SERVER_URL + "semaphore/3";

export interface SGroup {
  name: string;
  url: string;
}

export const ALL_GROUPS: SGroup[] = [
  {
    name: "participants",
    url: PARTICIPANTS_URL,
  },
  {
    name: "residents",
    url: RESIDENTS_URL,
  },
  {
    name: "visitors",
    url: VISITORS_URL,
  },
];
