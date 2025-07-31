export interface Invite {
  header: string;
  mainPhoto: string;
  secondPhoto: string;
  locationInfo: { header: string; text: string };
  colorsInfo: {
    header: string,
    colors: string[],
    manInfo: {
        header: string,
        text: string
    }
    womanInfo: {
        header: string,
        text: string
    }
  }
  bottomInfo: {
    header: string,
    text: string,
    subtext: string
  }
  footerInfo: {
    text: string
  }
}
