<template>
  <canvas ref="canvas" v-on:resize="updateCanvasSize"></canvas>
</template>

<script>
/**
 * @typedef {{objectBounds: ClientRect, type: string}} Connector
 * @typedef {{video: Connector[], audio: Connector[]}} GroupedConnectors
 *
 * @typedef {{x:number, y:number, w:number, type: string}} Point
 * @typedef {{type: string, points: Point[] }} PointsGroup
 */
export default {
  name: "connectors-canvas",
  props: [
    /** @type GroupedConnectors */
    "startConnectors",
    /** @type GroupedConnectors */
    "endConnectors",
    "trigger"
  ],

  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");
  },
  watch: {
    trigger: function() {
      this.draw();
    }
  },

  computed: {
    colors() {
      return {
        video: "rgba(115, 253, 234, 0.6)",
        audio: "rgba(248, 186, 0, 0.6)"
      };
    }
  },
  data() {
    return {
      ctx: null,
      pixDensity: window.devicePixelRatio || 1,
      w: 0,
      h: 0,
      t: 0,
      l: 0,
      lineColor: this.color ? this.color : "#ccc",
      lineW: 1,
      specialTypes: ["projection"],
      options: {
        projectionBeamH: 30,
        projectorRay: 4
      }
    };
  },
  methods: {
    draw() {
      this.updateCanvasSize();

      const ctx = this.ctx;
      const lineWidth = this.lineW * this.pixDensity;
      ctx.clearRect(0, 0, this.w, this.h);

      this.convert().forEach(({ startPoint, endPoint, strokeColor }) => {
        let endY = endPoint.y;
        if (endPoint.type === "projection") {
          endY -=
            (this.options.projectionBeamH + this.options.projectorRay * 3) *
            this.pixDensity;
        }
        const half = (endPoint.y - startPoint.y) / 2;
        const c1x = startPoint.x;
        const c1y = startPoint.y + half;
        const c2x = endPoint.x;
        const c2y = endY - half;

        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, endPoint.x, endY);
        ctx.stroke();
        this.drawEndPoint(endPoint);
      });
    },
    /**
     * @param {Point} endPoint
     */
    drawEndPoint(endPoint) {
      const ctx = this.ctx;
      const originY =
        endPoint.y - this.options.projectionBeamH * this.pixDensity;
      const rayH = this.options.projectorRay * this.pixDensity;
      switch (endPoint.type) {
        case "projection":
          // BULB
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,0,0,0.4)";
          // ctx.lineWidth = 1 / this.pixDensity
          ctx.save();
          ctx.translate(
            Math.floor(endPoint.x) - 0.5,
            Math.floor(originY) - rayH * 1.5 - 0.5
          );
          for (let i = 0; i < 5; i++) {
            ctx.moveTo(0, -rayH);
            ctx.lineTo(0, rayH);
            ctx.rotate((Math.PI * 2) / 8);
          }
          ctx.stroke();
          ctx.restore();

          // LIGHT BEAM
          ctx.beginPath();
          ctx.strokeStyle = "rgba(0,0,0,0.07)";
          ctx.fillStyle = "rgba(255,255,255,0.65)";
          ctx.lineWidth = 1 / this.pixDensity;
          ctx.moveTo(endPoint.x, endPoint.y);
          ctx.lineTo(endPoint.x, originY);
          ctx.lineTo(endPoint.x + endPoint.w, endPoint.y);
          ctx.fill();
          ctx.stroke();
          break;
        default:
      }
    },
    updateCanvasSize() {
      const bounds = this.$refs.canvas.parentElement.getBoundingClientRect();
      this.w = (bounds.right - bounds.left) * this.pixDensity;
      this.h = (bounds.bottom - bounds.top) * this.pixDensity;

      this.$refs.canvas.width = this.w;
      this.$refs.canvas.height = this.h;
    },
    convert() {
      const canvasBounds = this.$refs.canvas.parentElement.getBoundingClientRect();
      const points = [];
      this.startConnectors.audio.forEach((
        /** @type Connector */ connector,
        i
      ) => {
        points.push({
          startPoint: this.connectorToPoint(connector, canvasBounds),
          endPoint: this.connectorToPoint(
            this.endConnectors.audio[i],
            canvasBounds
          ),
          strokeColor: this.colors.audio
        });
      });
      this.startConnectors.video.forEach((
        /** @type Connector */ connector,
        i
      ) => {
        points.push({
          startPoint: this.connectorToPoint(connector, canvasBounds),
          endPoint: this.connectorToPoint(
            this.endConnectors.video[i],
            canvasBounds
          ),
          strokeColor: this.colors.video
        });
      });
      return points;
    },
    /**
     * @param {Connector} connector
     * @param canvasBounds
     * @return {Point}
     */
    connectorToPoint(connector, canvasBounds) {
      let widthPlacement = connector.type === "projection" ? 0 : 0.5;
      let heightPlacement = connector.type === "socket" ? 1 : 0;
      return {
        type: connector.type,
        x:
          (connector.objectBounds.left +
            connector.objectBounds.width * widthPlacement -
            canvasBounds.left) *
          this.pixDensity,
        y:
          (connector.objectBounds.top +
            connector.objectBounds.height * heightPlacement -
            canvasBounds.top) *
          this.pixDensity,
        w: connector.objectBounds.width * this.pixDensity
      };
    }
  }
};
</script>
