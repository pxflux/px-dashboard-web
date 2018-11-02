export default {
  // some precalculated angles
  // angle90: Math.PI / 2,
  // angle180: Math.PI,
  // getPointOnParallelDistanceWithAngle(
  //   p,
  //   angle,
  //   distToParallel,
  //   angleOfParallel
  // ) {
  //   /* <pre>
  //       _?________
  //         \ ⤒ dist
  //    angle_\⤓_____
  //    p
  //   </pre> */
  //   if (!angleOfParallel) angleOfParallel = 0;
  //   const distanceToThePoint = distToParallel / Math.tan(angle);
  //   const pointOnParallel = this.getPointAtDistanceWithAngle(
  //     p,
  //     angleOfParallel - this.angle90,
  //     distToParallel
  //   );
  //   return this.getPointAtDistanceWithAngle(
  //     pointOnParallel,
  //     angleOfParallel - this.angle180,
  //     distanceToThePoint
  //   );
  // },
  // getPointAtDistanceWithAngle(p0, angle, dist) {
  //   /* <pre>
  //        ?
  //         \ dist
  //    angle_\
  //    p0
  //   </pre> */
  //   var x = Math.cos(angle) * dist + p0.x;
  //   var y = Math.sin(angle) * dist + p0.y;
  //   return point(x, y);
  // }
};
