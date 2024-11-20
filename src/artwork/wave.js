export const Waves = (p) => {
  let rows = 90;
  let columns = 40;
  let xSpace = 60;
  let ySpace = 40;

  let yWave;
  let xWave;

  let ballSize = 45;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = (color) => {
    p.background("black");

    let yWaveSize = 10;
    let yWaveLength = 10;
    let yWaveOffset = 300;
    let yWaveSpeed = 0.03;

    let xWaveSize = 30;
    let xWaveLength = 14;
    let xWaveOffset = 100;
    let xWaveSpeed = 0.03;

    p.translate(p.width / 2, p.height / 2);
    p.translate((-(columns - 1) * xSpace) / 2, (-(rows - 1) * ySpace) / 2);
    p.noStroke();

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
        p.fill(100, 70);
        p.ellipse(xWave, yWave, ballSize, ballSize);

        p.fill(10, 100);
        p.ellipse(xWave * 2, yWave * 2, ballSize, ballSize);

        p.fill(50, 50);
        p.ellipse(xWave * 0.4, yWave * 0.4, ballSize, ballSize);
        p.pop();
      }
    }
  };
};
