import "react";

declare module "react" {
  interface CSSProperties {
    "--quantity"?: string;
    "--position"?: string;
  }
}
