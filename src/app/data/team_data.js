export const teams = [
  {
    colors: {
      primary: "051ecd",
      secondary: "031768",
      tertiary: "017bcb",
    },
    draw: false,
    entityId: "a82ec9ef-32c2-11ed-93ce-c5cd151fd515",
    isHome: true,
    link: null,
    logo: "https://images.dc.prod.cloud.atriumsports.com/b179b/25aac0efee6a4f33acaa6b025652626f",
    name: "ANADOLU EFES",
    resultPlace: 1,
    resultStatus: "CONFIRMED",
    score: "0",
    secondaryScore: null,
  },
  {
    colors: {
      primary: "0bcac4",
      secondary: "ece1e1",
      tertiary: "caeff0",
    },
    draw: false,
    entityId: "af7e4c88-32c2-11ed-b619-7bbcc08f45bf",
    isHome: false,
    link: null,
    logo: "https://images.dc.prod.cloud.atriumsports.com/b179b/cc2d7c4aa5b745cebdb8e509cf036400",
    name: "TÜRK TELEKOM",
    resultPlace: 2,
    resultStatus: "CONFIRMED",
    score: "0",
    secondaryScore: null,
  },
  {
    colors: {
      primary: "f50707",
      secondary: "039c2a",
      tertiary: "090909",
    },
    draw: false,
    entityId: "acc5d572-32c2-11ed-bf59-7359f0b8a971",
    isHome: false,
    link: null,
    logo: "https://images.dc.prod.cloud.atriumsports.com/b179b/06718828b35147ff9458fa85717ef23f",
    name: "PINAR KARŞIYAKA",
    resultPlace: 2,
    resultStatus: "CONFIRMED",
    score: "0",
    secondaryScore: null,
  },
  {
    colors: {
      primary: "4cae5c",
      secondary: "03a51c",
      tertiary: "02ad26",
    },
    draw: false,
    entityId: "ae236ed4-32c2-11ed-8b28-c7501a97e73a",
    isHome: true,
    link: null,
    logo: "https://images.dc.prod.cloud.atriumsports.com/b179b/aa70b4fbd40e4e86ba96bd6bbaabd99d",
    name: "YUKATEL MERKEZEFENDİ BELEDİYESİ BASKET",
    resultPlace: 2,
    resultStatus: "CONFIRMED",
    score: "0",
    secondaryScore: null,
  },
  {
    colors: {
      primary: "128800",
      secondary: "111111",
      tertiary: "37e319",
    },
    draw: false,
    entityId: "aa5ba5a7-32c2-11ed-b125-f52ce6370eef",
    isHome: true,
    link: null,
    logo: "https://images.dc.prod.cloud.atriumsports.com/b179b/3b8c9babef3346c797290ff7adeca295",
    name: "DARÜŞŞAFAKA LASSA",
    resultPlace: 2,
    resultStatus: "CONFIRMED",
    score: "0",
    secondaryScore: null,
  },
  {
    colors: {
      primary: "edfa25",
      secondary: "1004fb",
      tertiary: "f9f4f4",
    },
    draw: false,
    entityId: "ab31ccff-32c2-11ed-ba57-ab5ff23309a8",
    isHome: false,
    link: null,
    logo: "https://images.dc.prod.cloud.atriumsports.com/b179b/119533dc1ee74e97b659bd27f113065a",
    name: "FENERBAHÇE BEKO",
    resultPlace: 1,
    resultStatus: "CONFIRMED",
    score: "0",
    secondaryScore: null,
  },
];

export const getPopulatedTeams = () => {
  try {
    if (localStorage.getItem("teams") == null) {
      return teams;
    } else {
      return JSON.parse(localStorage.getItem("teams"));
    }
  } catch {
    return teams;
  }
};
