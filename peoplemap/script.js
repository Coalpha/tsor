const svg = d3.select('svg');
const width = innerWidth;
const height = innerHeight;
svg
  .attr('width', width)
  .attr('height', height);
const div = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

const color = d3.scaleOrdinal(d3.schemeCategory20);
const manyBody = d3.forceManyBody();
const simulation = d3.forceSimulation()
  .force('link', d3.forceLink().id(d => d.id).strength(0.01))
  .force('charge', manyBody)
  .force('center', d3.forceCenter(width / 2, height / 2));
const dragstarted = (d) => {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
};
const dragged = (d) => {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
};
const dragended = (d) => {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
};
d3.json('people.json', (error, graph) => {
  if (error) {
    throw error;
  }
  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(graph.links)
    .enter()
    .append('line')
    .attr('stroke-width', d => Math.sqrt(d.value || 3))
    .attr('strength', () => 0.1);

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(graph.nodes)
    .enter()
    .append('circle')
    .attr('r', 10)
    .attr('fill', d => d.g || 'black')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    .on('mouseover', (d) => {
      div.transition()
        .duration(200)
        .style('opacity', 0.9);
      div.html(`${d.id}<br/>Group: ${d.g}`)
    })
    .on('mouseout', () => {
      div.transition()
        .duration(500)
        .style('opacity', 0);
    });
  const ticked = () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  };
  node.append('title')
    .text(d => d.id);

  simulation
    .nodes(graph.nodes)
    .on('tick', ticked);
  simulation.force('link')
    .links(graph.links);
});
