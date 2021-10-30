export const Waves = (p) => {
  let rows = 90;
  let columns = 40;
  let xSpace = 30;
  let ySpace = 10;

  let yWave;
  console.log(p.windowWidth);
  let xWave;

  let ballSize = 10;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = (color) => {
    const circleColor = color || [255, 255, 10];
    p.background("black");

    let yWaveSize = 40;
    let yWaveLength = 0.5;
    let yWaveOffset = 0.1;
    let yWaveSpeed = 0.03;

    let xWaveSize = 40;
    let xWaveLength = 54;
    let xWaveOffset = 3;
    let xWaveSpeed = 0.03;

    // Center matrix
    p.translate(p.width / 2, p.height / 2);

    // Reposition  matrix depending on width & height of the grid
    p.translate((-(columns - 1) * xSpace) / 2, (-(rows - 1) * ySpace) / 2);

    p.noStroke();
    // for (var i = 0; i < columns; i++) {
    //   for (var j = 0; j < rows; j++) {
    //     yWave =
    //       p.sin(p.frameCount * yWaveSpeed + i * yWaveLength + j * yWaveOffset) *
    //       yWaveSize;
    //     xWave =
    //       p.cos(p.frameCount * xWaveSpeed + j * xWaveLength + i * xWaveOffset) *
    //       xWaveSize;

    //     p.push();
    //     p.translate(i * xSpace, j * ySpace);
    //     p.fill(255);
    //     p.ellipse(0, 0, 2, 2);
    //     p.fill(255, 0, 0, 10);
    //     p.pop();
    //   }
    // }



    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        yWave =
          p.sin(p.frameCount * yWaveSpeed + i * yWaveLength + j * yWaveOffset) *
          yWaveSize;
        xWave =
          p.cos(p.frameCount * xWaveSpeed + j * xWaveLength + i * xWaveOffset) *
          xWaveSize;

        p.push();
        p.translate(i * xSpace, j * ySpace);
        p.fill(0, 159, 227, 100);
        p.ellipse(xWave, yWave, ballSize, ballSize);

        p.fill(230, 0, 126, 100);
        p.ellipse(xWave * 2, yWave * 2, ballSize, ballSize);

        p.fill(255, 50);
        p.ellipse(xWave * 0.4, yWave * 0.4, ballSize, ballSize);
        p.pop();
      }
    }
  };
};
