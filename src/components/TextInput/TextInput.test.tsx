import * as React from "react";
import { render } from "@testing-library/react";
import { TextInput } from "./TextInput";
import { default as axe } from "axe-core";

describe("Input", () => {
  describe("default example", () => {
    let $container: ReturnType<typeof render>["container"];

    beforeEach(() => {
      const { container } = render(
        <TextInput
          id="your-name"
          name="user[your-name]"
          label={{ children: "How should we call you?" }}
        />,
      );

      $container = container;
    });

    it("sets the id", () => {
      expect($container.querySelector("input")).toHaveAttribute("id", "your-name");
    });

    it("sets the name", () => {
      expect($container.querySelector("input")).toHaveAttribute("name", "user[your-name]");
    });

    it("is accessible", async () => {
      const results = await axe.run($container);
      if (results.violations.length) {
        console.warn(results.violations);
      }

      expect(results.violations.length).toBe(0);
    });
  });

  describe("with a hint message", () => {
    let $container: ReturnType<typeof render>["container"];

    beforeEach(() => {
      const { container } = render(
        <TextInput
          id="your-name"
          name="user[your-name]"
          label={{ children: "How should we call you?" }}
          hint={{ children: "You're free to choose any name you like." }}
        />,
      );

      $container = container;
    });

    it("is accessible", async () => {
      const results = await axe.run($container);
      if (results.violations.length) {
        console.warn(results.violations);
      }

      expect(results.violations.length).toBe(0);
    });
  });

  describe("with a hint and an error message", () => {
    let $container: ReturnType<typeof render>["container"];

    beforeEach(() => {
      const { container } = render(
        <TextInput
          id="your-name"
          name="user[your-name]"
          label={{ children: "How should we call you?" }}
          hint={{ children: "You're free to choose any name you like." }}
          error={{ children: "But not that one." }}
        />,
      );

      $container = container;
    });

    it("sets the aria-invalid attribute", () => {
      expect($container.querySelector("input")).toHaveAttribute("aria-invalid", "true");
    });

    it("sets the aria-describedby attribute", () => {
      const describedBy = $container.querySelector("input")!.getAttribute("aria-describedby");
      expect(describedBy).toContain("your-name-hint");
      expect(describedBy).toContain("your-name-error");
    });

    it("is accessible", async () => {
      const results = await axe.run($container);
      if (results.violations.length) {
        console.warn(results.violations);
      }

      expect(results.violations.length).toBe(0);
    });
  });
});
