import { insideGraph } from "../../../assets/assest.js";

export const dynamicGraph = (interestProfileData) => {
  const colorMap = {
    Realistic: ["#D97196", "#A03B7C"],
    Investigative: ["#E7A337", "#D3452F"],
    Artistic: ["#FF5454", "#AA1A1A"],
    Social: ["#ECB62B", "#F5DE57"],
    Enterprising: ["#4C7F98", "#77C8C3"],
    Conventional: ["#4638A3", "#7C6FCF"],
  };

  const chartOptions = {
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
      },
    },
    series: [
      {
        name: "Nightingale Chart",
        type: "pie",
        radius: [50, 200],
        center: ["50%", "50%"],
        roseType: "area",
        label: {
          show: true, // Hide labels (names)
          emphasis: {
            show: false, // Hide labels on hover
          },
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        data: interestProfileData?.results?.result.map((interest) => {
          const [startColor, endColor] = colorMap[interest.area] || ["#000", "#333"];
          return {
            value: interest.score,
            name: interest.area,
            itemStyle: {
              color: {
                type: "linear",
                x: 1,
                y: 1,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: startColor },
                  { offset: 1, color: endColor },
                ],
              },
            },
          };
        }),
      },
    ],
    graphic: {
      type: "image",
      style: {
        image: insideGraph,
        width: 100,
        height: 100,
      },
      left: "center",
      top: "center",
    },
  };

  return chartOptions;
};
