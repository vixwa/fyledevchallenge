import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { select, selectAll } from 'd3-selection';
interface WorkoutData {
  type: string;
  minutes: number;
}

@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-container">
      <div #chart></div>
    </div>
  `,
  styles: [`
    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;

    }
  `]
})
export class ChartComponent implements OnChanges {
  @Input() userData: WorkoutData[] = [];
  @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;

  ngOnChanges() {
    this.createChart();
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove();
    
    if (!this.userData || this.userData.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'rgba(240,208,184,0.4)');

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.5);
      

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(this.userData, (d: { minutes: any; }) => d.minutes) * 1.1]);    
    x.domain(this.userData.map(d => d.type));

    const bars = svg.selectAll('.bar')
      .data(this.userData)
      bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d: { type: any; }) => x(d.type))
      .attr('width', x.bandwidth())
      .attr('y', (d: { minutes: any; }) => y(d.minutes))
      .attr('height', (d: { minutes: any; }) => height - y(d.minutes))
      .attr('fill', 'rgb(30,41,44)');
      bars
      .exit()
      .remove();

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
      

    svg.append('g')
      .call(d3.axisLeft(y));
  }
}
