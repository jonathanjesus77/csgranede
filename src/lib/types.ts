export type NadeType = "smoke" | "flash" | "molotov" | "he";
export type Side = "CT" | "TR" | "both";
export type Difficulty = "easy" | "medium" | "hard";
export type Tickrate = "subtick" | "64" | "128" | "all";

export interface NadeMedia {
  type: "image" | "gif" | "video_short" | "youtube";
  url: string;
  thumbnail?: string;
}

export interface NadeLineup {
  description: string;
  position: string; // Where to stand
  aim: string;      // Where to aim
  throw_type: "left_click" | "right_click" | "jump_throw" | "run_throw" | "crouch_throw";
  images?: string[];
}

export interface Nade {
  id: string;
  map: string;
  type: NadeType;
  name: string;
  description: string;
  side: Side;
  tickrate: Tickrate;
  difficulty: Difficulty;
  tags: string[];
  lineup: NadeLineup;
  media: NadeMedia[];
  likes?: number;
  verified?: boolean;
  pro_usage?: boolean;
  created_at: string;
}

export interface MapInfo {
  id: string;
  name: string;
  display_name: string;
  image: string;
  thumbnail: string;
  active_duty: boolean;
  callouts_image?: string;
}

export interface FilterState {
  type: NadeType | "all";
  side: Side | "all";
  difficulty: Difficulty | "all";
  tickrate: Tickrate | "all";
  search: string;
  pro_only: boolean;
}
