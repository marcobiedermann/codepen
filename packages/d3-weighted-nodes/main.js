(async () => {
  const svg = d3.select(".chart");
  const width = parseInt(svg.attr("width"), 10);
  const height = parseInt(svg.attr("height"), 10);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const radius = d3.scaleSqrt().range([0, 6]);
  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3
        .forceLink()
        .id((d) => d.id)
        .distance(
          (d) => radius(d.source.value / 2) + radius(d.target.value / 2)
        )
        .strength(() => 0.75)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force(
      "collide",
      d3.forceCollide().radius((d) => radius(d.value / 2) + 2)
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

  const graph = await d3.json("data.json");

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(graph.links)
    .enter()
    .append("svg:path")
    .attr("stroke-width", () => 1);

  link
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "2px");

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g")
    .style("transform-origin", "50% 50%")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  node
    .append("circle")
    .attr("r", (d) => radius(d.value / 2))
    .attr("fill", (d) => color(d.group));

  node
    .append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text((d) => d.name);

  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
    link.attr("d", function (d) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);

      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    });

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  }

  function dragstarted(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0.3).restart();
    }

    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }

    d.fx = null;
    d.fy = null;
  }
})();
