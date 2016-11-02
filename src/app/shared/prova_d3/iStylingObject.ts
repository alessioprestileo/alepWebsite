export interface iStylingObject {
  aspectRatio: number[],
  largeScreenSize: number,
  marginTop: number,
  mediumScreenSize: number,
  plotArea: {
    marginRight: number,
    paletteRange: string[],
    strokeWidthDeselected: number[],
    strokeWidthSelected: number[]
  },
  vAxis: {
    fontSize: number,
    label: {
      fontSize: number,
      marginLeft: number
    },
    marginLeft: number,
    width: number
  }
}
