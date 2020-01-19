import { IJobType } from "./iResearchData";
import { BonusStack } from "../bonus/bonusStack";

export abstract class ITechnologyData implements IJobType {
  id: string;
  name: string;
  icon: string;
  color?: string;
  darkColor: string;
  lightColor: string;
  bonus?: BonusStack;
  price: Decimal;
  ratio?: number;
}

export const TECHNOLOGIES: { readonly [index: string]: ITechnologyData } = {
  MilitaryEngineering: {
    id: "e",
    name: "Military Engineering",
    icon: "my:upgrade",
    darkColor: "#D4380D",
    lightColor: "#D4380D",
    price: new Decimal(1e3)
  },
  CivilEngineering: {
    id: "i",
    name: "Civil Engineering",
    icon: "setting",
    darkColor: "#FA8C16",
    lightColor: "#FA8C16",
    price: new Decimal(1e3)
  },
  Physics: {
    id: "p",
    name: "Physics",
    icon: "my:atom",
    darkColor: "#5298E4",
    lightColor: "#096DD9",
    price: new Decimal(1e3)
  },
  Materials: {
    id: "m",
    name: "Materials",
    icon: "my:cube",
    darkColor: "#FA8C16",
    lightColor: "#FA8C16",
    price: new Decimal(1e3)
  },
  Propulsion: {
    id: "o",
    name: "Propulsion",
    icon: "my:rocket-thruster",
    darkColor: "#FA8C16",
    lightColor: "#FA8C16",
    price: new Decimal(1e3)
  },
  Computing: {
    id: "c",
    name: "Computing",
    icon: "my:computing",
    darkColor: "#F2F6FF",
    lightColor: "#85A5FF",
    price: new Decimal(1e3)
  },
  Naval: {
    id: "n",
    name: "Naval",
    icon: "my:medal",
    darkColor: "red",
    lightColor: "red",
    price: new Decimal(1e3)
  },
  Search: {
    id: "r",
    name: "Search",
    icon: "my:radar-sweep",
    darkColor: "#7CB305",
    lightColor: "#7CB305",
    price: new Decimal(1e3)
  },
  Energy: {
    id: "t",
    name: "Energy",
    icon: "my:electric",
    darkColor: "#FADB14",
    lightColor: "#FADB14",
    price: new Decimal(1e3)
  }
};
