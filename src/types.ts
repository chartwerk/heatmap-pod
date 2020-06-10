import { TimeSerie, Options, TickOrientation, TimeFormat } from '@chartwerk/base';

export type HeatmapTimeSerie = TimeSerie;
export type HeatmapOptions = Options;

export { TickOrientation, TimeFormat };

export type HeatmapData = {
  x: string,
  y: string,
  value: number
}

export type ColorRange = {
  min: string,
  max: string
}

export type ValueRange = {
  min: number,
  max: number
}
