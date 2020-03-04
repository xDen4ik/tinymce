
export interface RepositionDecision {
  x: number;
  y: number;
  width: number;
  height: number;
  maxHeight: number;
  maxWidth: number;
  direction: any;
  classes: {
    off: string[];
    on: string[]
  };
  label: string;
  candidateYforTest: number;
}
