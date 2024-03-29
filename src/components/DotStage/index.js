import React, { useRef, useEffect } from "react";
const d3 = { ...require("d3-selection"), ...require("d3-force") };

import scaleCanvas from "../../lib/scaleCanvas";

import styles from "./styles.scss";

export default props => {
  const el = useRef(null);

  const init = async () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;

    const nodes = [];
    const nodesToAdd = [];
    const duration = 2;

    const config = {
      startTime: false,
      ticks: 0,
      animReqId: null
    };

    for (let i = 0; i < 0; i++) {
      nodes.push({
        targetX: centerX,
        targetY: centerY
      });
    }

    const canvas = d3
      .select(el.current)
      .append("canvas")
      .attr("width", width)
      .attr("height", height);

    const ctx = canvas.node().getContext("2d");

    scaleCanvas(canvas.node(), ctx, width, height);

    const simulation = d3
      .forceSimulation([])
      .force(
        "x",
        d3
          .forceX()
          .strength(0.05)
          .x(d => d.targetX)
      )
      .force(
        "y",
        d3
          .forceY()
          .strength(0.05)
          .y(d => d.targetY)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-1.8)
          .theta(0.9)
      )
      .alpha(1)
      .alphaDecay(0.01)
      .alphaMin(0.25)
      .velocityDecay(0.4)
      .stop();

    simulation.nodes(nodes).stop();

    for (let i = 0; i < 130; i++) {
      simulation.tick();
    }

    const render = () => {
      const nodes = simulation.nodes();
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fill();
      }

      return nodes;
    };

    const animate = (time, nodesToAdd) => {
      if (!config.startTime) {
        config.startTime = time;
      }

      const progress = time - config.startTime;
      const nodes = render();
      const newNodes = [];

      for (let i = 0; i < nodesToAdd.length; i++) {
        const node = nodesToAdd[i];
        if (node.delay < progress) {
          newNodes.push(node);
          nodesToAdd.splice(i, 1);
          i--;
        }
      }

      simulation
        .nodes(nodes.concat(newNodes))
        .alpha(1)
        .tick();

      config.ticks++;

      if (config.ticks < 1800 || nodesToAdd.length > 0) {
        config.animReqId = requestAnimationFrame(t => animate(t, nodesToAdd));
      }
    };

    render();

    // Additional nodes
    for (let i = 0; i < 1000; i++) {
      nodesToAdd.push({
        x: centerX + width * Math.sin(Math.random() * (2 * Math.PI)),
        y: centerY + width * Math.cos(Math.random() * (2 * Math.PI)),
        delay: Math.random() * (duration * 1000),
        targetX: centerX,
        targetY: i < 500 ? centerY - 100 : centerY + 100
      });
    }

    let count = requestAnimationFrame(t => animate(t, nodesToAdd));
  };

  useEffect(() => {
    init();
  });
  return <div ref={el} className={styles.root}></div>;
};
