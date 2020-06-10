import { ChartwerkBase, VueChartwerkBaseMixin } from '@chartwerk/base';

import { HeatmapTimeSerie, HeatmapOptions } from './types';

import * as d3 from 'd3';
import * as _ from 'lodash';


export class ChartwerkHeatmapPod extends ChartwerkBase<HeatmapTimeSerie, HeatmapOptions> {

  constructor(el: HTMLElement, _series: HeatmapTimeSerie[] = [], _options: HeatmapOptions = {}) {
    super(d3, el, _series, _options);
  }

  _renderMetrics(): void {
  }

  get amountOfItemsInRow(): number {
    return Math.ceil(Math.sqrt(this._series.length));
  }

  // TODO: make implementing optional
  // Non-abstract class 'ChartwerkHeatmapPod' does not implement inherited abstract member 'renderSharedCrosshair'
  renderSharedCrosshair(): void { }
  hideSharedCrosshair(): void { }
  onMouseMove(): void { }
  onMouseOut(): void { }
  onMouseOver(): void { }

  get yScale(): d3.ScaleLinear<number, number> {
    console.log(this._series.length / this.amountOfItemsInRow)
    return this._d3.scaleLinear()
      .domain([
        Math.ceil(this._series.length / this.amountOfItemsInRow),
        0
      ])
      .range([0, this.height]);
  }

  // TODO: d3.scaleLinear<number, number>
  get xScale(): any {
    return this._d3.scaleLinear()
      .domain([
        0,
        this.amountOfItemsInRow
      ])
      .range([0, this.width]);
  }
}

// it is used with Vue.component, e.g.: Vue.component('chartwerk-Heatmap-pod', VueChartwerkHeatmapPodObject)
export const VueChartwerkHeatmapPodObject = {
  // alternative to `template: '<div class="chartwerk-Heatmap-pod" :id="id" />'`
  render(createElement) {
    return createElement(
      'div',
      {
        class: { 'chartwerk-Heatmap-pod': true },
        attrs: { id: this.id }
      }
    )
  },
  mixins: [VueChartwerkBaseMixin],
  methods: {
    render() {
      const pod = new ChartwerkHeatmapPod(document.getElementById(this.id), this.series, this.options);
      pod.render();
    }
  }
};
