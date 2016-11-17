export interface iStylingObject {
  aspectRatio: number[],
  backgroundColor: string[],
  chartBody: {
    hAxis: {
      fontSize: number[],
      gridLines: {
        opacity: number[],
        stroke: string[],
        strokeWidth: number[]
      },
      label: {
        fontSize: number[],
        fontWeight: string[],
        marginTop: number[]
      },
      stroke: string[],
      strokeWidth: number[],
      ticks: {
        labelsAngle: number[],
        opacity: number[],
        stroke: string[],
        strokeWidth: number[]
      }
    },
    marginTop: number[],
    plotArea: {
      bar: {
        barGap: number[],
        dataGroupPadding: number[],
        selectionOutline: {
          color: string[],
          opacity: number[],
          width: number[]
        }
      },
      dataPoint: {
        diameterDeselected: number[],
        diameterSelected: number[]
      },
      marginRight: number[],
      paletteRange: string[][],
      path: {
        strokeOpacity: number[],
        strokeWidthDeselected: number[],
        strokeWidthSelected: number[]
      },
      slice: Object,
    },
    vAxis: {
      fontSize: number[],
      gridLines: {
        opacity: number[],
        stroke: string[],
        strokeWidth: number[]
      },
      label: {
        fontSize: number[],
        fontWeight: string[],
        marginLeft: number[]
      },
      marginLeft: number[],
      stroke: string[],
      strokeWidth: number[],
      ticks: {
        opacity: number[],
        stroke: string[],
        strokeWidth: number[]
      }
    }
  },
  largeScreenSize: number,
  legend: {
    legendEntry:{
      symbol: {
        height:  [number],
        width:  [number],
      },
      text:{
        fontSize: [number],
        fontWeight: string[],
        marginLeft: [number]
      }
    },
    marginBottom: [number],
    marginTop: [number]
  },
  mediumScreenSize: number,
  subtitle: {
    fontSize: [number],
    fontWeight: string[],
    marginTop: [number],
  },
  title: {
    fontSize: [number],
    fontWeight: string[],
    marginTop: [number],
  },
  tooltip: {
    backgroundColor: string[],
    border: string[],
    borderRadius: string[],
    fadeInDuration: number[],
    fadeOutDuration: number[],
    font: string[],
    fontColor: string[],
    opacity: number[],
    padding: string[]
  },
}
