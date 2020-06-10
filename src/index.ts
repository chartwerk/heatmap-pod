import { ChartwerkBase, VueChartwerkBaseMixin } from '@chartwerk/base';

import { HeatmapTimeSerie, HeatmapOptions, ColorRange, ValueRange, HeatmapData } from './types';

import * as d3 from 'd3';
import * as _ from 'lodash';


const DEFAULT_COLOR_RANGE: ColorRange = {
  min: 'white',
  max: '#69b3a2'
};

const DEFAULT_VALUE_RANGE: ValueRange = {
  min: 0,
  max: 1
};

export class ChartwerkHeatmapPod extends ChartwerkBase<HeatmapTimeSerie, HeatmapOptions> {
  // TODO: move to options
  private _colorRange = DEFAULT_COLOR_RANGE;
  private _valueRange = DEFAULT_VALUE_RANGE;
  private xScaleBand: any;
  private yScaleBand: any;

  constructor(el: HTMLElement, _series: HeatmapTimeSerie[] = [], _options: HeatmapOptions = {}) {
    super(d3, el, _series, _options);
  }

  private _renderScaleBand() {
    this.xScaleBand = d3.scaleBand()
      .range([0, this.width])
      .domain(this.axisX);

    this._chartContainer.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(this.xScaleBand))

    this.yScaleBand = d3.scaleBand()
      .range([this.height, 0])
      .domain(this.axisY);

    this._chartContainer.append('g')
      .call(d3.axisLeft(this.yScaleBand));
  }

  _renderMetrics(): void {
    this._renderScaleBand();

    let myColor = this._d3.scaleLinear()
      .range(this.colorRangeList)
      .domain(this.valueRangeList)

    this._chartContainer.selectAll()
      .data(this.heatmapData)
      .enter()
      .append('rect')
      .attr('x', (d: HeatmapData) => this.xScaleBand(d.x))
      .attr('y', (d: HeatmapData) => this.yScaleBand(d.y))
      .attr('width', this.xScaleBand.bandwidth())
      .attr('height', this.yScaleBand.bandwidth())
      .style('fill', (d: HeatmapData) => myColor(d.value));
  }

  private get valueRangeList(): [number, number] {
    return [this._valueRange.min, this._valueRange.max]
  }

  private get colorRangeList(): [any, any] {
    return [this._colorRange.min, this._colorRange.max]
  }

  private get heatmapData(): HeatmapData[] {
    if (this._series === undefined) {
      return [];
    }
    const layerX = this.axisX;
    const layerY = this.axisY;

    let heatmapData = [];
    for (let i = 0; i < this._series.length; i++) {
      // TODO: series should not always be timeseries but @chartwerk/base doesn't agree with that
      // @ts-ignore
      for (let j = 0; j < this._series[i].length; j++) {
        heatmapData.push(
          { x: layerX[i], y: layerY[j], value: this._series[i][j] }
        );
      }
    }
    return heatmapData;
  }

  get axisX(): string[] | undefined {
    if(this._series === undefined) {
      return undefined;
    }
    return this._series.map((el: any, index: number) => 'x' + index);
  }

  get axisY(): string[] | undefined {
    if(this._series === undefined || this._series.length === 0) {
      return undefined;
    }
    // @ts-ignore
    return this._series[0].map((el: any, index: number) => 'y' + index);
  }

  // TODO: make implementing optional
  // Non-abstract class 'ChartwerkHeatmapPod' does not implement inherited abstract member 'renderSharedCrosshair'
  renderSharedCrosshair(): void { }
  hideSharedCrosshair(): void { }
  onMouseMove(): void { }
  onMouseOut(): void { }
  onMouseOver(): void { }
}

// it is used with Vue.component, e.g.: Vue.component('chartwerk-Heatmap-pod', VueChartwerkHeatmapPodObject)
export const VueChartwerkHeatmapPodObject = {
  // alternative to `template: '<div class="chartwerk-Heatmap-pod" :id="id" />'`
  render(createElement) {
    return createElement(
      'div',
      {
        class: { 'chartwerk-heatmap-pod': true },
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
