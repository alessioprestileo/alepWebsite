export interface iStylingObject {
  aspectRatio: number[],
  backgroundColor: string[],
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
      labelsAngle: string[],
      opacity: number[],
      stroke: string[],
      strokeWidth: number[]
    }
  },
  largeScreenSize: number,
  marginTop: number[],
  mediumScreenSize: number,
  plotArea: {
    bar: Object,
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
}
