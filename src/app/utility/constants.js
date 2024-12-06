import { match_data1 } from "../data/match_data1";
import { match_data2 } from "../data/match_data2";
import { match_data3 } from "../data/match_data3";
import { match_data4 } from "../data/match_data4";

export const matches = [match_data1, match_data2, match_data3, match_data4];

export const eventOptions = [
  {code: "İki Sayı", key: "pointsTwoMade", name: "2SB",},
  {code: "Üç Sayı", key: "pointsThreeMade", name: "3SB",},
  {code: "Serbest Atış", key: "freeThrowsMade", name: "BSA",},
  {code: "Hücum Ribaundu", key: "reboundsOffensive", name: "HR",},
  {code: "Savunma Ribaundu", key: "reboundsDefensive", name: "SR",},
  {code: "Top Çalma", key: "steals", name: "TÇ",},
  {code: "Blok", key: "blocks", name: "BL",},
  {code: "Faul", key: "foulsTotal", name: "FA",},
];
