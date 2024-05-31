// declare global {
//   const GOOCCBY: string;
// }
declare global {
  interface Window {
    [Track.key]: TrackConfig;
  }
}
