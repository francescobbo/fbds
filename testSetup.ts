import { configure } from "@testing-library/react";
import "@testing-library/jest-dom";

HTMLCanvasElement.prototype.getContext = () => null;
configure({ testIdAttribute: "data-fbds-test-id" });
