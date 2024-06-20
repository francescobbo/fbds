import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TextInput } from "./TextInput";
import { withActions } from "@storybook/addon-actions/decorator";
// import { fn } from "@storybook/test";

const meta = {
  title: "TextInput",
  component: TextInput,
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ["change", "input"],
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    id: "example",
    name: "example",
  },
};

export const WithLabel: Story = {
  args: {
    ...Primary.args,
    label: {
      children: "Label",
    },
  },
};

export const WithLabelInTitleContainer: Story = {
  args: {
    ...Primary.args,
    label: {
      children: "Label",
      wrapper: ({ children }) => <h1>{children}</h1>,
    },
  },
};

export const WithCustomAttributes: Story = {
  args: {
    ...Primary.args,
    label: {
      children: "Etiqueta",
      lang: "es",
      "aria-description": "Description",
      "data-testid": "label",
    },

    pattern: "[0-9]*",
    "aria-description": "My description",
    "data-testid": "input",
  },
};

export const WithHintAndError: Story = {
  args: {
    ...Primary.args,
    label: {
      children: "Label",
    },
    error: {
      children: "Error",
    },
    hint: {
      children: "Hint",
    },
  },
};

export const GovUk: Story = {
  args: {
    ...Primary.args,
    label: {
      children: "Label",
      wrapper: ({ children }) => <h1 className="mb-4 font-bold">{children}</h1>,
      className: "text-4xl",
    },
    error: {
      children: "Error",
    },
    hint: {
      children: "Hint",
    },
  },
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
    formGroup: {
      className: "space-y-3",
    },
    label: {
      children: "Label",
      className: "font-semibold",
    },
    hint: {
      children: "Hint",
    },
  },
};

export const CustomOrder: Story = {
  args: {
    ...Primary.args,
    formGroup: {
      className: "space-y-3",
    },
    label: {
      children: "Label",
      wrapper: ({ children }) => <h1>{children}</h1>,
      className: "text-4xl font-bold",
    },
    error: {
      children: "Error",
    },
    hint: {
      children: "Hint",
    },
    layoutOrder: ["label", "input", "hintOrError"],
  },
};

export const WithPrefix: Story = {
  args: {
    ...Primary.args,
    className: "pl-6",
    label: {
      children: "Amount",
    },
    prefix: {
      children: <span className="px-2.5">$</span>,
      inline: true,
    },
  },
};

export const WithSuffix: Story = {
  args: {
    ...Primary.args,
    className: "pr-6",
    label: {
      children: "Weight",
    },
    suffix: {
      children: <span className="px-2.5">kg</span>,
      inline: true,
    },
  },
};

export const WithHtmlValidation: Story = {
  args: {
    ...Primary.args,
    label: {
      children: "Label",
    },
    pattern: "[0-9]*",
    required: true,
  },
};

WithHtmlValidation.decorators = [
  (Story) => (
    <form onSubmit={(e) => e.preventDefault()}>
      <Story />
      <button type="submit">Submit</button>
    </form>
  ),
];
